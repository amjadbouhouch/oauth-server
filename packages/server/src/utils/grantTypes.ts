/**
 *
 */
export const grantTypes = {
  password: 'password',
} as const;

export type grantType = keyof typeof grantTypes;
