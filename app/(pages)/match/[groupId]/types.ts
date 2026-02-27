export type PlayerItem = {
  id: string;
  name: string;
}

export type ScheduleGameParams = {
  groupId: string;
}

export type ColumnId = 'available' | 'teamA' | 'teamB';

export type ColumnConfig = {
  id: ColumnId;
  title: string;
  accent: string;
  icon: string;
  onlyTotal: boolean;
};
