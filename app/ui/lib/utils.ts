import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { DomainErrorName } from "@/app/domain/shared/DomainError";
import { MemberStatusEnum } from "@/app/domain/group/enum/Member";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const domainErrorMessages: Record<DomainErrorName, string> = {
  GroupIdCannotBeEmpty: 'Ocorreu um erro ao acessar o grupo. Por favor, tente novamente.',
  GroupNameRequired: 'O nome do grupo é obrigatório.',
  GroupInactiveCannotAddMembers: 'Não é possível adicionar membros a um grupo inativo.',
  CannotActivateMemberThatLeftGroup: 'Não é possível ativar um membro que saiu do grupo.',
  CannotDeactivateMembersNotActive: 'Não é possível desativar membros que não estão ativos.',
  EmailCannotBeEmpty: 'O email é obrigatório.',
  InvalidEmailFormat: 'O formato do email é inválido.',
  MemberAlreadyInGroup: 'O membro já está no grupo.',
  MemberIdCannotBeEmpty: 'Ocorreu um erro ao acessar o membro. Por favor, tente novamente.',
  MemberLeftGroupCannotRejoin: 'Não é possível adicionar um membro que saiu do grupo.',
  MemberNameRequired: 'O nome do membro é obrigatório.',
  MemberNotFound: 'Membro não encontrado.',
  NumberOfTeamsMustBeGreaterThanZero: 'O número de jogadores deve ser maior que zero.',
  OnlyActiveMembersCanBeSuspended: 'Apenas membros ativos podem ser suspensos.',
  PasswordCannotBeEmpty: 'A senha é obrigatória.',
  PasswordTooShort: 'A senha deve ter pelo menos 8 caracteres.',
  PasswordMustContainNumber: 'A senha deve conter pelo menos um número.',
  PasswordMustContainSpecialCharacter: 'A senha deve conter pelo menos um caractere especial.',
  UserIdCannotBeEmpty: 'Ocorreu um erro ao acessar o usuário. Por favor, tente novamente.',
  UsernameCannotBeEmpty: 'O nome de usuário é obrigatório.',
  UsernameInvalidLength: 'O nome de usuário deve ter entre 3 e 30 caracteres.',
  UsernameInvalidCharacters: 'O nome de usuário pode conter apenas letras, números, ponto (.) e underline (_).',
  UsernameCannotStartOrEndWithDot: 'O nome de usuário não pode começar ou terminar com ponto.',
  UsernameCannotContainConsecutiveDots: 'O nome de usuário não pode conter pontos consecutivos.',
  UsernameNotFound: 'Não foi possível encontrar um usuário com esse nome de usuário.',
  InvalidPassword: 'A senha fornecida é inválida.',
  GroupOwnerIdRequired: 'Ocorreu um erro ao criar o grupo. Por favor, tente novamente.',
  MatchIdCannotBeEmpty: 'Ocorreu um erro ao acessar a partida. Por favor, tente novamente.',
  TeamIdCannotBeEmpty: 'Ocorreu um erro ao acessar o time. Por favor, tente novamente.',
  StatValueMustBePositive: 'O valor da estatística deve ser positivo.',
  WeightMustBePositive: 'O peso da estatística deve ser positivo.',
  PlayerIdCannotBeEmpty: 'Ocorreu um erro ao acessar os dados do jogador. Por favor, tente novamente.',
  PlayerAlreadyInTeam: 'O jogador já está no time.',
  PlayerNotFoundInTeam: 'O jogador não foi encontrado no time.',
  MatchNotFound: 'Partida não encontrada.',
};

export const memberStatusLabels: Record<MemberStatusEnum, string> = {
  [MemberStatusEnum.ACTIVE]: 'Ativo',
  [MemberStatusEnum.SUSPENDED]: 'Suspenso',
  [MemberStatusEnum.INACTIVE]: 'Inativo',
  [MemberStatusEnum.LEFT]: 'Saiu',
};
