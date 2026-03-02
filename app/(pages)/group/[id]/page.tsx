"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Calendar,
  ArrowLeft,
  User,
  Swords,
  BarChart3,
  Check,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useParams } from "next/navigation";

import { GroupViewModelType } from "@/app/application/group/view-models/types";
import { MemberStatusEnum } from "@/app/domain/group/enum/Member";
import { MemberCard } from "@/app/ui/components/MemberCard";
import { SportButton } from "@/app/ui/components/SportButton";
import { useToast } from "@/app/ui/hooks/use-toast";

import { gameModeLabels } from "../utils";
import { getGroupDetails } from "./actions";

type GroupDetailsPageProps = {
  id: string;
};

export default function GroupDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<GroupDetailsPageProps>();

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<GroupViewModelType | null>(
    null,
  );

  const handleShareLink = async () => {
    const fakeLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${currentGroup?.id}`;
    try {
      await navigator.clipboard.writeText(fakeLink);
      setCopied(true);
      toast({
        title: "Link copiado!",
        description: "Envie o link para convidar um gerente ao grupo.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Não foi possível copiar",
        description: fakeLink,
        variant: "destructive",
      });
    }
  };

  const handleGetGroupDetails = async () => {
    try {
      const response = await getGroupDetails(params.id);

      setCurrentGroup(response);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os grupos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetGroupDetails();
  }, []);

  const renderHeaderTitle = () => {
    if (loading)
      return (
        <>
          <div className="h-7 w-40 bg-muted animate-pulse rounded mb-1" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </>
      );

    return (
      <>
        <h1 className="text-2xl font-bold text-foreground">
          {currentGroup!.name}
        </h1>
        <p className="text-sm text-primary">
          {gameModeLabels[currentGroup!.gameMode.type]}
        </p>
      </>
    );
  };

  const renderContent = () => {
    if (loading || !currentGroup)
      return (
        <div className="px-6 py-6">
          <div className="max-w-md mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="h-3 w-20 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-7 w-12 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
            <div className="h-5 w-16 bg-muted animate-pulse rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card border border-border flex items-center gap-3"
                >
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
        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-6"
        >
          <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">
                  Jogadores
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {activeMembers.length}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Criado</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {format(currentGroup.createdAt, "dd/MM", { locale: ptBR })}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Members */}
        <section className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">Elenco</h2>

            <div className="space-y-3">
              {activeMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <MemberCard member={member} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </>
    );
  };

  const activeMembers =
    currentGroup?.members.filter((m) => m.status === MemberStatusEnum.ACTIVE) ??
    [];

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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>{renderHeaderTitle()}</div>
            </div>

            {!loading && (
              <button
                onClick={handleShareLink}
                className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors"
                title="Convidar gerente"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </motion.div>
      </header>

      <div className="flex-1 overflow-y-auto pt-[150px] pb-[160px]">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-6 border-t border-border bg-card z-10">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex gap-3">
            <SportButton
              variant="secondary"
              className="flex-1"
              onClick={() => router.push(`/group/${currentGroup?.id}/members`)}
            >
              <User className="w-4 h-4 mr-2" />
              Adicionar
            </SportButton>

            <SportButton
              className="flex-1"
              onClick={() => router.push(`/match/${currentGroup?.id}`)}
            >
              <Swords className="w-4 h-4 mr-2" />
              Iniciar Partida
            </SportButton>
          </div>

          <SportButton
            onClick={() => router.push(`/stats/${currentGroup?.id}`)}
            variant="secondary"
            className="w-full"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Resumo do Dia
          </SportButton>
        </div>
      </footer>
    </div>
  );
}
