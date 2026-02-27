export type DomainErrorName =
  | 'GroupNameRequired'
  | 'GroupInactiveCannotAddMembers'
  | 'MemberAlreadyInGroup'
  | 'MemberLeftGroupCannotRejoin'
  | 'MemberNotFound'
  | 'MemberNameRequired'
  | 'OnlyActiveMembersCanBeSuspended'
  | 'CannotActivateMemberThatLeftGroup'
  | 'CannotDeactivateMembersNotActive'
  | 'NumberOfTeamsMustBeGreaterThanZero'
  | 'GroupIdCannotBeEmpty'
  | 'MemberIdCannotBeEmpty'
  | 'EmailCannotBeEmpty'
  | 'PasswordCannotBeEmpty'
  | 'UserIdCannotBeEmpty'
  | 'UsernameCannotBeEmpty'
  | 'InvalidEmailFormat'
  | 'PasswordTooShort'
  | 'PasswordMustContainNumber'
  | 'PasswordMustContainSpecialCharacter'
  | 'MemberIdCannotBeEmpty'
  | 'UsernameInvalidLength'
  | 'UsernameInvalidCharacters'
  | 'UsernameCannotStartOrEndWithDot'
  | 'UsernameCannotContainConsecutiveDots'
  | 'UsernameNotFound'
  | 'InvalidPassword'
  | 'GroupOwnerIdRequired'
  | 'MatchIdCannotBeEmpty'
  | 'TeamIdCannotBeEmpty'
  | 'StatValueMustBePositive'
  | 'WeightMustBePositive'
  | 'PlayerAlreadyInTeam'
  | 'PlayerNotFoundInTeam'
  | 'MatchNotFound'
  | 'PlayerIdCannotBeEmpty';

export class DomainError extends Error {
  constructor(public readonly domainError: DomainErrorName) {
    super(domainError);
    Error.captureStackTrace(this, this.constructor);
  }
}
