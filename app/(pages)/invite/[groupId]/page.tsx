"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Shield, Users, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { useToast } from "@/app/ui/hooks/use-toast";
import { SportButton } from "@/app/ui/components/SportButton";
import { domainErrorMessages } from "@/app/ui/lib/utils";
import { DomainErrorName } from "@/app/domain/shared/DomainError";
import { GroupViewModelType } from "@/app/application/group/view-models/types";

import { getGroupDetails, inviteManager } from "./actions";
import { gameModeLabels } from "./utils";

type AcceptInviteProps = {
  groupId: string;
};

export default function AcceptInvite() {
  const router = useRouter();
  const params = useParams<AcceptInviteProps>();
  const { toast } = useToast();

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<GroupViewModelType | null>(
    null,
  );

  const { groupId } = params;

  const handleGetGroupDetails = async () => {
    try {
      setLoadingGroup(true);
      const response = await getGroupDetails(params.groupId);

      setCurrentGroup(response);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os detalhes do grupo. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoadingGroup(false);
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);

      await inviteManager(groupId);

      setAccepted(true);
    } catch (error) {
      const defaultMessage = "Erro ao aceitar convite. Tente novamente.";

      const errorMessage =
        error instanceof Error
          ? (domainErrorMessages[error.message as DomainErrorName] ??
            defaultMessage)
          : defaultMessage;

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetGroupDetails();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6 text-center">
          <div className="flex justify-center">
            {loadingGroup ? (
              <div className="w-16 h-16 rounded-2xl bg-muted animate-pulse" />
            ) : (
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                {accepted ? (
                  <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <Trophy className="w-8 h-8 text-primary-foreground" />
                )}
              </div>
            )}
          </div>

          {loadingGroup ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-muted animate-pulse rounded mx-auto" />
                <div className="h-4 w-56 bg-muted animate-pulse rounded mx-auto" />
              </div>
              <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
                <div className="h-6 w-36 bg-muted animate-pulse rounded mx-auto" />
                <div className="flex items-center justify-center gap-4">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="text-left space-y-2">
                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                <div className="space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-4 w-full bg-muted animate-pulse rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-11 w-full bg-muted animate-pulse rounded-xl" />
                <div className="h-11 w-full bg-muted animate-pulse rounded-xl" />
              </div>
            </div>
          ) : accepted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h1 className="text-2xl font-bold text-foreground">
                Você entrou!
              </h1>
              <p className="text-sm text-muted-foreground">
                Agora você é{" "}
                <span className="text-primary font-medium">gerente</span> do
                grupo{" "}
                <span className="font-semibold text-foreground">
                  {currentGroup?.name}
                </span>
                .
              </p>
              <p className="text-xs text-muted-foreground">
                Você pode criar partidas e adicionar membros.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Convite de Grupo
                </h1>
                <p className="text-sm text-muted-foreground">
                  Você foi convidado para participar como{" "}
                  <span className="text-primary font-medium">gerente</span>
                </p>
              </div>

              <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">
                    {currentGroup?.name}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {currentGroup?.members.length} jogadores
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {currentGroup?.gameMode.type
                      ? gameModeLabels[currentGroup?.gameMode.type as keyof typeof gameModeLabels]
                      : ""}
                  </span>
                </div>
              </div>

              {/* Permissions */}
              <div className="text-left space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                  Permissões de gerente
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Criar e gerenciar partidas",
                    "Adicionar e remover membros",
                    "Editar configurações do grupo",
                  ].map((perm) => (
                    <li
                      key={perm}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {!loadingGroup && (
            <div className="space-y-3 pt-2">
              {accepted ? (
                <SportButton
                  onClick={() => router.push(`/group/${groupId}`)}
                  className="w-full"
                >
                  Ir para o grupo
                </SportButton>
              ) : (
                <>
                  <SportButton
                    onClick={handleAccept}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Aceitar Convite"}
                  </SportButton>
                  <SportButton
                    onClick={() => router.push("/")}
                    variant="secondary"
                    className="w-full"
                  >
                    Recusar
                  </SportButton>
                </>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          ID do convite: {groupId}
        </p>
      </motion.div>
    </div>
  );
}
