export type Account = string; // UUID - if more time, would use a UUID type (https://stackoverflow.com/questions/37144672/guid-uuid-type-in-typescript?noredirect=1&lq=1)

export type Tx = {
  from: Account,
  to: Account,
  value: number,
};