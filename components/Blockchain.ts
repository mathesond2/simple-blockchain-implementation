import Block from './Block';
import type { Txn, Account } from '../util/types';
import { acctA, acctB } from '../util/constants';

interface iBlockChain {
  getLatestBlock(): Block;
  getBlockAtAddress(hash: string): Block | undefined;
  addBlock(newBlock: Block): void;
  isValidChain(): boolean;
}

export default class BlockChain implements iBlockChain {
  private _blockchain: Block[];
  private _state: {
    accountA: number,
    accountB: number,
  };

  constructor(public blockSize: number) {
    this._blockchain = [this._startGenesisBlock()];
    this.blockSize = blockSize;
    this._state = {
      accountA: 0,
      accountB: 0,
    };
  }

  private _startGenesisBlock() {
    return new Block([{}] as Txn[]);
  }

  public getLatestBlock() {
    return this._blockchain[this._blockchain.length - 1];
  }

  public getBlockAtAddress(hash: string): Block | undefined {
    return this._blockchain.find((block: Block) => block.hash === hash);
  }

  public getCurrentBalance(account: Account) {
    const foundAcct = Object.keys(this._state).find(acct => acct === account);
    if (foundAcct) {
      return this._state[foundAcct];
    }
  }

  public addBlock(newBlock: Block) {
    if (!this._isValidBlock(newBlock)) {
      return;
    }
    newBlock.prevHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.computeHash();
    this._blockchain.push(newBlock);
    this._state = this._calculateNewState(newBlock.txns);
  }

  private _calculateNewState(txns: Txn[]) {
    let { accountA, accountB } = this._state;
    txns.map(txn => {
      if (txn.from === acctA) {
        accountA -= txn.value;
        accountB += txn.value;
      } else {
        accountB -= txn.value;
        accountA += txn.value;
      }
    });
    return {accountA, accountB};
  }

  private _isValidBlock(newBlock: Block) {
    const { txns } = newBlock;

    if (txns.length !== this.blockSize) {
      return false;
    }

    const txnValidityList = txns.map(txn => {
      const txnKeys = Object.keys(txn);
      const isSendingValueToAnotherAcct = txnKeys.map(key => {
        if (key === 'from') {
          if (txn[key] === acctA && txn.to === acctB) {
            return true;
          } else if (txn[key] === acctB && txn.to === acctA) {
            return true;
          }

          return false;
        }
      });

      if (isSendingValueToAnotherAcct.some(key => key === false)) {
        return false;
      };

      const areCorrectKeys = txnKeys.map(key => ['from', 'to', 'value'].includes(key) ? true : false);
      return areCorrectKeys.every(key => key === true);
    });

    return txnValidityList.every(txn => txn === true);
  }

  public isValidChain() {
    for (let i = 1; i < this._blockchain.length; i++) {
      const currBlock = this._blockchain[i];
      const prevBlock = this._blockchain[i -1];

      if (currBlock.hash !== currBlock.computeHash()) {
        return false;
      }

      if (currBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}