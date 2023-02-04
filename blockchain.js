const sha256 = require('crypto-js/sha256');

class Block {
  constructor(txns, prevHash = "") {
    this.txns = txns;
    this.prevHash = prevHash;
    this.hash = this.computeHash();
  }

  computeHash() {
    return sha256(this.prevHash + JSON.stringify(this.data)).toString();
  }
}

class BlockChain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.blockSize = 2;
    this.state = null;
  }

  startGenesisBlock() {
    return new Block({});
  }

  getLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  //TODO: implement TS
  isValidBlock(newBlock) {
    const { txns } = newBlock;
    if (typeof txns !== 'object') { // remove upon implementing TS
      return false;
    }

    const txnKeys = Object.keys(txns);
    if (txnKeys.length !== this.blockSize) {
      return false;
    }

    const areCorrectKeys = txnKeys.map(key => ['from', 'to'].includes(key) ? true : false);
    return areCorrectKeys.every(key => key === true);
  }

  addNewBlock(newBlock) {
    if (!this.isValidBlock(newBlock)) {
      console.log('hitting here');
      return;
    }
    newBlock.prevHash = this.getLatestBlock().hash; // Set its previous hash to the correct value
    newBlock.hash = newBlock.computeHash(); // Recalculate its hash with this new prevHash value
    this.blockchain.push(newBlock); // Add the block to our chain
    this.state = newBlock.txns;
  }

  getBlock(hash) {
    return this.blockchain.find(block => block.hash === hash);
  }

  getAccountBalance(acount) {
    return this.state.find(state => state.acount === acount);
  }

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
const c = new Block({from: "Jane", ton: "Joe"})

const chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
chain.addNewBlock(c);
console.log(chain);
console.log("Validity: " + chain.isValidChain());