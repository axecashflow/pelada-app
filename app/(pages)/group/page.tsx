'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Trophy, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { SportButton } from '@/app/ui/components/SportButton';
import { useToast } from '@/app/ui/hooks/use-toast';
import { GroupViewModelType } from '@/app/application/group/view-models/types';

import { getGroups } from './actions';
import { gameModeLabels } from './utils';

export default function MyGroups() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<GroupViewModelType[]>([]);

  const handleOpenGroup = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleGetGroups = async () => {
    try {
      const response = await getGroups();

      setGroups(response);
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

  const renderEmptyGroups = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-foreground font-medium mb-1">Nenhum grupo ainda</p>
      <p className="text-sm text-muted-foreground mb-6">
        Crie um grupo para organizar suas peladas
      </p>
      <SportButton onClick={() => router.push('/group/create-group')}>
        <Plus className="w-4 h-4 mr-2" />
        Criar Grupo
      </SportButton>
    </motion.div>
  );

  const renderContent = () => {
    if (loading) return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full p-4 rounded-xl bg-card border border-border flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-muted animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );

    if (groups.length === 0) {
      return renderEmptyGroups();
    }

    return groups.map((group, index) => {
      return (
        <motion.button
          key={group.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleOpenGroup(group.id)}
          className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-all duration-200 flex items-center gap-4 text-left group"
        >
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold truncate">{group.name}</p>
            <p className="text-xs text-muted-foreground">
              {gameModeLabels[group.gameMode.type]}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
        </motion.button>
      );
    });
  }

  useEffect(() => {
    handleGetGroups();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 px-6 py-8 border-b border-border bg-background z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meus Grupos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {groups.length === 0
                ? 'Crie seu primeiro grupo'
                : `${groups.length} grupo${groups.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-[150px] pb-[100px]">
        <div className="max-w-md mx-auto space-y-3">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      {groups.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 px-6 py-6 border-t border-border bg-card z-10">
          <div className="max-w-md mx-auto">
            <SportButton onClick={() => router.push('/group/create-group')} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Novo Grupo
            </SportButton>
          </div>
        </footer>
      )}
    </div>
  );
}
