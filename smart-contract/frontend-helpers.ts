/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * FormDatacoin Frontend Integration Helper
 * This utility provides easy-to-use functions for interacting with FormDatacoin contract
 */

import { ethers } from 'ethers';

// FormDatacoin contract configuration
const FORMDATACOIN_CONFIG = {
  // You'll need to update these addresses after deployment
  SEPOLIA: {
    address: process.env.REACT_APP_FORMDATACOIN_SEPOLIA || '0x...',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo'
  },
  LOCALHOST: {
    address: process.env.REACT_APP_FORMDATACOIN_LOCALHOST || '0x...',
    rpcUrl: 'http://localhost:8545'
  }
};

const FORMDATACOIN_ABI = [
  // createDataCoinWithParams
  'function createDataCoinWithParams(string name, string symbol, string tokenURI, address creator, uint256 creatorAllocationBps, uint256 creatorVestingDuration, uint256 contributorsAllocationBps, uint256 liquidityAllocationBps, address lockToken, uint256 lockAmount) public returns (address, address)',
  // createDataCoinSimple
  'function createDataCoinSimple(string name, string symbol, string tokenURI, address creator, uint256 creatorVestingDuration, address lockToken, uint256 lockAmount) public returns (address, address)',
  // mintDataCoin
  'function mintDataCoin(address to, uint256 amount) public',
  // getDataCoinAddress
  'function getDataCoinAddress() public view returns (address)',
  // getPoolAddress
  'function getPoolAddress() public view returns (address)',
  // getMinLockAmount
  'function getMinLockAmount(address lockToken) public view returns (uint256)',
  // getLockTokenConfig
  'function getLockTokenConfig(address lockToken) public view returns (tuple(bool, uint256, uint256, uint256, uint256, uint256))',
  // getApprovedLockTokenAndConfig
  'function getApprovedLockTokenAndConfig() public view returns (address[], tuple(bool, uint256, uint256, uint256, uint256, uint256)[])',
  // Events
  'event DataCoinCreated(address indexed creator, address indexed coinAddress, address indexed poolAddress, string name, string symbol)',
  'event DataCoinMinted(address indexed to, uint256 amount)'
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function allowance(address owner, address spender) public view returns (uint256)'
];

/**
 * FormDatacoin Helper Class
 */
class FormDatacoinHelper {
  network: string;
  config: typeof FORMDATACOIN_CONFIG.SEPOLIA | typeof FORMDATACOIN_CONFIG.LOCALHOST;
  
  constructor(network = 'sepolia') {
    this.network = network;
    this.config = network === 'localhost' ? FORMDATACOIN_CONFIG.LOCALHOST : FORMDATACOIN_CONFIG.SEPOLIA;
  }

