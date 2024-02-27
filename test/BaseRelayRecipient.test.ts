import { expect } from "chai";
import { ethers} from "hardhat";
import {Forwarder, TestForwarderTarget} from "../typechain-types";

describe('BaseRelayRecipient', async () => {
  let recipient: TestForwarderTarget;
  let fwd: Forwarder;
  let deployer: any;

  before(async () => {
    fwd = await ethers.deployContract("Forwarder", []);
    recipient = await ethers.deployContract("TestForwarderTarget", [fwd.target]);
    deployer = (await ethers.getSigners())[0];
  });

  describe('#_msgSender', async ()  => {
    async function callMsgSender (from: string, appended = ''): Promise<any> {
      const encoded = (await recipient.publicMsgSender.populateTransaction()).data;
      const ret = await ethers.provider.call({ from, to: recipient.target, data: encoded + appended.replace(/^0x/, '') })
      return ('0x' + ret.slice(ret.length - 40, ret.length)).toLowerCase();
    }
    it('should leave from address as-is if not from trusted forwarder', async () => {
      expect(await recipient.publicMsgSender({from: deployer.address})).to.eql(deployer.address);
    });

    it('should leave from address as-is if not enough appended data', async () => {
      expect(await callMsgSender(String(fwd.target))).to.eql(String(fwd.target).toLowerCase());
    });

    it('should leave from address as-is if not enough appended data', async () => {
      expect(await callMsgSender(String(fwd.target), '12345678')).to.eql(String(fwd.target).toLowerCase());
    });

    const sender = '0x'.padEnd(42, '12');

    it('should extract from address if called through trusted forwarder', async () => {
      expect(await callMsgSender(String(fwd.target), sender)).to.eql(sender.toLowerCase());
    });
  })

  // describe('#_msgData', async function () {
  //   const encoded = recipient.contract.methods.publicMsgData().encodeABI() as string
  //
  //   async function callMsgData (from: string, appended = ''): Promise<any> {
  //     const ret = await web3.eth.call({
  //       from,
  //       to: recipient.address,
  //       data: encoded + appended.replace(/^0x/, '')
  //     })
  //     return web3.eth.abi.decodeParameter('bytes', ret)
  //   }
  //
  //   const extra = toHex('some extra data to add, which is longer than 20 bytes').slice(2)
  //   assert.equal(await callMsgData(from), encoded, 'should leave msg.data as-is if not from trusted forwarder')
  //   assert.equal(await callMsgData(from, extra), encoded + extra, 'should leave msg.data as-is if not from trusted forwarder')
  //
  //   assert.equal(await callMsgData(fwd.address), encoded, 'should leave msg.data as-is if not enough appended data')
  //
  //   const sender = '0x'.padEnd(42, '12')
  //   assert.equal(await callMsgData(fwd.address, extra + sender.slice(2)), encoded + extra,
  //     'should extract msg.data if called through trusted forwarder')
  // })
  //
  // it('should extract msgSender and msgData in transaction', async () => {
  //   // trust "from" as forwarder (using real forwarder requires signing
  //   const recipient = await TestForwarderTarget.new(from)
  //   const encoded = recipient.contract.methods.emitMessage('hello').encodeABI() as string
  //   const encodedWithSender = `${encoded}${sender.slice(2)}`
  //   await web3.eth.sendTransaction({ from, to: recipient.address, data: encodedWithSender })
  //   const events = await recipient.contract.getPastEvents(null, { fromBlock: 1 })
  //   const params = events[0].returnValues
  //   assert.equal(params.realSender, sender)
  //   assert.equal(params.msgSender, from)
  //   assert.equal(params.realMsgData, encoded)
  // })
})