import Block from './components/Block';
import BlockChain from './components/BlockChain';

const acctA = 'accountA';
const acctB = 'accountB';

const a = new Block([{from: acctA, to: acctB, value: 2}]);
const b = new Block([{from: acctB, to: acctA, value: 1}]);
const c = new Block([{from: acctB, to: acctA, value: 1}]);
const d = new Block([{from: acctA, to: acctA, value: 1}]);

const chain = new BlockChain(1);
chain.addBlock(a);
chain.addBlock(b);
chain.addBlock(c);
chain.addBlock(d);

console.log(chain);

console.log('A account Balance', chain.getCurrentBalance(acctA));
console.log('B account Balance', chain.getCurrentBalance(acctB));
console.log('C account Balance', chain.getCurrentBalance('account C'));

console.log(`is valid chain: ${chain.isValidChain()}`);
console.log('lastBlock', chain.getBlockAtAddress('1a3f3c893709c2f98bfaf9df36d4a90609388e16547007c6d6170f3f227e7509'));

export default {};