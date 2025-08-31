const https = require('https');

const contracts = [
  { name: 'VaultFactory', address: '0xAEb6bdd95c502390db8f52c8909F703E9Af6a346' },
  { name: 'NetworkRegistry', address: '0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA' },
  { name: 'OperatorRegistry', address: '0xAd817a6Bc954F678451A71363f04150FDD81Af9F' },
  { name: 'OperatorNetworkOptInService', address: '0x7133415b33B438843D581013f98A08704316633c' },
  { name: 'OperatorVaultOptInService', address: '0xb361894bC06cbBA7Ea8098BF0e32EB1906A5F891' }
];

const startBlock = 20651000;

async function checkContract(contract) {
  return new Promise((resolve, reject) => {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${contract.address}&startblock=${startBlock}&endblock=latest&page=1&offset=10&sort=asc&apikey=demo`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === '1' && response.result) {
            console.log(`\n📄 ${contract.name} (${contract.address})`);
            console.log(`   Transactions since block ${startBlock}: ${response.result.length}`);
            
            if (response.result.length > 0) {
              const firstTx = response.result[0];
              console.log(`   First TX: Block ${firstTx.blockNumber} (${new Date(firstTx.timeStamp * 1000).toISOString()})`);
              console.log(`   TX Hash: ${firstTx.hash}`);
            }
          } else {
            console.log(`\n📄 ${contract.name}: No transactions or API error`);
          }
          resolve();
        } catch (e) {
          console.log(`\n📄 ${contract.name}: Error parsing response`);
          resolve();
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`🔍 Checking Symbiotic contract activity since block ${startBlock}...\n`);
  
  for (const contract of contracts) {
    await checkContract(contract);
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n✅ Activity check complete!');
}

main().catch(console.error);
