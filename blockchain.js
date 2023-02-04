"use strict";
exports.__esModule = true;
var sha256 = require("crypto-js/sha256");
var acctA = 'accountA';
var acctB = 'accountB';
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
    function BlockChain(blockSize) {
        this.blockSize = blockSize;
        this.blockchain = [this.startGenesisBlock()];
        this.blockSize = blockSize;
        this.state = {
            accountA: 0,
            accountB: 0
        };
    }
    BlockChain.prototype.startGenesisBlock = function () {
        return new Block([{}]);
    };
    BlockChain.prototype.getLatestBlock = function () {
        return this.blockchain[this.blockchain.length - 1];
    };
    BlockChain.prototype.isValidBlock = function (newBlock) {
        var txns = newBlock.txns;
        if (txns.length !== this.blockSize) {
            return false;
        }
        var txnValidityList = txns.map(function (txn) {
            var txnKeys = Object.keys(txn);
            var isSendingValueToAnotherAcct = txnKeys.map(function (key) {
                if (key === 'from') {
                    if (txn[key] === acctA && txn.to === acctB) {
                        return true;
                    }
                    else if (txn[key] === acctB && txn.to === acctA) {
                        return true;
                    }
                    return false;
                }
            });
            if (isSendingValueToAnotherAcct.some(function (key) { return key === false; })) {
                return false;
            }
            ;
            var areCorrectKeys = txnKeys.map(function (key) { return ['from', 'to', 'value'].includes(key) ? true : false; });
            return areCorrectKeys.every(function (key) { return key === true; });
        });
        return txnValidityList.every(function (txn) { return txn === true; });
    };
    // calculateNewState(txn: Txn[]) {
    //   let { accountA, accountB } = this.state;
    //   if (txn.from === acctA) {
    //     accountA -= txn.value;
    //     accountB += txn.value;
    //   } else {
    //     accountB -= txn.value;
    //     accountA += txn.value;
    //   }
    //   return {accountA, accountB};
    // }
    BlockChain.prototype.addNewBlock = function (newBlock) {
        if (!this.isValidBlock(newBlock)) {
            return;
        }
        newBlock.prevHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.computeHash();
        this.blockchain.push(newBlock);
        // this.state = this.calculateNewState(newBlock.txns);
    };
    BlockChain.prototype.getBlock = function (hash) {
        return this.blockchain.find(function (block) { return block.hash === hash; });
    };
    // getCurrentBalance(account: Account) {
    //   const foundAcct = Object.keys(this.state).find(acct => acct === account);
    //   if (foundAcct) {
    //     return this.state[foundAcct];
    //   }
    // }
    BlockChain.prototype.isValidChain = function () {
        for (var i = 1; i < this.blockchain.length; i++) {
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
        return true;
    };
    return BlockChain;
}());
var a = new Block([{ from: acctA, to: acctB, value: 5 }]);
var b = new Block([{ from: acctB, to: acctA, value: 1 }]);
// const c = new Block({from: acctB, to: acctA, value: 1})
var chain = new BlockChain(1);
chain.addNewBlock(a);
chain.addNewBlock(b);
// chain.addNewBlock(c);
console.log(chain);
console.log("is valid chain: ".concat(chain.isValidChain()));
exports["default"] = {};
