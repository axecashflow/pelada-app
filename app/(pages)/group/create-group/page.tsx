'use client';

import { SubmitEventHandler, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { GameModeEnum } from '@/app/domain/group/enum/GameMode';
import { SportButton } from '@/app/ui/components/SportButton';
import { SportInput } from '@/app/ui/components/SportInput';
import { SportSelect } from '@/app/ui/components/SportSelect';

import { useToast } from '@/app/ui/hooks/use-toast';
import { domainErrorMessages } from '@/app/ui/lib/utils';
import { DomainErrorName } from '@/app/domain/shared/DomainError';

import { gameModeLabels } from '../utils';
import { createGroupAction } from './actions';

export default function CreateGroup() {
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const gameModeOptions = Object.entries(gameModeLabels).map(([value, label]) => ({
    value,
    label,
  }));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const gameModeType = formData.get('gameModeType') as GameModeEnum;
    const playersPerTeam = Number(formData.get('gameModePlayersPerTeam'));

    try {
      await createGroupAction({
        name,
        gameMode: {
          type: gameModeType,
          playersPerTeam,
        },
      });

      router.push('/group');

      toast({
        title: 'Pelada criada!',
        description: 'Sua pelada foi criada com sucesso.',
      });
    } catch (error) {
      const defaultMessage = 'Erro ao criar a pelada. Tente novamente.';

      const errorMessage = error instanceof Error
        ? domainErrorMessages[error.message as DomainErrorName] ?? defaultMessage
        : defaultMessage;

      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-8 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Criar Pelada</h1>
              <p className="text-sm text-muted-foreground">Configure sua pelada</p>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-6"
        >
          <SportInput
            id="name"
            name="name"
            label="Nome da Pelada"
            placeholder="Ex: Pelada de Quinta"
          />

          <SportSelect
            id="gameModeType"
            name="gameModeType"
            label="Modalidade"
            options={gameModeOptions}
          />

          <SportInput
            id="gameModePlayersPerTeam"
            name="gameModePlayersPerTeam"
            label="Número de Jogadores por Time"
            placeholder="Ex: 5"
            type="number"
          />

          <div className="pt-4">
            <SportButton
              type="submit"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando pelada...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </SportButton>
          </div>
        </motion.form>
      </main>

      <div className="h-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-primary blur-3xl"
        />
      </div>
    </div>
  );
}