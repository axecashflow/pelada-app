"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { ArrowLeft, User, Swords, Trophy, Target } from "lucide-react";

import { ProfileStatsProps } from "@/app/domain/users/values-objects/OutfieldPlayerStats";
import { getProfileStats, getUser } from "./actions";
import { useToast } from "@/app/ui/hooks/use-toast";
import { Skeleton } from "@/app/ui/components/skeleton";
import { UserViewModelType } from "@/app/application/users/view-models/UserViewModel";

const initialStats: ProfileStatsProps = {
  numberOfMatches: 0,
  assists: 0,
  shotsOnTarget: 0,
  shotsOffTarget: 0,
  shotsHitPost: 0,
  goalFromInsideBox: 0,
  goalFromOutsideBox: 0,
  ownGoal: 0,
  dribbleSuccess: 0,
  dribbleFailed: 0,
  passCompleted: 0,
  passFailed: 0,
  tackle: 0,
  interception: 0,
  block: 0,
  possessionLost: 0,
  ballRecovery: 0,
  foulCommitted: 0,
  foulSuffered: 0,
  yellowCard: 0,
  redCard: 0,
  penaltyWon: 0,
  penaltyMissed: 0,
  penaltyScored: 0,
  penaltyConceded: 0,
  freeKickScored: 0,
  nutmeg: 0,
  lob: 0,
  save: 0,
  saveInsideBox: 0,
  saveOutsideBox: 0,
  penaltySave: 0,
  goalConceded: 0,
};

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center px-3 py-2 bg-secondary/50 rounded-lg">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function StatSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        {icon} {title}
      </h4>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const { toast } = useToast();

  const [stats, setStats] = useState(initialStats);
  const [userInfo, setUserInfo] = useState<UserViewModelType>({
    createdAt: new Date(),
    email: "",
    id: "",
    username: "",
  });

  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const s = stats;
  const totalGoals =
    s.goalFromInsideBox +
    s.goalFromOutsideBox +
    s.penaltyScored +
    s.freeKickScored;

  const handleGetUserInfo = async () => {
    try {
      const user = await getUser();

      setUserInfo(user);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os detalhes do perfil. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const handleGetProfileStats = async () => {
    try {
      const profileStats = await getProfileStats();

      setStats(profileStats);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar as estatísticas. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
    const profileStats = await getProfileStats();

    setStats(profileStats);
  };

  useEffect(() => {
    handleGetUserInfo();
    handleGetProfileStats();
  }, []);

  if (loadingUserInfo || loadingStats) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-6 py-8 border-b border-border">
          <div className="max-w-md mx-auto">
            <Skeleton className="h-4 w-20 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          <div className="max-w-md mx-auto space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-8 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <button
            onClick={() => router.push("/group")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
              <p className="text-sm text-primary">{userInfo.username}</p>
              <p className="text-xs text-muted-foreground">{userInfo.email}</p>
            </div>
            {/* <button
              onClick={() => setEditing(!editing)}
              className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button> */}
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-6 py-6 overflow-auto">
        <div className="max-w-md mx-auto space-y-6">
          {/* Edit Form */}
          {/* <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl bg-card border border-border space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Dados Pessoais
                  </h3>
                  <SportInput
                    label="Nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                  <SportInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="seu@email.com"
                  />
                  <SportInput
                    label="Apelido"
                    value={form.nickname}
                    onChange={(e) =>
                      setForm({ ...form, nickname: e.target.value })
                    }
                    placeholder="Ex: Neymar Jr"
                  />
                  <SportInput
                    label="Posição"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    placeholder="Ex: Meia, Atacante, Goleiro"
                  />
                  <SportButton
                    onClick={() => setEditing(false)}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" /> Salvar
                  </SportButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <Swords className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">
                {s.numberOfMatches}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Partidas
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{totalGoals}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Gols
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-center">
              <Target className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-foreground">{s.assists}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                Assist.
              </p>
            </div>
          </motion.div>

          {/* Attacking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <StatSection icon={<span>⚽</span>} title="Ataque">
              <StatRow label="Gol Dentro da Área" value={s.goalFromInsideBox} />
              <StatRow label="Gol Fora da Área" value={s.goalFromOutsideBox} />
              <StatRow label="Gol Contra" value={s.ownGoal} />
              <StatRow label="Assistência" value={s.assists} />
              <StatRow label="Chute no Gol" value={s.shotsOnTarget} />
              <StatRow label="Chute pra Fora" value={s.shotsOffTarget} />
              <StatRow label="Chute na Trave" value={s.shotsHitPost} />
              <StatRow label="Drible Certo" value={s.dribbleSuccess} />
              <StatRow label="Drible Errado" value={s.dribbleFailed} />
            </StatSection>

            <StatSection icon={<span>🎯</span>} title="Passes">
              <StatRow label="Passe Certo" value={s.passCompleted} />
              <StatRow label="Passe Errado" value={s.passFailed} />
            </StatSection>

            <StatSection icon={<span>🛡</span>} title="Defesa">
              <StatRow label="Desarme" value={s.tackle} />
              <StatRow label="Interceptação" value={s.interception} />
              <StatRow label="Bloqueio" value={s.block} />
              <StatRow label="Posse Perdida" value={s.possessionLost} />
              <StatRow label="Recuperação de Bola" value={s.ballRecovery} />
            </StatSection>

            <StatSection icon={<span>⚖</span>} title="Disciplina">
              <StatRow label="Falta Cometida" value={s.foulCommitted} />
              <StatRow label="Falta Sofrida" value={s.foulSuffered} />
              <StatRow label="Cartão Amarelo" value={s.yellowCard} />
              <StatRow label="Cartão Vermelho" value={s.redCard} />
            </StatSection>

            <StatSection icon={<span>🏃</span>} title="Bola parada">
              <StatRow label="Pênalti Sofrido" value={s.penaltyWon} />
              <StatRow label="Pênalti Perdido" value={s.penaltyMissed} />
              <StatRow label="Pênalti Convertido" value={s.penaltyScored} />
              <StatRow label="Pênalti Cometido" value={s.penaltyConceded} />
              <StatRow label="Gol de Falta" value={s.freeKickScored} />
            </StatSection>

            <StatSection icon={<span>✨</span>} title="Habilidade">
              <StatRow label="Caneta" value={s.nutmeg} />
              <StatRow label="Chapéu" value={s.lob} />
            </StatSection>

            <StatSection icon={<span>🧤</span>} title="Goleiro">
              <StatRow label="Defesa" value={s.save} />
              <StatRow label="Defesa Dentro da Área" value={s.saveInsideBox} />
              <StatRow label="Defesa Fora da Área" value={s.saveOutsideBox} />
              <StatRow label="Defesa de Pênalti" value={s.penaltySave} />
              <StatRow label="Gol Sofrido" value={s.goalConceded} />
            </StatSection>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
