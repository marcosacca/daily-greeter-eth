import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  userAddress: text("user_address").notNull(),
  type: text("type").notNull(), // "greeting" or "mint"
  status: text("status").notNull(), // "pending", "confirmed", "failed"
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Define NFT schema
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  ownerAddress: text("owner_address").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  txHash: text("tx_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  tokenURI: text("token_uri"),
});

export const insertNftSchema = createInsertSchema(nfts).omit({
  id: true,
});

export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;
