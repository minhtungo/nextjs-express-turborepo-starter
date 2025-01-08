import { relations } from 'drizzle-orm/relations';
import {
  account,
  refreshToken,
  resetPasswordToken,
  twoFactorConfirmation,
  user,
  userSetting,
  verificationToken,
} from './schema';

export const userSettingRelations = relations(userSetting, ({ one }) => ({
  user: one(user, {
    fields: [userSetting.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  userSettings: many(userSetting),
  twoFactorConfirmations: many(twoFactorConfirmation),
  verificationTokens: many(verificationToken),
  refreshTokens: many(refreshToken),
  accounts: many(account),
  resetPasswordTokens: many(resetPasswordToken),
}));

export const twoFactorConfirmationRelations = relations(twoFactorConfirmation, ({ one }) => ({
  user: one(user, {
    fields: [twoFactorConfirmation.userId],
    references: [user.id],
  }),
}));

export const verificationTokenRelations = relations(verificationToken, ({ one }) => ({
  user: one(user, {
    fields: [verificationToken.userId],
    references: [user.id],
  }),
}));

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
  user: one(user, {
    fields: [refreshToken.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const resetPasswordTokenRelations = relations(resetPasswordToken, ({ one }) => ({
  user: one(user, {
    fields: [resetPasswordToken.userId],
    references: [user.id],
  }),
}));
