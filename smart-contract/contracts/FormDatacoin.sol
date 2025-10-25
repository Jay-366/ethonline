// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {IDataCoin} from "./interfaces/IDataCoin.sol";
import {IDataCoinFactory} from "./interfaces/IDataCoinFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title FormDatacoin
 * @dev A flexible contract for creating DataCoins with customizable parameters from frontend
 * This contract allows users to input all the datacoin creation parameters
 */
contract FormDatacoin {
    IDataCoinFactory public dataCoinFactory;
    IDataCoin public dataCoin;
    address public pool;
    address public lastCreator;

    // Events
    event DataCoinCreated(
        address indexed creator,
        address indexed coinAddress,
        address indexed poolAddress,
        string name,
        string symbol
    );

    event DataCoinMinted(address indexed to, uint256 amount);

    constructor(address _dataCoinFactory) {
        require(_dataCoinFactory != address(0), "Invalid factory address");
        dataCoinFactory = IDataCoinFactory(_dataCoinFactory);
    }

    /**
     * @dev Get approved lock tokens and their configurations
     */
    function getApprovedLockTokenAndConfig()
        public
        view
        returns (address[] memory, IDataCoinFactory.AssetConfig[] memory)
    {
        address[] memory tokens = dataCoinFactory.getApprovedLockTokens();
        IDataCoinFactory.AssetConfig[]
            memory configs = new IDataCoinFactory.AssetConfig[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            configs[i] = dataCoinFactory.getLockableTokenConfig(tokens[i]);
        }
        return (tokens, configs);
    }

    /**
     * @dev Create a DataCoin with flexible parameters from frontend
     * @param name The name of the DataCoin
     * @param symbol The symbol of the DataCoin
     * @param tokenURI The URI for the DataCoin metadata
     * @param creator The creator/admin address of the DataCoin
     * @param creatorAllocationBps Creator allocation in basis points
     * @param creatorVestingDuration Duration of creator vesting in seconds
     * @param contributorsAllocationBps Contributors allocation in basis points
     * @param liquidityAllocationBps Liquidity allocation in basis points
     * @param lockToken The token to lock for DataCoin creation
     * @param lockAmount The amount of lockToken to lock
     *
     * Requirements:
     * - lockToken must be approved by caller for at least lockAmount
     * - allocations must sum to <= 10000 basis points
     */
    function createDataCoinWithParams(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        address creator,
        uint256 creatorAllocationBps,
        uint256 creatorVestingDuration,
        uint256 contributorsAllocationBps,
        uint256 liquidityAllocationBps,
        address lockToken,
        uint256 lockAmount
    ) public returns (address coinAddress, address poolAddress) {
        // Validation
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(tokenURI).length > 0, "TokenURI cannot be empty");
        require(creator != address(0), "Invalid creator address");
        require(lockToken != address(0), "Invalid lock token address");
        require(lockAmount > 0, "Lock amount must be greater than 0");

        // Verify allocations
        uint256 totalAllocation = creatorAllocationBps +
            contributorsAllocationBps +
            liquidityAllocationBps;
        require(
            totalAllocation <= 10000,
            "Total allocation cannot exceed 100% (10000 bps)"
        );

        // Verify vesting duration is reasonable (max 4 years)
        require(
            creatorVestingDuration <= 4 * 365 days,
            "Vesting duration too long"
        );

        // Generate salt based on caller, name, symbol and block timestamp for uniqueness
        bytes32 salt = keccak256(
            abi.encodePacked(msg.sender, name, symbol, block.timestamp)
        );

        // Transfer lock token from caller to this contract
        IERC20(lockToken).transferFrom(msg.sender, address(this), lockAmount);

        // Approve the factory to use the lock token
        IERC20(lockToken).approve(address(dataCoinFactory), lockAmount);

        // Create the DataCoin through the factory
        (coinAddress, poolAddress) = dataCoinFactory.createDataCoin(
            name,
            symbol,
            tokenURI,
            creator,
            creatorAllocationBps,
            creatorVestingDuration,
            contributorsAllocationBps,
            liquidityAllocationBps,
            lockToken,
            lockAmount,
            salt
        );

        // Store references
        dataCoin = IDataCoin(coinAddress);
        pool = poolAddress;
        lastCreator = creator;

        // Emit event
        emit DataCoinCreated(creator, coinAddress, poolAddress, name, symbol);

        return (coinAddress, poolAddress);
    }

    /**
     * @dev Simplified version of createDataCoinWithParams with default allocations
     * Uses standard allocation: Creator 10%, Contributors 60%, Liquidity 30%
     */
    function createDataCoinSimple(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        address creator,
        uint256 creatorVestingDuration,
        address lockToken,
        uint256 lockAmount
    ) public returns (address coinAddress, address poolAddress) {
        return
            createDataCoinWithParams(
                name,
                symbol,
                tokenURI,
                creator,
                1000, // 10% creator
                creatorVestingDuration,
                6000, // 60% contributors
                3000, // 30% liquidity
                lockToken,
                lockAmount
            );
    }

    /**
     * @dev Mint new DataCoins (requires minter role)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mintDataCoin(address to, uint256 amount) public {
        require(address(dataCoin) != address(0), "No DataCoin created yet");
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");

        dataCoin.mint(to, amount);
        emit DataCoinMinted(to, amount);
    }

    /**
     * @dev Get the current DataCoin address
     */
    function getDataCoinAddress() public view returns (address) {
        return address(dataCoin);
    }

    /**
     * @dev Get the current pool address
     */
    function getPoolAddress() public view returns (address) {
        return pool;
    }

    /**
     * @dev Get the minimum lock amount for a specific token
     */
    function getMinLockAmount(address lockToken) public view returns (uint256) {
        return dataCoinFactory.getMinLockAmount(lockToken);
    }

    /**
     * @dev Get the configuration for a specific lock token
     */
    function getLockTokenConfig(
        address lockToken
    ) public view returns (IDataCoinFactory.AssetConfig memory) {
        return dataCoinFactory.getLockableTokenConfig(lockToken);
    }
}
