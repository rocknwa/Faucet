const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('ethers');

describe('Faucet', function () {
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner, nonOwner] = await ethers.getSigners(); // Include a non-owner account

    let withdrawAmount = ethers.utils.parseUnits('1', 'ether');

    return { faucet, owner, nonOwner, withdrawAmount }; // Include nonOwner
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawals above .1 ETH at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('should only allow the owner to call destroyFaucet()', async function () {
    const { faucet, owner, nonOwner } = await loadFixture(
      deployContractAndSetVariables
    );

    // Non-owner should not be able to call destroyFaucet
    await expect(faucet.connect(nonOwner).destroyFaucet()).to.be.revertedWith(
      'Only the owner can call this function'
    );

    // Owner should be able to call destroyFaucet
    await expect(faucet.connect(owner).destroyFaucet()).not.to.be.reverted;

    // Verify that the contract has been self-destructed (getCode returns an empty bytecode)
    const code = await ethers.provider.getCode(faucet.address);
    expect(code).to.equal('0x');
  });

  it('should only allow the owner to call withdrawAll()', async function () {
    const { faucet, owner, nonOwner } = await loadFixture(
      deployContractAndSetVariables
    );

    // Non-owner should not be able to call withdrawAll
    await expect(faucet.connect(nonOwner).withdrawAll()).to.be.revertedWith(
      'Only the owner can call this function'
    );

    // Owner should be able to call withdrawAll
    await expect(faucet.connect(owner).withdrawAll()).not.to.be.reverted;
  });
});


/*
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');

describe('Faucet', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy();

    const [owner] = await ethers.getSigners();

    let withdrawAmount = ethers.utils.parseUnits("1", "ether");

    console.log('Signer 1 address: ', owner.address);
    return { faucet, owner, withdrawAmount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawal above .1 ether at a time', async function () {
    const { faucet, withdrawAmount } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });

  it('only the owner can call it', async function () {
    const { faucet, owner, anyVariable } = await loadFixture(deployContractAndSetVariables);
    expect(await faucet.destroyFaucet())
  });
});
*/