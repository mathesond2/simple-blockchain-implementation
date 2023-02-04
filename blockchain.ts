const sha256 = require('crypto-js/sha256');

type Txn = {
  from: string,
  to: string,
};

class Block {
  hash: string;
  constructor(
    public txns: Txn,
    public prevHash: string = '',
  ) {
    this.txns = txns;
    this.prevHash = prevHash;
    this.hash = this.computeHash();
  }

  computeHash(): string {
    return sha256(this.prevHash + JSON.stringify(this.txns)).toString();
  }
}

class BlockChain {
  public blockchain: any;
  public blockSize: number;
  public state: any;
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.blockSize = 2;
    this.state = null;
  }

  startGenesisBlock() {
    return new Block({} as Txn);
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  isValidBlock(newBlock: Block) {
    const { txns } = newBlock;
    const txnKeys = Object.keys(txns);

    if (txnKeys.length !== this.blockSize) {
      return false;
    }

    const areCorrectKeys = txnKeys.map(key => ['from', 'to'].includes(key) ? true : false);
    return areCorrectKeys.every(key => key === true);
  }

  addNewBlock(newBlock: Block) {
    if (!this.isValidBlock(newBlock)) {
      return;
    }
    newBlock.prevHash = this.getLatestBlock().hash; // Set its previous hash to the correct value
    newBlock.hash = newBlock.computeHash(); // Recalculate its hash with this new prevHash value
    this.blockchain.push(newBlock); // Add the block to our chain
    this.state = newBlock.txns;
  }

  getBlock(hash: string): Block | undefined {
    return this.blockchain.find(block => block.hash === hash);
  }

  // getAccountBalance(account) {
  //   return this.state.find(state => state.account === account);
  // }

  isValidChain() { // Check to see that all the hashes are correct and the chain is therefore valid
    for (let i = 1; i < this.blockchain.length; i++) { // Iterate through, starting after the genesis block
      const currBlock = this.blockchain[i];
      const prevBlock = this.blockchain[i -1];

      // Is the hash correctly computed, or was it tampered with?
      if (currBlock.hash !== currBlock.computeHash()) {
        return false;
      }

      // Does it have the correct prevHash value?; ie: What a previous block tampered with?
      if (currBlock.prevHash !== prevBlock.hash) {
        return false;
      }
    }
    return true; // If all the blocks are valid, return true
  }
}

const a = new Block({from: "Joe", to: "Jane"})
const b = new Block({from: "Jane", to: "Joe"})

const chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
console.log(chain);
console.log(`is valid chain: ${chain.isValidChain()}`);