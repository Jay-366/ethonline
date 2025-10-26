# Intellitrade  
### Decentralized AI Agent Marketplace — Secure, Token-Gated Intelligence  

**Intellitrade** is a decentralized **AI Agent Marketplace** that allows developers to encrypt, package, and monetize their AI agents.  
Users can unlock these agents securely using **DataCoin-based access control**, while **cross-chain payments and settlements** are handled by the **Nexus SDK**.  
Encrypted storage, access verification, and decryption are powered by **Lighthouse IPFS**.

Built for **ETHOnline 2025**, Intellitrade demonstrates the future of decentralized, privacy-preserving AI monetization.

---

## 🚧 Problems  

- **Lack of Secure and Unified AI Agent Ecosystem** – Existing AI marketplaces expose source code and lack on-chain verification.  
- **Weak Incentives and Poor Infrastructure** – No fair reward model for developers or transparent ownership for users.  
- **Excessive Cross-Platform Gas Fee Burden** – Multiple chain interactions result in repetitive bridging and high transaction costs.  

---

## 💡 Inspiration

While exploring decentralized compute and AI frameworks, our team saw the same recurring issues:

- Creators wanted to **protect and monetize their code**.  
- Users wanted to **trust and verify** the agents they pay for.  
- Cross-chain execution remained **painful and expensive**.

So we asked:

> "What if developers could sell their AI agents like NFTs — encrypted, token-gated, and payable from any chain — all without trusting a central platform?"

That question became **Intellitrade**, a marketplace where every AI agent is a **secure, portable, and tokenized product**.

---

## 🔑 The Solution

### Encrypted Agent Deployment  
Developers package their code into **Dockerized `.tar` containers** and upload them to **Lighthouse IPFS** with full encryption.  
The encryption key is bound to a **token-based access rule** that ensures only verified owners can decrypt the file.

### Token-Gated Access (DataCoin)  
Each agent mints a **dedicated DataCoin** when listed.  
Only users who **own that specific DataCoin** can request decryption from Lighthouse — ensuring that ownership equals access.

### Cross-Chain Payments via Nexus SDK  
Users can buy access using **USDC on any supported chain**.  
The **Nexus SDK** automatically bridges funds to the developer's preferred chain and triggers the minting of the corresponding **DataCoin** through the **DataCoinVault** contract.

### Verifiable Decryption and Execution  
Once **DataCoin ownership** is verified on-chain, **Lighthouse** releases the decryption capability.  
The user can securely download and execute the agent — either locally or within the **Intellitrade runtime environment**.

---

## 🔄 User Flow

### 👩‍💻 Developer Flow

1. **Build the Agent**  
   Develop an AI service (Python, Node.js, etc.) and package it:
   ```bash
   docker build -t myagent .
   docker save myagent > myagent.tar
   ```

2. **Encrypt & Upload**  
   Upload via Lighthouse encrypted upload API with token-gating enabled.

3. **Set Access Condition**  
   Define `balanceOf(DataCoin, user) ≥ 1` as the unlock condition.

4. **Register on Marketplace**  
   Add metadata, price, and chain preferences through `/app/agents/create`.

---

### 🧑‍🚀 User Flow

1. Browse AI agents at `/app/marketplace`.
2. Connect wallet through `/app/wallet`.
3. Pay in USDC → Nexus SDK bridges funds automatically.
4. Vault mints the agent's DataCoin to the user.
5. Lighthouse verifies token ownership → releases decryption key.
6. User decrypts and runs the `.tar` securely on their system.

---

## 🔐 Token-Gated Decryption Proof

When the agent file is uploaded to Lighthouse, it's encrypted with a key `Kf` that's locked behind a DataCoin ownership condition.

**Flow:**
1. `CT = Encrypt(agent.tar, Kf)` → stored on IPFS.
2. `Kf` is held by Lighthouse under condition: `balanceOf(DataCoin, user) ≥ 1`.
3. On verification, Lighthouse reconstructs `Kf` using distributed key shares.
4. User decrypts the agent file locally.

Anyone without DataCoin ownership cannot recover `Kf`, ensuring code confidentiality.

---

## 🧬 System Architecture

<img width="1920" height="1080" alt="Problem" src="https://github.com/user-attachments/assets/df49db97-6a85-4a6f-a5a1-ecc9971002f2" />


---

## 🛠 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | Next.js 15 with App Router | Modern React-based application structure |
| **UI Components** | Radix UI + Tailwind CSS | Accessible and responsive design system |
| **Blockchain Integration** | ethers.js + wagmi | Ethereum smart contract interactions |
| **Cross-Chain** | Nexus SDK | Unified balance and bridge functionality |
| **Storage** | Lighthouse Web3 | Decentralized file storage with encryption |
| **Smart Contracts** | Solidity + Hardhat | DataCoin creation and vault management |

---

## 🏦 Smart Contract Integration

The platform utilizes the **FormDatacoin** smart contract system located in `smart-contract/contracts/FormDatacoin.sol` for creating and managing DataCoins with flexible parameters. 

Users can create custom tokens with configurable:
- Vesting schedules
- Allocation mechanisms
- Token locking rules
- Access control policies

---


## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- MetaMask or compatible Web3 wallet
- Docker (for agent containerization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jay-366/ethonline.git
   cd ethonline
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following in `.env`:
   ```
   NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_key
   NEXT_PUBLIC_NEXUS_SDK_KEY=your_nexus_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔨 Smart Contract Setup

1. **Navigate to smart contract directory**
   ```bash
   cd smart-contract
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

4. **Deploy to testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. **Run tests**
   ```bash
   npx hardhat test
   ```

---

## 🎯 Key Features

### For Developers
- ✅ Encrypt and upload AI agents securely
- ✅ Set custom pricing in USDC
- ✅ Receive payments on preferred chains
- ✅ Maintain full code ownership
- ✅ Track usage and earnings

### For Users
- ✅ Browse verified AI agents
- ✅ Pay from any supported chain
- ✅ Instant access via DataCoin ownership
- ✅ Decrypt and run agents locally
- ✅ Transparent on-chain verification

---

## 🔗 Integrated Technologies

### Lighthouse IPFS
- Decentralized storage for encrypted agent files
- Token-gated access control
- Distributed key management
- Learn more: [lighthouse.storage](https://lighthouse.storage)

### Nexus SDK
- Cross-chain payment bridging
- Unified balance management
- Multi-chain smart account support
- Learn more: [nexus.xyz](https://nexus.xyz)

### DataCoin Vault
- Custom ERC-20 token creation
- Automated minting on purchase
- Access control enforcement
- Flexible vesting and allocation

---

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run smart contract tests:
```bash
cd smart-contract
npx hardhat test
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## ETHOnline 2025

Built with ❤️ for ETHOnline 2025

**Repository**: [github.com/Jay-366/ethonline](https://github.com/Jay-366/ethonline)

---

**Intellitrade** - Empowering the Decentralized AI Economy 
