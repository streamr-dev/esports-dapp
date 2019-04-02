const etherlime = require('etherlime');
const ethers = require('ethers');
const BetFactory = require('../build/BetFactory.json');

describe('Bet', () => {
    let aliceAccount = accounts[3];
    let deployer;
    let betFactory;

    before(async () => {
        deployer = new etherlime.EtherlimeGanacheDeployer(aliceAccount.secretKey);
        betFactory = await deployer.deploy(BetFactory);
    });

    it('should have valid private key', async () => {
        assert.strictEqual(deployer.signer.privateKey, aliceAccount.secretKey);
    });

    it('should create bet', async () => {
        await betFactory.setTimestamp(1, 13123123123123)
        const tx = await betFactory.newBet(1, 1)
        // console.log(tx)
        const receipt = await tx.wait()
        // console.log(JSON.stringify(receipt))
        const event = receipt.events[0]
        // console.log(event)
        assert.strictEqual(event.event, "NewBet")
        assert.strictEqual(+event.args.teamId, 1)
    })

    it('should not create bet 5min before match start', async () => {
        await betFactory.setTimestamp(1, 123123)
        await betFactory.setTimestamp(2, Date.now())

        try {
            const tx = await betFactory.newBet(1, 1)
            const receipt = await tx.wait()
        } catch (e) {
            assert.equal(e.stack.includes('revert Betpool is closed'), true)
        }
        
        const tx2 = await betFactory.newBet(2, 1)
        const receipt2 = await tx2.wait()
        const event = receipt2.events[0]
        assert.strictEqual(event.event, "NewBet")
        
    })
    it('gets payed out', async () => {
        await betFactory.newBet(2, 1)
        const tx = await betFactory.payOut(1, 20000)
        const receipt = await tx.wait()
        const event = receipt.events[0]
        
        assert.strictEqual(event.event, "WinPayedOut")
    })
})
