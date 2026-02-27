'use client';

import { motion } from 'framer-motion';
import { User, X } from 'lucide-react';

import { MemberStatusEnum } from '@/app/domain/group/enum/Member';
import { MemberViewModelType } from '@/app/application/group/view-models/types';

import { cn, memberStatusLabels } from '../lib/utils';

interface MemberCardProps {
  member: MemberViewModelType;
  onRemove?: () => void;
}

export function MemberCard({ member, onRemove }: MemberCardProps) {
  const isActive = member.status === MemberStatusEnum.ACTIVE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={cn(
        'flex items-center justify-between p-4 rounded-xl border transition-all duration-200',
        isActive
          ? 'bg-card border-border hover:border-primary/50'
          : 'bg-muted/30 border-border/50 opacity-60'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isActive ? 'gradient-primary' : 'bg-muted'
          )}
        >
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{member.name}</p>
          <p
            className={cn(
              'text-xs',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {memberStatusLabels[member.status]}
          </p>
        </div>
      </div>

      {isActive && onRemove && (
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Remover membro"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
