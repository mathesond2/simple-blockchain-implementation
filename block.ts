import * as sha256 from 'crypto-js/sha256';
import type { Txn } from './util/types';

interface iBlock {
  hash: string;
  txns: Txn[];
  prevHash: string;
  computeHash(): string;
}

export default class Block implements iBlock {
  hash: string;
  constructor(
    public txns: Txn[],
    public prevHash: string = '',
  ) {
    this.txns = txns;
    this.prevHash = prevHash;
    this.hash = this.computeHash();
  }

  public computeHash(): string {
    return sha256(this.prevHash + JSON.stringify(this.txns)).toString();
  }
}