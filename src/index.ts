import Block from './components/Block';
import Blockchain from './components/Blockchain';
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
console.log('firstBlock', chain.getBlockAtAddress('e10808d43975dc400731053386849f864f297e6c4f7519c380f3dbaf7067a840')); //hardcoded, as we have know the hash via the seedUUID const

export default {};