  /**
   * Get the FormDatacoin contract instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getContract(signer: any) {
    return new ethers.Contract(
      this.config.address,
      FORMDATACOIN_ABI,
      signer
    );
  }

  /**
   * Get ERC20 token contract instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTokenContract(tokenAddress: string, signer: any) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  }

  /**
   * Create DataCoin with full parameters
   */
  async createDataCoinWithParams(signer: any, params: any) {
    const contract = await this.getContract(signer);
    const tokenContract = this.getTokenContract(params.lockToken, signer);

    // Step 1: Approve token spending
    console.log('Step 1: Approving token spending...');
    const approveTx = await tokenContract.approve(
      this.config.address,
      params.lockAmount
    );
    await approveTx.wait();
    console.log('✓ Token approval confirmed');

    // Step 2: Create DataCoin
    console.log('Step 2: Creating DataCoin...');
    const createTx = await contract.createDataCoinWithParams(
      params.name,
      params.symbol,
      params.tokenURI,
      params.creator,
      params.creatorAllocationBps,
      params.creatorVestingDuration,
      params.contributorsAllocationBps,
      params.liquidityAllocationBps,
      params.lockToken,
      params.lockAmount
    );

    const receipt = await createTx.wait();
    console.log('✓ DataCoin created successfully');

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      coinAddress: await contract.getDataCoinAddress(),
      poolAddress: await contract.getPoolAddress()
    };
  }

  /**
   * Create DataCoin with simplified parameters (standard allocations)
   */
  async createDataCoinSimple(signer: any, params: any) {
    const contract = await this.getContract(signer);
    const tokenContract = this.getTokenContract(params.lockToken, signer);

    // Step 1: Approve token spending
    console.log('Step 1: Approving token spending...');
    const approveTx = await tokenContract.approve(
      this.config.address,
      params.lockAmount
    );
    await approveTx.wait();
    console.log('✓ Token approval confirmed');

    // Step 2: Create DataCoin
    console.log('Step 2: Creating DataCoin (simple mode)...');
    const createTx = await contract.createDataCoinSimple(
      params.name,
      params.symbol,
      params.tokenURI,
      params.creator,
      params.creatorVestingDuration,
      params.lockToken,
      params.lockAmount
    );

    const receipt = await createTx.wait();
    console.log('✓ DataCoin created successfully');

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      coinAddress: await contract.getDataCoinAddress(),
      poolAddress: await contract.getPoolAddress()
    };
  }

  /**
   * Mint new DataCoins
   */
  async mintDataCoin(signer: any, to: any, amount: any) {
    const contract = await this.getContract(signer);
    const tx = await contract.mintDataCoin(to, amount);
    const receipt = await tx.wait();
    console.log('✓ DataCoins minted successfully');
    return receipt;
  }

  /**
   * Get the created DataCoin address
   */
  async getDataCoinAddress(signer: any) {
    const contract = await this.getContract(signer);
    return await contract.getDataCoinAddress();
  }

  /**
   * Get the created pool address
   */
  async getPoolAddress(signer: any) {
    const contract = await this.getContract(signer);
    return await contract.getPoolAddress();
  }

  /**
   * Get minimum lock amount for a token
   */
  async getMinLockAmount(signer: any, tokenAddress: any) {
    const contract = await this.getContract(signer);
    return await contract.getMinLockAmount(tokenAddress);
  }

  /**
   * Get approved lock tokens and their configs
   */
  async getApprovedTokensAndConfigs(signer: any) {
    const contract = await this.getContract(signer);
    const [tokens, configs] = await contract.getApprovedLockTokenAndConfig();
    return { tokens, configs };
  }

  /**
   * Validate parameters before creating DataCoin
   */
  validateParams(params: any) {
    const errors = [];

    if (!params.name || params.name.trim() === '') {
      errors.push('Name cannot be empty');
    }

    if (!params.symbol || params.symbol.trim() === '') {
      errors.push('Symbol cannot be empty');
    }

    if (!params.tokenURI || params.tokenURI.trim() === '') {
      errors.push('TokenURI cannot be empty');
    }

    if (!ethers.isAddress(params.creator)) {
      errors.push('Invalid creator address');
    }

    if (!ethers.isAddress(params.lockToken)) {
      errors.push('Invalid lock token address');
    }

    if (params.lockAmount <= 0) {
      errors.push('Lock amount must be greater than 0');
    }

    if (params.creatorAllocationBps < 0 || params.creatorAllocationBps > 10000) {
      errors.push('Creator allocation must be between 0 and 10000 BPS');
    }

    if (params.contributorsAllocationBps < 0 || params.contributorsAllocationBps > 10000) {
      errors.push('Contributors allocation must be between 0 and 10000 BPS');
    }

    if (params.liquidityAllocationBps < 0 || params.liquidityAllocationBps > 10000) {
      errors.push('Liquidity allocation must be between 0 and 10000 BPS');
    }

    const totalAllocation = 
      (params.creatorAllocationBps || 0) + 
      (params.contributorsAllocationBps || 0) + 
      (params.liquidityAllocationBps || 0);

    if (totalAllocation > 10000) {
      errors.push(`Total allocation (${totalAllocation} BPS) cannot exceed 10000 BPS (100%)`);
    }

    if (params.creatorVestingDuration > 4 * 365 * 24 * 60 * 60) {
      errors.push('Vesting duration cannot exceed 4 years');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert basis points to percentage
   */
  static bpsToPercentage(bps: any) {
    return (bps / 100).toFixed(2) + '%';
  }

  /**
   * Convert percentage to basis points
   */
  static percentageToBps(percentage: any) {
    return Math.round(percentage * 100);
  }
}

export { FormDatacoinHelper, FORMDATACOIN_CONFIG, FORMDATACOIN_ABI };
