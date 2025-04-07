import { pgTable, pgEnum, varchar, timestamp, text, primaryKey, integer, unique, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// Enums
export const currencyEnum = pgEnum("currency", ["USD", "EUR", "GBP"]);

// Auth.js Required Models
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  email: varchar("email").unique(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image"),
  password: varchar("password"),
  confirmPassword: varchar("confirm_password"),
});

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type"),
    scope: varchar("scope"),
    idToken: text("id_token"),
    sessionState: varchar("session_state"),
  },
  (table) => {
    return {
      providerProviderAccountIdUnique: unique().on(table.provider, table.providerAccountId),
    };
  }
);

export const sessions = pgTable("sessions", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  sessionToken: varchar("session_token").notNull().unique(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier").notNull(),
    token: varchar("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (table) => {
    return {
      identifierTokenUnique: primaryKey(table.identifier, table.token),
    };
  }
);

// App specific models
export const expenses = pgTable("expenses", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: varchar("description").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  category: varchar("category"),
  product: varchar("product"),
  brand: varchar("brand"),
  date: timestamp("date").defaultNow().notNull(),
  invoiceUrl: varchar("invoice_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  billingCycle: varchar("billing_cycle").notNull(),
  nextPaymentDate: timestamp("next_payment_date"),
  startDate: timestamp("start_date").defaultNow().notNull(),
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const loans = pgTable("loans", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  lender: varchar("lender").notNull(),
  initialAmount: doublePrecision("initial_amount").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  interestRate: doublePrecision("interest_rate").notNull(),
  remainingAmount: doublePrecision("remaining_amount").notNull(),
  paymentAmount: doublePrecision("payment_amount"),
  paymentFrequency: varchar("payment_frequency"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const investments = pgTable("investments", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  initialValue: doublePrecision("initial_value").notNull(),
  currentValue: doublePrecision("current_value").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  quantity: doublePrecision("quantity"),
  purchaseDate: timestamp("purchase_date").notNull(),
  platform: varchar("platform"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const recurringPayments = pgTable("recurring_payments", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: varchar("description").notNull(),
  amount: doublePrecision("amount").notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  frequency: varchar("frequency").notNull(),
  nextDueDate: timestamp("next_due_date").notNull(),
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  expenses: many(expenses),
  subscriptions: many(subscriptions),
  loans: many(loans),
  investments: many(investments),
  recurringPayments: many(recurringPayments),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  user: one(users, {
    fields: [loans.userId],
    references: [users.id],
  }),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id],
  }),
}));

export const recurringPaymentsRelations = relations(recurringPayments, ({ one }) => ({
  user: one(users, {
    fields: [recurringPayments.userId],
    references: [users.id],
  }),
}));
