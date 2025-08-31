# 🚀 Symbiotic Protocol Indexer

A comprehensive subgraph for indexing the Symbiotic Protocol on Ethereum mainnet. This indexer captures all core on-chain activity including vaults, networks, operators, delegations, and transactions.

## 🌟 Features

- **Complete Protocol Coverage**: Indexes all major Symbiotic contracts
- **Real-time Data**: Live tracking of deposits, withdrawals, and delegations  
- **Historical Metrics**: Daily aggregated data for analytics
- **Dynamic Vault Support**: Automatically indexes new vaults as they're created
- **Relationship Mapping**: Tracks connections between vaults, networks, and operators

## 📊 Indexed Data

### Core Entities
- **Protocol**: Global Symbiotic metrics and configuration
- **Vaults**: Individual vault data, configurations, and metrics
- **Networks**: Network information and operator relationships
- **Operators**: Operator details and opt-in status
- **Deposits/Withdrawals**: Complete transaction history
- **Delegations**: Network delegation tracking
- **Daily Metrics**: Aggregated daily statistics

### Contract Coverage
- VaultFactory (`0xAEb6bdd95c502390db8f52c8909F703E9Af6a346`)
- NetworkRegistry (`0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA`)
- OperatorRegistry (`0xAd817a6Bc954F678451A71363f04150FDD81Af9F`)
- OperatorNetworkOptInService (`0x7133415b33B438843D581013f98A08704316633c`)
- OperatorVaultOptInService (`0xb361894bC06cbBA7Ea8098BF0e32EB1906A5F891`)

## 🔗 Live Endpoints

- **GraphQL Playground**: https://thegraph.com/studio/subgraph/symbiotic-indexer
- **Query Endpoint**: `https://api.studio.thegraph.com/query/119891/symbiotic-indexer/v0.0.2`
- **Studio Dashboard**: https://thegraph.com/studio/subgraph/symbiotic-indexer

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- The Graph CLI

### Installation
```bash
npm install -g @graphprotocol/graph-cli
npm install
```

### Build
```bash
graph build
```

### Deploy
```bash
# Set your deploy key
graph auth --studio <YOUR_DEPLOY_KEY>

# Deploy to Subgraph Studio
graph deploy --studio symbiotic-indexer
```

## 📋 Example Queries

### Protocol Overview
```graphql
{
  protocol(id: "symbiotic") {
    totalVaults
    totalOperators
    totalNetworks
    totalTVL
  }
}
```

### Top Vaults
```graphql
{
  vaults(first: 10, orderBy: totalStaked, orderDirection: desc) {
    address
    collateralSymbol
    totalStaked
    userCount
  }
}
```

### Recent Deposits
```graphql
{
  deposits(first: 20, orderBy: timestamp, orderDirection: desc) {
    vault { address collateralSymbol }
    depositor
    amount
    timestamp
    transactionHash
  }
}
```

## 🏗️ Architecture

### Data Sources
- **Static Data Sources**: Core protocol contracts with fixed addresses
- **Dynamic Data Sources**: Vault templates that index individual vaults as they're created

### Mappings
- `vaultFactory.ts`: Handles vault creation and protocol initialization
- `networkRegistry.ts`: Manages network registration events
- `operatorRegistry.ts`: Tracks operator registration
- `operatorNetworkOptIn.ts`: Handles network opt-in/out events
- `operatorVaultOptIn.ts`: Manages vault opt-in/out events
- `vault.ts`: Processes vault-specific events (deposits, withdrawals, etc.)

### Schema Design
The schema is designed for optimal querying with:
- Bidirectional relationships between entities
- Comprehensive indexing on key fields
- Daily metric aggregations for time-series analysis
- Efficient pagination support

## 🔧 Development

### Project Structure
```
├── schema.graphql          # GraphQL schema definition
├── subgraph.yaml          # Subgraph manifest
├── src/
│   ├── mappings/          # Event handlers
│   └── utils/             # Helper functions
├── abis/                  # Contract ABIs
└── QUERY_GUIDE.md         # Query examples and documentation
```

### Adding New Contracts
1. Add the contract ABI to `abis/`
2. Update `subgraph.yaml` with the new data source
3. Create mapping functions in `src/mappings/`
4. Update the schema if needed

### Testing
```bash
# Build to check for compilation errors
graph build

# Deploy to a test environment
graph deploy --node <TEST_NODE_URL>
```

## 📚 Documentation

