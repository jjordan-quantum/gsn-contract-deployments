import { expect } from "chai";
import { ethers, artifacts} from "hardhat";
import {Forwarder, TestForwarderTarget} from "../typechain-types";
import {Artifact} from "hardhat/types";
import {toHex} from "web3-utils";
import {SENDER} from "../scripts/constants";
const abiCoder = new ethers.AbiCoder();

describe('BaseRelayRecipient', async () => {
  let recipient: TestForwarderTarget;
  let fwd: Forwarder;
  let deployer: any;
  let recipientArtifact: Artifact;
  let iface: any;

  before(async () => {
    fwd = await ethers.deployContract("Forwarder", []);
    recipient = await ethers.deployContract("TestForwarderTarget", [fwd.target]);
    deployer = (await ethers.getSigners())[0];
    recipientArtifact = await artifacts.readArtifact('TestForwarderTarget');
    iface = new ethers.Interface(recipientArtifact.abi);
  });

  describe('#_msgSender', async ()  => {
    async function callMsgSender (from: string, appended = ''): Promise<any> {
      const encoded = (await recipient.publicMsgSender.populateTransaction()).data;
      const ret = await ethers.provider.call({ from, to: recipient.target, data: encoded + appended.replace(/^0x/, '') });
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

  describe('#_msgData', async function () {
    async function callMsgData (from: string, appended = ''): Promise<any> {
      const encoded = (await recipient.publicMsgData.populateTransaction()).data;
      const ret = await ethers.provider.call({ from, to: recipient.target, data: encoded + appended.replace(/^0x/, '') });
      const decoded = abiCoder.decode(['bytes'], ret);
      return decoded[0];
    }

    //const extra = toHex('some extra data to add, which is longer than 20 bytes').slice(2);

    it('should leave from msg.data as-is if not from trusted forwarder', async () => {
      const encoded = (await recipient.publicMsgData.populateTransaction()).data;
      expect(await recipient.publicMsgData()).to.eql(encoded);
    });

    it('should leave msg.data as-is if not from trusted forwarder', async () => {
      const encoded = (await recipient.publicMsgData.populateTransaction()).data;
      const extra = toHex('some extra data to add, which is longer than 20 bytes').slice(2);
      expect(await callMsgData(String(deployer.address), extra)).to.eql(encoded + extra);
    });

    it('should leave msg.data as-is if not enough appended data', async () => {
      const encoded = (await recipient.publicMsgData.populateTransaction()).data;
      expect(await callMsgData(String(fwd.target))).to.eql(encoded);
    });

    it('should leave msg.data as-is if not enough appended data', async () => {
      const sender = '0x'.padEnd(42, '12');
      const extra = toHex('some extra data to add, which is longer than 20 bytes').slice(2);
      const encoded = (await recipient.publicMsgData.populateTransaction()).data;
      expect(await callMsgData(String(fwd.target), extra + sender.slice(2))).to.eql(encoded + extra);
    });
  });

  describe('should extract msgSender and msgData in transaction', async () => {
    it('should extract msgSender and msgData in transaction', async () => {
      // trust "from" as forwarder (using real forwarder requires signing
      recipient = await ethers.deployContract("TestForwarderTarget", [deployer.address]);
      const encoded = (await recipient.emitMessage.populateTransaction('hello')).data;
      const encodedWithSender = `${encoded}${SENDER.slice(2)}`;
      await deployer.sendTransaction({ from: deployer.address , to: recipient.target, data: encodedWithSender })
      const events = await recipient.queryFilter(recipient.getEvent('TestForwarderMessage'), 1);
      expect(events.length > 0).to.be.true;

      for(const event of events) {
        const [
          message,
          realMsgData,
          realSender,
          msgSender,
          origin,
        ] = event.args;

        expect(realSender).to.eql(SENDER);
        expect(msgSender).to.eql(deployer.address);
        expect(realMsgData).to.eql(encoded);
      }
    });
  });
})