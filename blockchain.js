const sha256 = require('crypto-js/sha256');

class Block {
  constructor(txns, prevHash = "") {
    this.txns = txns;
    this.prevHash = prevHash;
    this.hash = this.computeHash();
  }

  computeHash() {
    let strBlock = this.prevHash + JSON.stringify(this.data);
    return sha256(strBlock).toString();
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

  addNewBlock(newBlock) {
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

  checkChainValidity() { // Check to see that all the hashes are correct and the chain is therefore valid
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

// Create two test blocks with some sample data
let a = new Block({from: "Joe", to: "Jane"})
let b = new Block({from: "Jane", to: "Joe"})


let chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
console.log(chain);
console.log("Validity: " + chain.checkChainValidity());