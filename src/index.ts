import Block from './util/components/Block';
import Blockchain from './util/components/Blockchain';
import { seedUUID } from './util/constants';
import * as crypto from 'crypto';

const newUUID = crypto.randomUUID();
const a = new Block([{from: seedUUID, to: newUUID, value: 2}]);
const b = new Block([{from: newUUID, to: seedUUID, value: 1}]);
const c = new Block([{from: newUUID, to: seedUUID, value: 1}]);
const d = new Block([{from: seedUUID, to: seedUUID, value: 1}]);

const chain = new Blockchain(1);
chain.addBlock(a);
chain.addBlock(b);
chain.addBlock(c);
chain.addBlock(d);

console.log(chain);

console.log('seedUUID account Balance', chain.getCurrentBalance(seedUUID));
console.log('newUUID account Balance', chain.getCurrentBalance(newUUID));
console.log('C account Balance', chain.getCurrentBalance('account C'));

console.log(`is valid chain: ${chain.isValidChain()}`);
console.log('lastBlock', chain.getBlockAtAddress('d8cb0b18c822c5715b81ff498d0309041ac168b92218b4c40754adef62f8c48f'));

export default {};