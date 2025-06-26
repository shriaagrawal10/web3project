const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

// Helper functions for different ethers versions
function formatEther(value) {
  return ethers.formatEther ? ethers.formatEther(value) : ethers.utils.formatEther(value);
}

function formatUnits(value, unit) {
  return ethers.formatUnits ? ethers.formatUnits(value, unit) : ethers.utils.formatUnits(value, unit);
}

function parseUnits(value, unit) {
  return ethers.parseUnits ? ethers.parseUnits(value, unit) : ethers.utils.parseUnits(value, unit);
}

async function main() {
  try {
    console.log("🚀 Starting deployment process...");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 1: Check network connection and configuration
    await checkNetworkConnection();

    // Step 2: Validate wallet and balance
    await validateWallet();

    // Step 3: List available contracts
    const contractName = await getContractName();

    // Step 4: Deploy contract with detailed logging
    await deployContract(contractName);

    console.log("✅ Deployment completed successfully!");

  } catch (error) {
    console.error("❌ Deployment failed:");
    handleError(error);
    process.exit(1);
  }
}

async function checkNetworkConnection() {
  try {
    console.log("🌐 Checking network connection...");
    
    const network = await ethers.provider.getNetwork();
    console.log(`   ✓ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`   ✓ Latest block: ${blockNumber}`);
    
    const feeData = await ethers.provider.getFeeData();
    if (feeData.gasPrice) {
      const gasPriceInGwei = formatUnits(feeData.gasPrice, "gwei");
      console.log(`   ✓ Current gas price: ${gasPriceInGwei} gwei`);
    }
    
  } catch (error) {
    throw new Error(`Network connection failed: ${error.message}`);
  }
}

async function validateWallet() {
  try {
    console.log("👛 Validating wallet...");
    
    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`   ✓ Deployer address: ${address}`);
    
    const balance = await ethers.provider.getBalance(address);
    const balanceInEth = formatEther(balance);
    console.log(`   ✓ Deployer balance: ${balanceInEth} ETH`);
    
    if (parseFloat(balanceInEth) < 0.01) {
      console.warn("   ⚠️  Warning: Low balance! You might not have enough funds for deployment.");
    }
    
    return deployer;
    
  } catch (error) {
    throw new Error(`Wallet validation failed: ${error.message}`);
  }
}

async function getContractName() {
  try {
    console.log("📄 Scanning for contracts...");
    
    const contractsDir = path.join(process.cwd(), "contracts");
    
    if (!fs.existsSync(contractsDir)) {
      throw new Error("Contracts directory not found! Make sure you have a 'contracts' folder.");
    }
    
    const files = fs.readdirSync(contractsDir)
      .filter(file => file.endsWith('.sol'))
      .map(file => file.replace('.sol', ''));
    
    if (files.length === 0) {
      throw new Error("No Solidity contracts found in the contracts directory!");
    }
    
    console.log("   📋 Available contracts:");
    files.forEach((contract, index) => {
      console.log(`      ${index + 1}. ${contract}`);
    });
    
    // For this example, we'll try to deploy the first contract found
    // In a real scenario, you might want to specify the contract name
    const contractName = files[0];
    console.log(`   ✓ Selected contract: ${contractName}`);
    
    return contractName;
    
  } catch (error) {
    throw new Error(`Contract scanning failed: ${error.message}`);
  }
}

async function deployContract(contractName) {
  try {
    console.log(`🔨 Deploying contract: ${contractName}...`);
    
    // Get the contract factory
    const ContractFactory = await ethers.getContractFactory(contractName);
    console.log(`   ✓ Contract factory created for ${contractName}`);
    
    // Check if constructor requires arguments
    const constructorFragment = ContractFactory.interface.fragments.find(f => f.type === 'constructor');
    
    let constructorArgs = [];
    if (constructorFragment && constructorFragment.inputs.length > 0) {
      console.log("   📋 Constructor parameters required:");
      constructorFragment.inputs.forEach((input, index) => {
        console.log(`      ${index + 1}. ${input.name} (${input.type})`);
      });
      
      // Provide default constructor arguments based on common patterns
      constructorArgs = getDefaultConstructorArgs(constructorFragment.inputs, contractName);
      console.log(`   ✓ Using constructor arguments:`, constructorArgs);
    } else {
      console.log(`   ✓ No constructor arguments required`);
    }
    
    // Estimate gas for deployment
    try {
      const deploymentData = ContractFactory.interface.encodeDeploy(constructorArgs);
      const estimatedGas = await ethers.provider.estimateGas({
        data: ContractFactory.bytecode + deploymentData.slice(2)
      });
      console.log(`   ✓ Estimated gas for deployment: ${estimatedGas.toString()}`);
      
      // Get current gas price
      const feeData = await ethers.provider.getFeeData();
      if (feeData.gasPrice) {
        const estimatedCost = estimatedGas * feeData.gasPrice;
        console.log(`   ✓ Estimated deployment cost: ${formatEther(estimatedCost)} ETH`);
      }
    } catch (gasError) {
      console.log(`   ⚠️  Could not estimate gas: ${gasError.message}`);
    }
    
    // Deploy the contract with constructor arguments
    console.log("   🚀 Deploying contract...");
    
    // Replace address placeholders with actual deployer address
    const [deployer] = await ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const finalArgs = await replaceAddressPlaceholders(constructorArgs, deployerAddress);
    
    const contract = await ContractFactory.deploy(...finalArgs);
    
    // Debug: Log contract object properties
    console.log("   🔍 Debug: Contract object methods:", Object.getOwnPropertyNames(contract));
    console.log("   🔍 Debug: Contract prototype methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(contract)));
    
    // Get deployment transaction hash - handle both ethers v5 and v6
    let deploymentTx = { hash: "unknown" };
    
    if (contract.deploymentTransaction) {
      // ethers v6 - property
      deploymentTx = contract.deploymentTransaction;
      console.log("   ✓ Using ethers v6 deploymentTransaction property");
    } else if (contract.deployTransaction) {
      // ethers v5 - property  
      deploymentTx = contract.deployTransaction;
      console.log("   ✓ Using ethers v5 deployTransaction property");
    } else {
      console.log("   ⚠️  No deployment transaction found, using fallback");
    }
    
    console.log(`   ⏳ Transaction hash: ${deploymentTx.hash}`);
    console.log("   ⏳ Waiting for deployment confirmation...");
    
    // Wait for deployment to complete - handle both ethers v5 and v6
    let contractAddress;
    
    try {
      if (typeof contract.waitForDeployment === 'function') {
        // ethers v6
        console.log("   🔄 Using ethers v6 waitForDeployment()");
        await contract.waitForDeployment();
        
        if (typeof contract.getAddress === 'function') {
          contractAddress = await contract.getAddress();
        } else {
          contractAddress = contract.address;
        }
      } else if (typeof contract.deployed === 'function') {
        // ethers v5
        console.log("   🔄 Using ethers v5 deployed()");
        const deployedContract = await contract.deployed();
        contractAddress = deployedContract.address;
      } else {
        // Last resort - wait for transaction and get address
        console.log("   🔄 Using fallback method - waiting for transaction");
        if (deploymentTx.hash !== "unknown") {
          const receipt = await ethers.provider.waitForTransaction(deploymentTx.hash);
          contractAddress = receipt.contractAddress;
        } else {
          throw new Error("Cannot determine contract address - no valid deployment method found");
        }
      }
    } catch (waitError) {
      console.error("   ❌ Error during deployment wait:", waitError.message);
      throw waitError;
    }
    
    if (!contractAddress) {
      throw new Error("Contract address is undefined after deployment");
    }
    
    console.log(`   ✅ Contract deployed successfully!`);
    console.log(`   📍 Contract address: ${contractAddress}`);
    
    // Verify deployment
    await verifyDeployment(contract, contractName, contractAddress);
    
    // Save deployment info
    saveDeploymentInfo(contractName, contractAddress, deploymentTx.hash, constructorArgs);
    
    return contract;
    
  } catch (error) {
    console.error("   🔥 Deployment error details:", error);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error("Insufficient funds for deployment. Please add more ETH to your wallet.");
    } else if (error.code === 'REPLACEMENT_UNDERPRICED') {
      throw new Error("Transaction underpriced. Try increasing gas price.");
    } else if (error.code === 'NONCE_EXPIRED') {
      throw new Error("Nonce expired. Try resetting your wallet or waiting a moment.");
    } else if (error.code === 'INVALID_ARGUMENT') {
      throw new Error(`Invalid constructor arguments. Please check your contract constructor requirements. Error: ${error.message}`);
    } else {
      throw new Error(`Contract deployment failed: ${error.message}`);
    }
  }
}

async function verifyDeployment(contract, contractName, contractAddress = null) {
  try {
    console.log("🔍 Verifying deployment...");
    
    // Get contract address - use provided address or get from contract
    let address = contractAddress;
    if (!address) {
      if (typeof contract.getAddress === 'function') {
        // ethers v6
        address = await contract.getAddress();
      } else if (contract.address) {
        // ethers v5
        address = contract.address;
      } else {
        throw new Error("Cannot determine contract address for verification");
      }
    }
    
    const code = await ethers.provider.getCode(address);
    
    if (code === '0x') {
      throw new Error("Contract verification failed: No code found at contract address");
    }
    
    console.log(`   ✓ Contract code verified at address: ${address}`);
    console.log(`   ✓ Code size: ${(code.length - 2) / 2} bytes`);
    
  } catch (error) {
    throw new Error(`Contract verification failed: ${error.message}`);
  }
}

function getDefaultConstructorArgs(inputs, contractName) {
  const args = [];
  
  for (const input of inputs) {
    switch (input.type) {
      case 'uint256':
        if (input.name.toLowerCase().includes('time')) {
          // For unlock time, set to 1 hour from now
          const oneHourFromNow = Math.floor(Date.now() / 1000) + 3600;
          args.push(oneHourFromNow);
          console.log(`      → ${input.name}: ${oneHourFromNow} (1 hour from now)`);
        } else if (input.name.toLowerCase().includes('supply')) {
          // For token supply
          args.push(parseUnits("1000000", 18));
          console.log(`      → ${input.name}: 1,000,000 tokens`);
        } else {
          // Default uint256 value
          args.push(0);
          console.log(`      → ${input.name}: 0`);
        }
        break;
      
      case 'address':
        if (input.name.toLowerCase().includes('owner')) {
          // Use deployer address as owner
          args.push('DEPLOYER_ADDRESS'); // Will be replaced with actual address
          console.log(`      → ${input.name}: <deployer address>`);
        } else {
          // Zero address
          args.push('0x0000000000000000000000000000000000000000');
          console.log(`      → ${input.name}: 0x0000000000000000000000000000000000000000`);
        }
        break;
      
      case 'string':
        if (input.name.toLowerCase().includes('name')) {
          args.push("My Token");
          console.log(`      → ${input.name}: "My Token"`);
        } else if (input.name.toLowerCase().includes('symbol')) {
          args.push("MTK");
          console.log(`      → ${input.name}: "MTK"`);
        } else {
          args.push("");
          console.log(`      → ${input.name}: ""`);
        }
        break;
      
      case 'bool':
        args.push(false);
        console.log(`      → ${input.name}: false`);
        break;
      
      default:
        // For arrays or other complex types, use empty/zero values
        if (input.type.includes('[]')) {
          args.push([]);
          console.log(`      → ${input.name}: []`);
        } else {
          args.push(0);
          console.log(`      → ${input.name}: 0 (default)`);
        }
    }
  }
  
  return args;
}

async function replaceAddressPlaceholders(args, deployerAddress) {
  return args.map(arg => {
    if (arg === 'DEPLOYER_ADDRESS') {
      return deployerAddress;
    }
    return arg;
  });
}

function saveDeploymentInfo(contractName, address, txHash, constructorArgs = []) {
  try {
    const deploymentInfo = {
      contractName,
      address,
      transactionHash: txHash,
      constructorArgs,
      timestamp: new Date().toISOString(),
      network: process.env.HARDHAT_NETWORK || 'localhost'
    };
    
    const deploymentsDir = path.join(process.cwd(), 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    const filename = `${contractName}_${Date.now()}.json`;
    const filepath = path.join(deploymentsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`   💾 Deployment info saved to: ${filepath}`);
    
  } catch (error) {
    console.warn(`   ⚠️  Warning: Could not save deployment info: ${error.message}`);
  }
}

function handleError(error) {
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("🔥 ERROR DETAILS:");
  console.error(`   Error Type: ${error.constructor.name}`);
  console.error(`   Message: ${error.message}`);
  
  if (error.code) {
    console.error(`   Error Code: ${error.code}`);
  }
  
  if (error.reason) {
    console.error(`   Reason: ${error.reason}`);
  }
  
  if (error.transaction) {
    console.error(`   Transaction: ${JSON.stringify(error.transaction, null, 2)}`);
  }
  
  if (error.receipt) {
    console.error(`   Receipt: ${JSON.stringify(error.receipt, null, 2)}`);
  }
  
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Common solutions
  console.error("🛠️  POSSIBLE SOLUTIONS:");
  
  if (error.message.includes('insufficient funds')) {
    console.error("   • Add more ETH to your wallet");
    console.error("   • Check if you're on the correct network");
  }
  
  if (error.message.includes('gas')) {
    console.error("   • Try increasing gas limit or gas price");
    console.error("   • Wait for network congestion to reduce");
  }
  
  if (error.message.includes('nonce')) {
    console.error("   • Reset your MetaMask account (Settings > Advanced > Reset Account)");
    console.error("   • Wait a moment and try again");
  }
  
  if (error.message.includes('network') || error.message.includes('connection')) {
    console.error("   • Check your internet connection");
    console.error("   • Verify your RPC URL in hardhat.config.js");
    console.error("   • Try a different RPC provider");
  }
  
  if (error.message.includes('contract') || error.message.includes('compilation')) {
    console.error("   • Run 'npx hardhat compile' first");
    console.error("   • Check your contract for compilation errors");
    console.error("   • Verify contract name matches the file name");
  }
  
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main()
  .then(() => {
    console.log("🎉 Script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:");
    handleError(error);
    process.exit(1);
  });