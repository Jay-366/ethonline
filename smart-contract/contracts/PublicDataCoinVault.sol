// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PublicDataCoinVault
 * @dev A public vault for managing ERC20 tokens with unrestricted access
 * @notice This contract allows anyone to deposit and withdraw their own tokens
 */
contract PublicDataCoinVault is ReentrancyGuard {
    
    // Events for transparency and monitoring
    event TokensWithdrawn(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        address indexed withdrawer
    );
    
    event TokensDeposited(
        address indexed token,
        address indexed depositor,
        uint256 amount
    );
    
    event EmergencyWithdrawal(
        address indexed token,
        address indexed recipient,
        uint256 amount
    );

    // Mapping to track total deposits for each token (optional analytics)
    mapping(address => uint256) public totalDeposited;
    
    // Array to keep track of all tokens that have been deposited
    address[] public depositedTokens;
    mapping(address => bool) public hasBeenDeposited;

    /**
     * @dev Constructor - no owner needed for public vault
     */
    constructor() {}

    /**
     * @dev Withdraw tokens from the vault to a specified recipient
     * @param tokenAddress The address of the ERC20 token to withdraw
     * @param recipient The address that will receive the tokens
     * @param amount The amount of tokens to withdraw
     * 
     * Requirements:
     * - Anyone can call this function
     * - Token address cannot be zero address
     * - Recipient address cannot be zero address
     * - Amount must be greater than zero
     * - Vault must have sufficient balance
     */
    function withdrawTokens(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) external nonReentrant {
        require(tokenAddress != address(0), "PublicDataCoinVault: Token address cannot be zero");
        require(recipient != address(0), "PublicDataCoinVault: Recipient address cannot be zero");
        require(amount > 0, "PublicDataCoinVault: Amount must be greater than zero");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 vaultBalance = token.balanceOf(address(this));
        
        require(vaultBalance >= amount, "PublicDataCoinVault: Insufficient vault balance");
        
        // Transfer tokens to recipient
        bool success = token.transfer(recipient, amount);
        require(success, "PublicDataCoinVault: Token transfer failed");
        
        emit TokensWithdrawn(tokenAddress, recipient, amount, msg.sender);
    }

    /**
     * @dev Get the vault's balance for a specific token
     * @param tokenAddress The address of the ERC20 token to check
     * @return The current balance of the specified token in the vault
     */
    function getVaultBalance(address tokenAddress) external view returns (uint256) {
        require(tokenAddress != address(0), "PublicDataCoinVault: Token address cannot be zero");
        
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }

    /**
     * @dev Get balances for multiple tokens at once
     * @param tokenAddresses Array of token addresses to check
     * @return balances Array of balances corresponding to the token addresses
     */
    function getMultipleVaultBalances(address[] calldata tokenAddresses) 
        external 
        view 
        returns (uint256[] memory balances) 
    {
        balances = new uint256[](tokenAddresses.length);
        
        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            if (tokenAddresses[i] != address(0)) {
                IERC20 token = IERC20(tokenAddresses[i]);
                balances[i] = token.balanceOf(address(this));
            }
        }
        
        return balances;
    }

    /**
     * @dev Emergency function to withdraw all tokens of a specific type
     * @param tokenAddress The address of the ERC20 token to withdraw completely
     * @param recipient The address that will receive all the tokens
     * 
     * @notice Anyone can call this function to withdraw all tokens
     */
    function emergencyWithdrawAll(
        address tokenAddress,
        address recipient
    ) external nonReentrant {
        require(tokenAddress != address(0), "PublicDataCoinVault: Token address cannot be zero");
        require(recipient != address(0), "PublicDataCoinVault: Recipient address cannot be zero");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 entireBalance = token.balanceOf(address(this));
        
        require(entireBalance > 0, "PublicDataCoinVault: No tokens to withdraw");
        
        bool success = token.transfer(recipient, entireBalance);
        require(success, "PublicDataCoinVault: Emergency withdrawal failed");
        
        emit EmergencyWithdrawal(tokenAddress, recipient, entireBalance);
    }

    /**
     * @dev Get all tokens that have been deposited to this vault
     * @return Array of token addresses that have been deposited
     */
    function getDepositedTokens() external view returns (address[] memory) {
        return depositedTokens;
    }

    /**
     * @dev Internal function to track deposited tokens (called when tokens are received)
     * @param tokenAddress The address of the token being deposited
     */
    function _trackDeposit(address tokenAddress, uint256 amount) internal {
        if (!hasBeenDeposited[tokenAddress]) {
            depositedTokens.push(tokenAddress);
            hasBeenDeposited[tokenAddress] = true;
        }
        
        totalDeposited[tokenAddress] += amount;
        emit TokensDeposited(tokenAddress, msg.sender, amount);
    }

    /**
     * @dev Function to manually track deposits (for tokens sent directly to contract)
     * @param tokenAddress The address of the token to track
     * 
     * @notice Anyone can call this function to update deposit tracking
     */
    function trackManualDeposit(address tokenAddress) external {
        require(tokenAddress != address(0), "PublicDataCoinVault: Token address cannot be zero");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 previousTotal = totalDeposited[tokenAddress];
        
        if (currentBalance > previousTotal) {
            uint256 newDeposit = currentBalance - previousTotal;
            _trackDeposit(tokenAddress, newDeposit);
        }
    }

    /**
     * @dev Get total amount ever deposited for a specific token
     * @param tokenAddress The address of the token to check
     * @return The total amount deposited for this token
     */
    function getTotalDeposited(address tokenAddress) external view returns (uint256) {
        return totalDeposited[tokenAddress];
    }

    /**
     * @dev Check if the contract supports receiving a specific token
     * @param tokenAddress The address of the token to check
     * @return True if the token can be stored in this vault
     */
    function supportsToken(address tokenAddress) external pure returns (bool) {
        // This vault supports all ERC20 tokens
        return tokenAddress != address(0);
    }

    /**
     * @dev Deposit tokens into the vault
     * @param tokenAddress The address of the ERC20 token to deposit
     * @param amount The amount of tokens to deposit
     * 
     * @notice Caller must have approved this contract to spend tokens
     */
    function depositTokens(
        address tokenAddress,
        uint256 amount
    ) external nonReentrant {
        require(tokenAddress != address(0), "PublicDataCoinVault: Token address cannot be zero");
        require(amount > 0, "PublicDataCoinVault: Amount must be greater than zero");
        
        IERC20 token = IERC20(tokenAddress);
        
        // Transfer tokens from sender to vault
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "PublicDataCoinVault: Token transfer failed");
        
        // Track the deposit
        _trackDeposit(tokenAddress, amount);
    }
}
