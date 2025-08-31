# 🚀 Symbiotic Protocol Indexer - Query Guide

Your Symbiotic Protocol Indexer is now live! This guide shows you how to query the indexed data.

## 🔗 Quick Access

- **GraphQL Playground**: https://thegraph.com/studio/subgraph/symbiotic-indexer
- **Query Endpoint**: `https://api.studio.thegraph.com/query/119891/symbiotic-indexer/v0.0.2`
- **Studio Dashboard**: https://thegraph.com/studio/subgraph/symbiotic-indexer

## 📊 Available Data

### Core Entities
- **Protocol**: Global Symbiotic metrics
- **Vaults**: Individual vault data and metrics  
- **Networks**: Network configurations and stats
- **Operators**: Operator information and activities
- **Deposits/Withdrawals**: Transaction history
- **Delegations**: Stake delegation tracking

## 🔍 Example Queries

### 1. Protocol Overview
```graphql
{
  protocol(id: "symbiotic") {
    totalVaults
    totalOperators  
    totalNetworks
    totalTVL
    createdAt
    updatedAt
  }
}
```

### 2. Top Vaults by TVL
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
    totalShares
    userCount
    restakingRatio
    createdAt
  }
}
```

### 3. Specific Vault Details
```graphql
{
  vault(id: "VAULT_ADDRESS") {
    address
    collateralToken
    collateralSymbol
    delegatorType
    slasherType
    totalStaked
    userCount
    deposits(first: 10, orderBy: timestamp, orderDirection: desc) {
      depositor
      amount
      shares
      timestamp
      transactionHash
    }
    withdrawals(first: 10, orderBy: timestamp, orderDirection: desc) {
      withdrawer
      amount
      epoch
      timestamp
    }
  }
}
```

### 4. Network Information
```graphql
{
  networks(first: 10) {
    id
    address
    admin
    totalStake
    operatorCount
    vaultCount
    operatorOptIns(where: {isOptedIn: true}) {
      operator {
        address
      }
    }
  }
}
```

### 5. Operator Activities
```graphql
{
  operators(first: 10, orderBy: totalStake, orderDirection: desc) {
    id
    address
    totalStake
    networkCount
    vaultCount
    networkOptIns(where: {isOptedIn: true}) {
      network {
        address
      }
      updatedAt
    }
    vaultOptIns(where: {isOptedIn: true}) {
      vault {
        address
        collateralSymbol
      }
      updatedAt
    }
  }
}
```

### 6. Recent Deposits
```graphql
{
  deposits(
    first: 20
    orderBy: timestamp
    orderDirection: desc
  ) {
    vault {
      address
      collateralSymbol
    }
    depositor
    recipient
    amount
    shares
    timestamp
    blockNumber
    transactionHash
  }
}
```

### 7. Network Delegations
```graphql
{
  networkDelegations(
    first: 50
    where: {amount_gt: "0"}
    orderBy: amount
    orderDirection: desc
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
    updatedAt
  }
}
```

### 8. Daily Protocol Metrics
```graphql
{
  dailyProtocolMetrics(
    first: 30
    orderBy: day
    orderDirection: desc
  ) {
    day
    totalTVL
    totalVaults
    totalOperators
    totalNetworks
    timestamp
  }
}
```

### 9. Vault Daily Metrics
```graphql
{
  dailyVaultMetrics(
    where: {vault: "VAULT_ADDRESS"}
    first: 30
    orderBy: day
    orderDirection: desc
  ) {
    day
    totalStaked
    userCount
    depositsCount
    depositsVolume
    withdrawalsCount
    withdrawalsVolume
  }
}
```

### 10. Search Vaults by Collateral
```graphql
{
  vaults(where: {collateralSymbol_contains: "ETH"}) {
    address
    collateralSymbol
    totalStaked
    userCount
    restakingRatio
  }
}
```

## 🛠️ Integration Examples

### JavaScript/TypeScript
```typescript
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/119891/symbiotic-indexer/v0.0.2';

