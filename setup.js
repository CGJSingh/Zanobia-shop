#!/usr/bin/env node

/**
 * Setup script for Zanobia Shop
 * This script helps with initial project setup
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Zanobia Shop...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created! Please update with your API credentials.\n');
  } else {
    console.log('⚠️  No env.example file found. Please create .env file manually.\n');
  }
} else {
  console.log('✅ .env file already exists.\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies are installed.\n');
}

console.log('🎉 Setup complete!\n');
console.log('Next steps:');
console.log('1. Update .env file with your API credentials');
console.log('2. Run: npm run dev');
console.log('3. Open http://localhost:3000\n');
console.log('For deployment instructions, see DEPLOYMENT.md');
