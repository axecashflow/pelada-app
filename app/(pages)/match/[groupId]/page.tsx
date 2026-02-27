'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Swords, ArrowLeft, Users, Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

import { GroupViewModelType } from '@/app/application/group/view-models/types';
import { useToast } from '@/app/ui/hooks/use-toast';
import { MemberStatusEnum } from '@/app/domain/group/enum/Member';
import { SportButton } from '@/app/ui/components/SportButton';
import { DomainErrorName } from '@/app/domain/shared/DomainError';
import { domainErrorMessages } from '@/app/ui/lib/utils';

import { ColumnConfig, ColumnId, PlayerItem, ScheduleGameParams } from './types';
import { createMatch, getGroupDetails } from './actions';

export default function ScheduleGame() {
  const router = useRouter();
  const params = useParams<ScheduleGameParams>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<GroupViewModelType | null>(null);

  const [columns, setColumns] = useState<Record<ColumnId, PlayerItem[]>>({
    available: [],
    teamA: [],
    teamB: [],
  });

  const isValidTeamA = columns.teamA.length === currentGroup?.gameMode.playersPerTeam;
  const isValidTeamB = columns.teamB.length === currentGroup?.gameMode.playersPerTeam;
  const isValid = isValidTeamA && isValidTeamB;

  const columnConfig: ColumnConfig[] = [
    { id: 'teamA', title: 'Time A', accent: 'hsl(145 70% 45%)', icon: '🟢', onlyTotal: false },
    { id: 'available', title: 'Disponíveis', accent: 'hsl(160 10% 55%)', icon: '⚽', onlyTotal: true },
    { id: 'teamB', title: 'Time B', accent: 'hsl(200 70% 50%)', icon: '🔵', onlyTotal: false },
  ];

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId as ColumnId;
    const destCol = destination.droppableId as ColumnId;

    if (destCol !== 'available' && sourceCol !== destCol && currentGroup) {
      const maxPlayers = currentGroup.gameMode.playersPerTeam;

      if (columns[destCol].length >= maxPlayers) {
        toast({
          title: 'Time completo',
          description: `O ${destCol === 'teamA' ? 'Time A' : 'Time B'} já possui ${maxPlayers} jogadores.`,
          variant: 'destructive',
        });
        return;
      }
    }

    setColumns((prev) => {
      const sourceItems = [...prev[sourceCol]];
      const destItems = sourceCol === destCol ? sourceItems : [...prev[destCol]];
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);

      return {
        ...prev,
        [sourceCol]: sourceItems,
        ...(sourceCol !== destCol ? { [destCol]: destItems } : {}),
      };
    });
  }, [columns, currentGroup, toast]);

  const handleGetGroupDetails = async () => {
    try {
      const response = await getGroupDetails(params.groupId);

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

  const handleConfirm = async () => {
    if (!currentGroup) return;

    setLoading(true);

    if (!isValid) {
      toast({
        title: 'Times incompletos',
        description: `Cada time deve conter exatamente ${currentGroup.gameMode.playersPerTeam} jogadores.`,
        variant: 'destructive',
      });

      return;
    }

    try {
      const matchId = await createMatch(params.groupId, columns);

      toast({
        title: 'Partida criada',
        description: 'A pelada foi criada com sucesso!',
      });

      router.replace(`/liveMatch/${matchId}`);

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
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetGroupDetails();
  }, []);

  useEffect(() => {
    if (!currentGroup) {
      return;
    }

    const active = currentGroup.members
      .filter((m) => m.status === MemberStatusEnum.ACTIVE)
      .map((m) => ({ id: m.id, name: m.name }));

    setColumns({ available: active, teamA: [], teamB: [] });
  }, [currentGroup]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 px-6 py-8 border-b border-border bg-background z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
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
              <Swords className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              {loading ? (
                <>
                  <div className="h-7 w-48 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">Criar Partida</h1>
                  <p className="text-sm text-muted-foreground">{currentGroup?.name}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pt-[180px] pb-[140px]">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-20 bg-muted animate-pulse rounded mx-auto" />
                  <div className="rounded-xl bg-card border border-border p-3 min-h-[200px] space-y-2">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-11 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground text-center mb-4">
                Arraste os jogadores para montar os times
              </p>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-3 gap-3">
                  {columnConfig.map((col) => (
                    <div key={col.id} className="flex flex-col">
                      <div className="text-center mb-2">
                        <span className="text-lg">{col.icon}</span>
                        <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {columns[col.id].length} {' '}
                          {col.onlyTotal ? '' : ` / ${currentGroup?.gameMode.playersPerTeam}`}
                          {col.onlyTotal ? ' jogadores' : ' vagas'}
                        </span>
                      </div>

                      <Droppable droppableId={col.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 rounded-xl border-2 border-dashed p-2 min-h-[180px] transition-colors ${snapshot.isDraggingOver
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-card/50'
                              }`}
                          >
                            {columns[col.id].map((player, index) => (
                              <Draggable key={player.id} draggableId={player.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`mb-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all select-none ${snapshot.isDragging
                                      ? 'bg-primary text-primary-foreground shadow-glow scale-105'
                                      : 'bg-card border border-border text-foreground hover:border-primary/50'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Users className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                                      <span className="truncate">{player.name}</span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {columns[col.id].length === 0 && !snapshot.isDraggingOver && (
                              <p className="text-xs text-muted-foreground text-center mt-8 opacity-60">
                                Arraste aqui
                              </p>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      {!loading && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 px-6 py-6 border-t border-border bg-card z-10"
        >
          <div className="max-w-2xl mx-auto">
            <SportButton
              onClick={handleConfirm}
              size="lg"
              className="w-full"
              disabled={!isValid}
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar Times
            </SportButton>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
