'use client';

import { SubmitEventHandler, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowLeft, Check, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { GroupViewModelType } from '@/app/application/group/view-models/types';

import { getGroupDetails } from '../actions';
import { MemberStatusEnum } from '@/app/domain/group/enum/Member';
import { useToast } from '@/app/ui/hooks/use-toast';
import { SportInput } from '@/app/ui/components/SportInput';
import { SportButton } from '@/app/ui/components/SportButton';
import { MemberCard } from '@/app/ui/components/MemberCard';
import { addMemberToGroup } from './actions';
import { domainErrorMessages } from '@/app/ui/lib/utils';
import { DomainErrorName } from '@/app/domain/shared/DomainError';

type AddMembersPageProps = {
  id: string;
};

export default function AddMembers() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<AddMembersPageProps>();

  const [loading, setLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<GroupViewModelType | null>(null);

  const activeMembers = currentGroup?.members.filter(
    (m) => m.status === MemberStatusEnum.ACTIVE
  ) ?? [];

  const handleAddMember: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const memberName = formData.get('memberName') as string;

    setLoading(true);

    try {
      await addMemberToGroup({
        groupId: params.id,
        memberName,
      });

      toast({
        title: 'Jogador adicionado!',
        description: 'O jogador foi adicionado com sucesso.',
      });

      handleGetGroupDetails();
    } catch (error) {
      const defaultMessage = 'Erro ao adicionar o jogador. Tente novamente.';

      const errorMessage = error instanceof Error
        ? domainErrorMessages[error.message as DomainErrorName] ?? defaultMessage
        : defaultMessage;

      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetGroupDetails = async () => {
    try {
      const response = await getGroupDetails(params.id);

      setCurrentGroup(response);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os grupos. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const renderGroupName = () => {
    if (loading) return (
      <div>
        <div className="h-7 w-48 bg-muted animate-pulse rounded mb-1" />
        <div className="h-4 w-28 bg-muted animate-pulse rounded" />
      </div>
    );

    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Adicionar Membros</h1>
        <p className="text-sm text-muted-foreground">{currentGroup?.name}</p>
      </div>
    )
  }

  const renderFormContent = () => {
    if (loading) return (
      <div className="space-y-8">
        {/* Form skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
          </div>
          <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
        </div>
        {/* Members list skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-8 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    return (
      <>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleAddMember}
          className="space-y-4"
        >
          <SportInput
            id="memberName"
            name="memberName"
            label="Nome do Jogador"
            placeholder="Ex: João Silva"
          />

          <SportButton type="submit" variant="secondary" className="w-full">
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Jogador
          </SportButton>
        </motion.form>

        {/* Members List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Jogadores
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{activeMembers.length}</span>
            </div>
          </div>

          {activeMembers.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Nenhum jogador adicionado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {activeMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onRemove={() => false}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </>
    )
  }

  useEffect(() => {
    handleGetGroupDetails();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 px-6 py-8 border-b border-border bg-background z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <UserPlus className="w-6 h-6 text-primary-foreground" />
            </div>

            {renderGroupName()}
          </div>
        </motion.div>
      </header>

      {/* Form */}
      <main className="flex-1 overflow-y-auto pt-[180px] pb-[140px]">
        <div className="max-w-md mx-auto space-y-8">
          {renderFormContent()}
        </div>
      </main>

      {/* Footer */}
      {activeMembers.length > 0 && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 px-6 py-6 border-t border-border bg-card z-10"
        >
          <div className="max-w-md mx-auto">
            <SportButton onClick={() => router.back()} size="lg" className="w-full">
              <Check className="w-5 h-5 mr-2" />
              Finalizar ({activeMembers.length} jogadores)
            </SportButton>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
