// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import {IDataCoin} from "./interfaces/IDataCoin.sol";
import {IDataCoinFactory} from "./interfaces/IDataCoinFactory.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CreateDatacoinCustom {
    IDataCoinFactory public dataCoinFactory;
    IDataCoin public dataCoin;
    address public pool;

    // Event to track DataCoin creation
    event DataCoinCreated(
        address indexed coinAddress,
        address indexed poolAddress,
        address indexed creator,
        string name,
        string symbol
    );

    constructor(address _dataCoinFactory) {
        dataCoinFactory = IDataCoinFactory(_dataCoinFactory);
    }

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

    // Get minimum lock amount for a specific token
    function getMinLockAmount(address lockToken) public view returns (uint256) {
        return dataCoinFactory.getMinLockAmount(lockToken);
    }

    // Create DataCoin with custom parameters - user inputs all values
    function createDataCoinWithParams(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        uint256 creatorAllocationBps,
        uint256 creatorVestingDuration,
        uint256 contributorsAllocationBps,
        uint256 liquidityAllocationBps,
        address lockToken,
        uint256 lockAmount
    ) public {
        // Validation
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(lockToken != address(0), "Lock token cannot be zero address");
        require(lockAmount > 0, "Lock amount must be greater than zero");
        
        // Validate allocation percentages (should add up to 10000 = 100%)
        require(
            creatorAllocationBps + contributorsAllocationBps + liquidityAllocationBps == 10000,
            "Allocations must sum to 100%"
        );

        // Check minimum lock amount
        uint256 minLockAmount = dataCoinFactory.getMinLockAmount(lockToken);
        require(lockAmount >= minLockAmount, "Lock amount below minimum");

        address creator = msg.sender;
        bytes32 salt = keccak256(abi.encodePacked(block.timestamp, msg.sender, name, symbol));

        // Transfer lock token from caller to this contract address, requires approval
        IERC20(lockToken).transferFrom(msg.sender, address(this), lockAmount);
        IERC20(lockToken).approve(address(dataCoinFactory), lockAmount);

        (address coinAddress, address poolAddress) = dataCoinFactory
            .createDataCoin(
                name,
                symbol,
                tokenURI,
                creator, // admin of datacoin
                creatorAllocationBps,
                creatorVestingDuration,
                contributorsAllocationBps,
                liquidityAllocationBps,
                lockToken,
                lockAmount,
                salt
            );
            
        dataCoin = IDataCoin(coinAddress);
        pool = poolAddress;

        emit DataCoinCreated(coinAddress, poolAddress, creator, name, symbol);
    }

    // Convenience function with some sensible defaults but still customizable
    function createDataCoinSimple(
        string memory name,
        string memory symbol,
        string memory tokenURI,
        address lockToken
    ) public {
        uint256 lockAmount = dataCoinFactory.getMinLockAmount(lockToken);
        
        createDataCoinWithParams(
            name,
            symbol,
            tokenURI,
            1000,  // 10% creator allocation
            365 days, // 1 year vesting
            6000,  // 60% contributors allocation
            3000,  // 30% liquidity allocation
            lockToken,
            lockAmount
        );
    }

    // Minter role should be granted to this contract to mint tokens
    function mintDataCoin(address to, uint256 amount) public {
        require(address(dataCoin) != address(0), "DataCoin not created yet");
        dataCoin.mint(to, amount);
    }

    // Get the last created DataCoin info
    function getLastCreatedDataCoin() public view returns (address coinAddress, address poolAddress) {
        return (address(dataCoin), pool);
    }
}