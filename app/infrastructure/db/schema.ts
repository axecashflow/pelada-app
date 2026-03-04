import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

import { GameModePersistence } from "../repositories/types/GameModePersistence";

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  gameMode: jsonb("game_mode").$type<GameModePersistence>().notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
});

export const groupManagers = pgTable("group_managers", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
});

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),
  status: text("status").notNull(),
  matchDate: timestamp("match_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id),
  teamType: text("team_type").notNull(),
});

export const matchPlayers = pgTable("match_players", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id),
  name: text("name").notNull(),
  position: text("position"),
  presence: text("presence").notNull(),
  rating: text("rating").notNull(),
});

export const matchStats = pgTable("match_stats", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => matches.id),
  playerId: text("player_id")
    .notNull()
    .references(() => matchPlayers.playerId),
  type: text("type").notNull(),
  value: text("value").notNull(),
  weight: text("weight").notNull(),
  impact: text("impact").notNull(),
});

export const profileStats = pgTable("profile_stats", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  numberOfMatches: text("number_of_matches").notNull().default("0"),
  assists: text("assists").notNull().default("0"),
  shotsOnTarget: text("shots_on_target").notNull().default("0"),
  shotsOffTarget: text("shots_off_target").notNull().default("0"),
  shotsHitPost: text("shots_hit_post").notNull().default("0"),
  goalFromInsideBox: text("goal_from_inside_box").notNull().default("0"),
  goalFromOutsideBox: text("goal_from_outside_box").notNull().default("0"),
  ownGoal: text("own_goal").notNull().default("0"),
  dribbleSuccess: text("dribble_success").notNull().default("0"),
  dribbleFailed: text("dribble_failed").notNull().default("0"),
  passCompleted: text("pass_completed").notNull().default("0"),
  passFailed: text("pass_failed").notNull().default("0"),
  tackle: text("tackle").notNull().default("0"),
  interception: text("interception").notNull().default("0"),
  block: text("block").notNull().default("0"),
  possessionLost: text("possession_lost").notNull().default("0"),
  ballRecovery: text("ball_recovery").notNull().default("0"),
  foulCommitted: text("foul_committed").notNull().default("0"),
  foulSuffered: text("foul_suffered").notNull().default("0"),
  yellowCard: text("yellow_card").notNull().default("0"),
  redCard: text("red_card").notNull().default("0"),
  penaltyWon: text("penalty_won").notNull().default("0"),
  penaltyMissed: text("penalty_missed").notNull().default("0"),
  penaltyScored: text("penalty_scored").notNull().default("0"),
  penaltyConceded: text("penalty_conceded").notNull().default("0"),
  freeKickScored: text("free_kick_scored").notNull().default("0"),
  nutmeg: text("nutmeg").notNull().default("0"),
  lob: text("lob").notNull().default("0"),
  save: text("save").notNull().default("0"),
  saveInsideBox: text("save_inside_box").notNull().default("0"),
  saveOutsideBox: text("save_outside_box").notNull().default("0"),
  penaltySave: text("penalty_save").notNull().default("0"),
  goalConceded: text("goal_conceded").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const memberUserLink = pgTable("member_user_link", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  memberId: text("member_id")
    .notNull()
    .references(() => members.id),
});
