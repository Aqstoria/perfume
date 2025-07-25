#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up GitHub repository for Project X...\n');

// Check if git is installed
try {
  execSync('git --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Git is not installed. Please install Git first.');
  process.exit(1);
}

// Check if we're in a git repository
const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));

if (!isGitRepo) {
  console.log('📁 Initializing Git repository...');
  try {
    execSync('git init', { stdio: 'inherit' });
    console.log('✅ Git repository initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Git repository:', error.message);
    process.exit(1);
  }
}

// Add all files
console.log('📦 Adding files to Git...');
try {
  execSync('git add .', { stdio: 'inherit' });
  console.log('✅ Files added to Git');
} catch (error) {
  console.error('❌ Failed to add files:', error.message);
  process.exit(1);
}

// Check if there are changes to commit
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (!status.trim()) {
    console.log('ℹ️  No changes to commit');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Failed to check Git status:', error.message);
  process.exit(1);
}

// Make initial commit
console.log('💾 Making initial commit...');
try {
  execSync('git commit -m "Initial commit: Project X - B2B Wholesale Perfume Platform"', { stdio: 'inherit' });
  console.log('✅ Initial commit created');
} catch (error) {
  console.error('❌ Failed to create commit:', error.message);
  process.exit(1);
}

console.log('\n🎉 GitHub repository setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Create a new repository on GitHub');
console.log('2. Run: git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git');
console.log('3. Run: git branch -M main');
console.log('4. Run: git push -u origin main');
console.log('\n📖 See VERCEL_DEPLOYMENT.md for deployment instructions'); 