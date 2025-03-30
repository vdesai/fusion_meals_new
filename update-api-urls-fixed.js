const fs = require('fs');
const path = require('path');

// Define the directory to search in
const frontendDir = path.join(__dirname, 'fusion_meals_frontend');

// Function to process a file
function processFile(filePath) {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace hardcoded URLs with environment variable
  const oldContent = content;
  
  // Replace http://127.0.0.1:8000 or http://127.0.0.1:8001 with env var
  content = content.replace(/['"]http:\/\/127\.0\.0\.1:800[01]['"]/g, '`${process.env.NEXT_PUBLIC_API_URL || \'https://fusion-meals-new.onrender.com\'}`');
  
  // Replace fallback URL in template literals
  content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL \|\| ['"]http:\/\/127\.0\.0\.1:800[01]['"]/g, 'process.env.NEXT_PUBLIC_API_URL || \'https://fusion-meals-new.onrender.com\'');
  
  // If the content was changed, write it back to the file
  if (content !== oldContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Function to walk a directory recursively
function walkDir(dir) {
  let count = 0;
  
  // Get all files in the current directory
  const files = fs.readdirSync(dir);
  
  // Process each file/directory
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      count += walkDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      // Process TypeScript files
      if (processFile(filePath)) {
        count++;
      }
    }
  }
  
  return count;
}

// Start processing
console.log('Updating API URLs...');
const updatedCount = walkDir(path.join(frontendDir, 'src'));
console.log(`Done. Updated ${updatedCount} files.`); 