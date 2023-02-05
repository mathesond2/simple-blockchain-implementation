import * as crypto from 'crypto';
import type { Tx } from '../types';

interface iBlock {
  hash: string;
  txns: Tx[];
  prevHash: string;
  computeHash(): string;
}

export default class Block implements iBlock {
  hash: string;
  constructor(
    public txns: Tx[],
    public prevHash: string = '',
  ) {
    this.txns = txns;
    this.prevHash = prevHash;
    this.hash = this.computeHash();
  }

  public computeHash(): string {
    return crypto.createHash('sha256').update(this.prevHash + JSON.stringify(this.txns)).digest('hex');
  }
}