- [Query Guide](./QUERY_GUIDE.md) - Comprehensive query examples
- [Symbiotic Docs](https://docs.symbiotic.fi/) - Protocol documentation
- [The Graph Docs](https://thegraph.com/docs/) - Subgraph development guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Join [The Graph Discord](https://discord.gg/graphprotocol)
- Check [Symbiotic Discord](https://discord.symbiotic.fi/)
- Open an issue for bugs or feature requests

---

**Built for the Symbiotic Protocol ecosystem** 🌟

## Architecture

### Data Sources

1. **VaultFactory** (`0xAEb6bdd95c502390db8f52c8909F703E9Af6a346`)
   - Tracks vault creation events
   - Creates dynamic vault data sources

2. **NetworkRegistry** (`0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA`)
   - Indexes network registrations

3. **OperatorRegistry** (`0xAd817a6Bc954F678451A71363f04150FDD81Af9F`)
   - Tracks operator registrations

4. **OperatorNetworkOptInService** (`0x7133415b33B438843D581013f98A08704316633c`)
   - Handles operator-network opt-ins/outs

5. **OperatorVaultOptInService** (`0xb361894bC06cbBA7Ea8098BF0e32EB1906A5F891`)
   - Handles operator-vault opt-ins/outs

6. **Vault Template** (Dynamic)
   - Individual vault events (deposits, withdrawals, slashes, claims)

### Entity Schema

#### Core Entities
- `Protocol` - Global protocol state and metrics
- `Vault` - Individual vault data and metrics
- `Network` - Network configurations and metrics
- `Operator` - Operator data and metrics

#### Activity Entities
- `Deposit` - Deposit transactions
- `Withdrawal` - Withdrawal transactions
- `Slash` - Slashing events
- `Claim` - Claim events

#### Relationship Entities
- `OperatorNetworkOptIn` - Operator-network relationships
- `VaultOperatorOptIn` - Vault-operator relationships
- `NetworkDelegation` - Network delegation state
- `DelegationSnapshot` - Historical delegation data

#### Metrics Entities
- `DailyProtocolMetric` - Daily protocol-level metrics
- `DailyVaultMetric` - Daily vault-level metrics
- `DailyNetworkMetric` - Daily network-level metrics

## Installation & Setup

### Prerequisites
- Node.js v18+ and npm
- The Graph CLI

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install The Graph CLI:**
   ```bash
   npm install -g @graphprotocol/graph-cli
   ```

3. **Generate types:**
   ```bash
   npm run codegen
   ```

4. **Build the subgraph:**
   ```bash
   npm run build
   ```

### Deployment

#### To Subgraph Studio

1. **Create a subgraph in [Subgraph Studio](https://thegraph.com/studio/)**

2. **Deploy:**
   ```bash
   graph deploy --studio symbiotic-indexer
   ```

#### To Local Graph Node

1. **Start local graph node** (see [Graph Node documentation](https://github.com/graphprotocol/graph-node))

2. **Deploy locally:**
   ```bash
   npm run deploy-local
   ```

## Usage

### Example Queries

#### Get Protocol Overview
```graphql
{
  protocol(id: "symbiotic") {
    totalVaults
    totalOperators
    totalNetworks
    totalTVL
  }
}
```

#### Get Top Vaults by TVL
```graphql
{
  vaults(
    first: 10
    orderBy: totalStaked
    orderDirection: desc
  ) {
    id
    address
    collateralSymbol
    totalStaked
    userCount
    restakingRatio
  }
}
```

#### Get Operator Activities
```graphql
{
  operator(id: "0x...") {
    address
    totalStake
    networkCount
    vaultCount
    networkOptIns {
      network {
        id
        address
      }
      isOptedIn
    }
  }
}
```

#### Get Network Delegations
```graphql
{
  networkDelegations(
    where: { network: "0x..." }
    first: 100
  ) {
    network {
      address
    }
    vault {
      address
      collateralSymbol
    }
    operator {
      address
    }
    amount
    shares
  }
}
```

#### Get Vault Activity
```graphql
{
  deposits(
    where: { vault: "0x..." }
    first: 100
    orderBy: timestamp
    orderDirection: desc
  ) {
    depositor
    amount
    shares
    timestamp
  }
}
```

## Development

### Project Structure
```
├── src/
│   ├── mappings/          # Event handlers
│   │   ├── vaultFactory.ts
│   │   ├── vault.ts
│   │   ├── networkRegistry.ts
│   │   ├── operatorRegistry.ts
│   │   ├── operatorNetworkOptIn.ts
│   │   └── operatorVaultOptIn.ts
│   └── utils/             # Helper functions
│       ├── constants.ts
│       └── protocol.ts
├── abis/                  # Contract ABIs
├── schema.graphql         # GraphQL schema
├── subgraph.yaml         # Subgraph manifest
└── generated/            # Generated types
```

### Adding New Data Sources

1. Add contract ABI to `abis/`
2. Create mapping file in `src/mappings/`
3. Update `subgraph.yaml` with new data source
4. Run `npm run codegen` to generate types
5. Build and deploy

### Testing

The subgraph includes comprehensive event handling for all major Symbiotic protocol activities. Test by:

1. Deploying to a local graph node
2. Simulating transactions on a fork
3. Querying the GraphQL endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contract Addresses (Mainnet)

### Core Contracts
- VaultFactory: `0xAEb6bdd95c502390db8f52c8909F703E9Af6a346`
- DelegatorFactory: `0x985Ed57AF9D475f1d83c1c1c8826A0E5A34E8C7B`
- SlasherFactory: `0x685c2eD7D59814d2a597409058Ee7a92F21e48Fd`
- NetworkRegistry: `0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA`
- OperatorRegistry: `0xAd817a6Bc954F678451A71363f04150FDD81Af9F`
- VaultConfigurator: `0x29300b1d3150B4E2b12fE80BE72f365E200441EC`

### Services
- OperatorNetworkOptInService: `0x7133415b33B438843D581013f98A08704316633c`
- OperatorVaultOptInService: `0xb361894bC06cbBA7Ea8098BF0e32EB1906A5F891`
- NetworkMiddlewareService: `0xD7dC9B366c027743D90761F71858BCa83C6899Ad`

See [Symbiotic Documentation](https://docs.symbiotic.fi/deployments/mainnet) for complete list.
