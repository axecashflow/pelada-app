import {
  pgTable,
  text,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

import { GameModePersistence } from '../repositories/types/GameModePersistence';

export const groups = pgTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  gameMode: jsonb('game_mode').$type<GameModePersistence>().notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
});

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull(),
  groupId: text('group_id')
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
