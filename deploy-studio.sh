#!/bin/bash

# 🚀 Symbiotic Protocol Indexer - Studio Deployment Guide
# ========================================================

echo "🚀 Symbiotic Protocol Indexer - Studio Deployment"
echo "=================================================="
echo ""

# Check if build exists
if [ ! -d "build" ]; then
    echo "📝 No build found. Building subgraph..."
    npx @graphprotocol/graph-cli build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed! Please fix errors and try again."
        exit 1
    fi
fi

echo "✅ Subgraph built successfully!"
echo ""
echo "📋 Next Steps for Studio Deployment:"
echo "====================================="
echo ""
echo "1. 🌐 Go to: https://thegraph.com/studio/"
echo "2. 🔗 Connect your wallet (MetaMask, WalletConnect, etc.)"
echo "3. ➕ Click 'Create a Subgraph'"
echo "4. 📝 Fill in the details:"
echo "   - Name: symbiotic-indexer"
echo "   - Subtitle: Comprehensive Symbiotic Protocol Indexer"
echo "   - Description: Production-ready indexing for Symbiotic protocol"
echo "5. 📋 Copy your subgraph slug (e.g., 'your-username/symbiotic-indexer')"
echo "6. 🔑 Copy your deploy key from the Studio dashboard"
echo ""
echo "7. 🚀 Deploy using these commands:"
echo "   ================================"
echo "   # Set your deploy key (replace YOUR_DEPLOY_KEY)"
echo "   graph auth YOUR_DEPLOY_KEY"
echo ""
echo "   # Deploy (replace YOUR_SUBGRAPH_SLUG)"  
echo "   graph deploy --studio YOUR_SUBGRAPH_SLUG"
echo ""
echo "🔄 Alternative one-liner (replace both placeholders):"
echo "graph auth YOUR_DEPLOY_KEY && graph deploy --studio YOUR_SUBGRAPH_SLUG"
echo ""
echo "📊 Example with placeholder values:"
echo "graph auth 1234567890abcdef && graph deploy --studio my-username/symbiotic-indexer"
echo ""
echo "⏰ After deployment:"
echo "- Monitor indexing progress in Studio dashboard"
echo "- Test queries in the GraphQL playground"
echo "- Check sync status and any indexing errors"
echo ""
echo "🎉 Your Symbiotic indexer will be live and ready to query!"
echo ""
echo "📖 For help, see README.md or visit:"
echo "   - The Graph Docs: https://thegraph.com/docs/"
echo "   - Discord: https://discord.gg/graphprotocol"