async function fetchProtocolData() {
  const query = `
    {
      protocol(id: "symbiotic") {
        totalVaults
        totalTVL
      }
      vaults(first: 5, orderBy: totalStaked, orderDirection: desc) {
        address
        collateralSymbol
        totalStaked
      }
    }
  `;
  
  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  const data = await response.json();
  return data.data;
}
```

### Python
```python
import requests

SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/119891/symbiotic-indexer/v0.0.2'

def fetch_vault_data():
    query = """
    {
      vaults(first: 10) {
        address
        collateralSymbol
        totalStaked
        userCount
      }
    }
    """
    
    response = requests.post(
        SUBGRAPH_URL,
        json={'query': query}
    )
    
    return response.json()['data']
```

### cURL
```bash
curl -X POST \
  https://api.studio.thegraph.com/query/119891/symbiotic-indexer/v0.0.2 \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "{ protocol(id: \"symbiotic\") { totalVaults totalTVL } }"
  }'
```

## 📋 Query Patterns

### Filtering
```graphql
# Filter by amount greater than 1000
vaults(where: {totalStaked_gt: "1000"}) { ... }

# Filter by text contains
vaults(where: {collateralSymbol_contains: "ETH"}) { ... }

# Filter by boolean
operatorNetworkOptIns(where: {isOptedIn: true}) { ... }
```

### Sorting
```graphql
# Sort by field ascending
vaults(orderBy: totalStaked, orderDirection: asc) { ... }

# Sort by field descending  
vaults(orderBy: createdAt, orderDirection: desc) { ... }
```

### Pagination
```graphql
# Get first 10 results
vaults(first: 10) { ... }

# Skip first 10, get next 10
vaults(first: 10, skip: 10) { ... }
```

### Time-based Queries
```graphql
# Get deposits from last 24 hours
deposits(where: {timestamp_gt: "1693440000"}) { ... }

# Get data between timestamps
deposits(where: {
  timestamp_gt: "1693440000"
  timestamp_lt: "1693526400"
}) { ... }
```

## 🎯 Common Use Cases

### Dashboard Analytics
- Protocol overview metrics
- Top performing vaults
- Recent activity feeds
- Historical trend analysis

### Vault Monitoring
- Individual vault performance
- Deposit/withdrawal tracking
- User activity analysis
- Risk metrics

### Operator Insights
- Operator participation rates
- Network opt-in tracking
- Delegation management
- Performance monitoring

### Network Analysis
- Network growth metrics
- Operator distribution
- Stake allocation patterns
- Delegation flows

## 🔧 GraphQL Tips

### 1. Use Fragments for Reusability
```graphql
fragment VaultInfo on Vault {
  address
  collateralSymbol
  totalStaked
  userCount
}

query {
  vaults(first: 5) {
    ...VaultInfo
  }
}
```

### 2. Nested Queries for Related Data
```graphql
{
  vault(id: "0x...") {
    address
    deposits {
      amount
      depositor
    }
    operatorOptIns {
      operator {
        address
      }
    }
  }
}
```

### 3. Aliases for Multiple Queries
```graphql
{
  ethVaults: vaults(where: {collateralSymbol_contains: "ETH"}) {
    address
    totalStaked
  }
  btcVaults: vaults(where: {collateralSymbol_contains: "BTC"}) {
    address  
    totalStaked
  }
}
```

## 📚 Resources

- **GraphQL Docs**: https://graphql.org/learn/
- **The Graph Docs**: https://thegraph.com/docs/
- **Symbiotic Docs**: https://docs.symbiotic.fi/
- **Studio Dashboard**: https://thegraph.com/studio/subgraph/symbiotic-indexer

## 🆘 Need Help?

- Check the Studio dashboard for indexing status
- Visit the GraphQL playground for query testing
- Review error messages in the Studio logs
- Join [The Graph Discord](https://discord.gg/graphprotocol) for support

---

🚀 **Your Symbiotic Protocol data is now fully queryable and ready for integration!**
