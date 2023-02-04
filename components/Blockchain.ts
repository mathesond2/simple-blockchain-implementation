import Block from './Block';
import type { Txn } from '../util/types';

interface iBlockChain {
  getLatestBlock(): Block;
  getBlockAtAddress(hash: string): Block | undefined;
  addBlock(newBlock: Block): void;
  isValidChain(): boolean;
}

type StateAccount = {[address: string]: number};

export default class BlockChain implements iBlockChain {
  private _blockchain: Block[];
  private _state: StateAccount[];

  constructor(public blockSize: number) {
    this._blockchain = [this._startGenesisBlock()];
    this.blockSize = blockSize;
    this._state = [
      {'accountA': 4} // seed account
    ];
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

  public getCurrentBalance(account: string) {
    const foundAcct = this._state.find(obj => obj[account] || obj[account] === 0);
    if (foundAcct) {
      return foundAcct[account];
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

  private _getAccountFromState(account: string) {
    return this._state.find(obj => Object.keys(obj)[0] === account);
  }

  private _calculateNewState(txns: Txn[]) {
    txns.map(txn => {
      const fromAcct = this._getAccountFromState(txn.from);
      let toAcct = this._getAccountFromState(txn.to);

      // if 'from' account doesn't exist or doesn't have enough funds, return
      if (!fromAcct || Object.values(fromAcct)[0] - txn.value < 0) {
        return;
      }

      // if 'to' account doesn't exist, create it
      if (!toAcct) {
        this._state = [
          ...this._state,
          {[txn.to]: 0}
        ];
      }

      this._state = this._state.map(acct => {
        const key = Object.keys(acct)[0];
        const val = Object.values(acct)[0];

        if (key === txn.from) {
          return {[txn.from]: val - txn.value};
        } else if (key === txn.to) {
          return {[txn.to]: val + txn.value};
        } else {
          return acct;
        }
      });
    });
    return this._state;
  }

  private _isValidBlock(newBlock: Block) {
    const { txns } = newBlock;

    if (txns.length !== this.blockSize) {
      return false;
    }

    const txValidityList = txns.map(tx => {
      if (tx.from === tx.to) {
        return false;
      }

      const txnKeys = Object.keys(tx);
      const areCorrectKeys = txnKeys.map(key => ['from', 'to', 'value'].includes(key) ? true : false);
      return areCorrectKeys.every(key => key === true);
    });

    return txValidityList.every(txn => txn === true);
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