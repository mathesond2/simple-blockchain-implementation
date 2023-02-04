export type Account = 'accountA' | 'accountB';

export type Txn = {
  from: Account,
  to: Account,
  value: number,
};