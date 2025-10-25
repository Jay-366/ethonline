/**
 * FormDatacoin Frontend Integration Helper
 * This utility provides easy-to-use functions for interacting with FormDatacoin contract
 * 
 * Usage:
 * import { FormDatacoinHelper } from './FormDatacoinHelper.js'
 * const helper = new FormDatacoinHelper('sepolia')
 * const result = await helper.createDataCoinWithParams(signer, params)
 */

import { ethers } from 'ethers';

// FormDatacoin contract configuration
export const FORMDATACOIN_CONFIG = {
  SEPOLIA: {
    address: process.env.REACT_APP_FORMDATACOIN_SEPOLIA || '0x...',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/demo',
    lockToken: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // WETH
    defaultLockAmount: ethers.parseEther('0.0001') // 0.0001 WETH
  },
  LOCALHOST: {
    address: process.env.REACT_APP_FORMDATACOIN_LOCALHOST || '0x...',
    rpcUrl: 'http://localhost:8545',
    lockToken: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // WETH
    defaultLockAmount: ethers.parseEther('0.0001') // 0.0001 WETH
  }
};

export const FORMDATACOIN_ABI = [
  // createDataCoinWithParams
  'function createDataCoinWithParams(string name, string symbol, string tokenURI, address creator, uint256 creatorAllocationBps, uint256 creatorVestingDuration, uint256 contributorsAllocationBps, uint256 liquidityAllocationBps, address lockToken, uint256 lockAmount) public returns (address, address)',
  // createDataCoinSimple
  'function createDataCoinSimple(string name, string symbol, string tokenURI, address creator, uint256 creatorVestingDuration, address lockToken, uint256 lockAmount) public returns (address, address)',
  // mintDataCoin
  'function mintDataCoin(address to, uint256 amount) public',
  // View functions
  'function getDataCoinAddress() public view returns (address)',
  'function getPoolAddress() public view returns (address)',
  'function getMinLockAmount(address lockToken) public view returns (uint256)',
  'function getLockTokenConfig(address lockToken) public view returns (tuple(bool, uint256, uint256, uint256, uint256, uint256))',
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
export class FormDatacoinHelper {
  constructor(network = 'sepolia') {
    this.network = network;
    this.config = network === 'localhost' ? FORMDATACOIN_CONFIG.LOCALHOST : FORMDATACOIN_CONFIG.SEPOLIA;
  }

  /**
   * Get the FormDatacoin contract instance
   */
  getContract(signer) {
    return new ethers.Contract(
      this.config.address,
      FORMDATACOIN_ABI,
      signer
    );
  }

  /**
   * Get ERC20 token contract instance
   */
  getTokenContract(tokenAddress, signer) {
    return new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  }

  /**
   * Create DataCoin with full parameters
   */
  async createDataCoinWithParams(signer, params) {
    const contract = this.getContract(signer);
    const tokenContract = this.getTokenContract(params.lockToken, signer);

    try {
      // Step 1: Approve token spending
      console.log('📝 Step 1: Approving token spending...');
      const approveTx = await tokenContract.approve(
        this.config.address,
        params.lockAmount
      );
      const approveReceipt = await approveTx.wait();
      console.log('✓ Token approval confirmed');

      // Step 2: Create DataCoin
      console.log('🚀 Step 2: Creating DataCoin...');
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
      console.log('✅ DataCoin created successfully');

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        coinAddress: await contract.getDataCoinAddress(),
        poolAddress: await contract.getPoolAddress()
      };
    } catch (error) {
      console.error('❌ Error creating DataCoin:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create DataCoin with simplified parameters (standard allocations)
   */
  async createDataCoinSimple(signer, params) {
    const contract = this.getContract(signer);
    const tokenContract = this.getTokenContract(params.lockToken, signer);

    try {
      // Step 1: Approve token spending
      console.log('📝 Step 1: Approving token spending...');
      const approveTx = await tokenContract.approve(
        this.config.address,
        params.lockAmount
      );
      await approveTx.wait();
      console.log('✓ Token approval confirmed');

      // Step 2: Create DataCoin
      console.log('🚀 Step 2: Creating DataCoin (simple mode)...');
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
      console.log('✅ DataCoin created successfully');

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        coinAddress: await contract.getDataCoinAddress(),
        poolAddress: await contract.getPoolAddress()
      };
    } catch (error) {
      console.error('❌ Error creating DataCoin:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mint new DataCoins
   */
  async mintDataCoin(signer, to, amount) {
    const contract = this.getContract(signer);
    
    try {
      const tx = await contract.mintDataCoin(to, amount);
      const receipt = await tx.wait();
      console.log('✅ DataCoins minted successfully');
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('❌ Error minting DataCoins:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get the created DataCoin address
   */
  async getDataCoinAddress(signer) {
    const contract = this.getContract(signer);
    return await contract.getDataCoinAddress();
  }

  /**
   * Get the created pool address
   */
  async getPoolAddress(signer) {
    const contract = this.getContract(signer);
    return await contract.getPoolAddress();
  }

  /**
   * Get minimum lock amount for a token
   */
  async getMinLockAmount(signer, tokenAddress) {
    const contract = this.getContract(signer);
    return await contract.getMinLockAmount(tokenAddress);
  }

  /**
   * Get approved lock tokens and their configs
   */
  async getApprovedTokensAndConfigs(signer) {
    const contract = this.getContract(signer);
    const [tokens, configs] = await contract.getApprovedLockTokenAndConfig();
    return { tokens, configs };
  }

  /**
   * Validate parameters before creating DataCoin
   */
  validateParams(params) {
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
  static bpsToPercentage(bps) {
    return (bps / 100).toFixed(2) + '%';
  }

  /**
   * Convert percentage to basis points
   */
  static percentageToBps(percentage) {
    return Math.round(percentage * 100);
  }
}

export default FormDatacoinHelper;
