var sha256 = require('crypto-js/sha256');
var Block = /** @class */ (function () {
    function Block(txns, prevHash) {
        if (prevHash === void 0) { prevHash = ''; }
        this.txns = txns;
        this.prevHash = prevHash;
        this.txns = txns;
        this.prevHash = prevHash;
        this.hash = this.computeHash();
    }
    Block.prototype.computeHash = function () {
        return sha256(this.prevHash + JSON.stringify(this.txns)).toString();
    };
    return Block;
}());
var BlockChain = /** @class */ (function () {
    function BlockChain() {
        this.blockchain = [this.startGenesisBlock()];
        this.blockSize = 2;
        this.state = null;
    }
    BlockChain.prototype.startGenesisBlock = function () {
        return new Block({});
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.blockchain[this.blockchain.length - 1];
    };
    BlockChain.prototype.isValidBlock = function (newBlock) {
        var txns = newBlock.txns;
        var txnKeys = Object.keys(txns);
        if (txnKeys.length !== this.blockSize) {
            return false;
        }
        var areCorrectKeys = txnKeys.map(function (key) { return ['from', 'to'].includes(key) ? true : false; });
        return areCorrectKeys.every(function (key) { return key === true; });
    };
    BlockChain.prototype.addNewBlock = function (newBlock) {
        if (!this.isValidBlock(newBlock)) {
            return;
        }
        newBlock.prevHash = this.getLatestBlock().hash; // Set its previous hash to the correct value
        newBlock.hash = newBlock.computeHash(); // Recalculate its hash with this new prevHash value
        this.blockchain.push(newBlock); // Add the block to our chain
        this.state = newBlock.txns;
    };
    BlockChain.prototype.getBlock = function (hash) {
        return this.blockchain.find(function (block) { return block.hash === hash; });
    };
    BlockChain.prototype.getAccountBalance = function (account) {
        return this.state.find(function (state) { return state.account === account; });
    };
    BlockChain.prototype.isValidChain = function () {
        for (var i = 1; i < this.blockchain.length; i++) { // Iterate through, starting after the genesis block
            var currBlock = this.blockchain[i];
            var prevBlock = this.blockchain[i - 1];
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
    };
    return BlockChain;
}());
var a = new Block({ from: "Joe", to: "Jane" });
var b = new Block({ from: "Jane", to: "Joe" });
// const c = new Block({from: "Jane", to: {name: "Joe"}})
var chain = new BlockChain();
chain.addNewBlock(a);
chain.addNewBlock(b);
// chain.addNewBlock(c);
console.log(chain);
console.log("is valid chain: ".concat(chain.isValidChain()));
