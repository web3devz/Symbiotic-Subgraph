const https = require('https');

const contracts = [
  { name: 'VaultFactory', address: '0xAEb6bdd95c502390db8f52c8909F703E9Af6a346' },
  { name: 'NetworkRegistry', address: '0xC773b1011461e7314CF05f97d95aa8e92C1Fd8aA' },
  { name: 'OperatorRegistry', address: '0xAd817a6Bc954F678451A71363f04150FDD81Af9F' }
];

async function findFirstTransaction(contract) {
  return new Promise((resolve, reject) => {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${contract.address}&startblock=0&endblock=latest&page=1&offset=1&sort=asc&apikey=demo`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === '1' && response.result && response.result.length > 0) {
            const firstTx = response.result[0];
            console.log(`\n📄 ${contract.name} (${contract.address})`);
            console.log(`   First TX: Block ${firstTx.blockNumber} (${new Date(firstTx.timeStamp * 1000).toISOString()})`);
            console.log(`   TX Hash: ${firstTx.hash}`);
            console.log(`   Method: ${firstTx.input.slice(0, 10)}`);
            
            // Check if this is a contract creation
            if (firstTx.to === '') {
              console.log(`   🎯 CONTRACT CREATION`);
            }
          } else {
            console.log(`\n📄 ${contract.name}: No transactions found`);
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
  console.log(`🔍 Finding deployment blocks for Symbiotic contracts...\n`);
  
  for (const contract of contracts) {
    await findFirstTransaction(contract);
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('\n✅ Deployment check complete!');
}

main().catch(console.error);
