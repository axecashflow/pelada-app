"use client";

import { motion } from "framer-motion";
import { Link2, Unlink, User, X } from "lucide-react";

import { MemberStatusEnum } from "@/app/domain/group/enum/Member";
import { MemberViewModelType } from "@/app/application/group/view-models/types";

import { cn, memberStatusLabels } from "../lib/utils";

interface MemberCardProps {
  member: MemberViewModelType;
  onRemove?: () => void;
  isClaimed?: boolean;
  onClaim?: (memberId: string) => void;
}

export function MemberCard({
  member,
  onRemove,
  isClaimed,
  onClaim,
}: MemberCardProps) {
  const isActive = member.status === MemberStatusEnum.ACTIVE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
        isActive
          ? "bg-card border-border hover:border-primary/50"
          : "bg-muted/30 border-border/50 opacity-60",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isActive ? "gradient-primary" : "bg-muted",
          )}
        >
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{member.name}</p>
          <p
            className={cn(
              "text-xs",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            {memberStatusLabels[member.status]}
          </p>
        </div>
      </div>

      {(onClaim ) && (
        <button
          onClick={() => {
            onClaim?.(member.id);
          }}
          disabled={isClaimed}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            isClaimed
              ? "bg-primary/20 text-primary hover:bg-primary/30"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
          title={isClaimed ? "Desvincular perfil" : "Vincular ao meu perfil"}
        >
          {isClaimed ? (
            <>
              <Unlink className="w-3.5 h-3.5" />
              Vinculado
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              Vincular
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
