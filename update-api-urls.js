const fs = require('fs');
const path = require('path');

// Define the directory to search in
const apiDir = path.join(__dirname, 'fusion_meals_frontend', 'src', 'app', 'api');

// Function to process a file
function processFile(filePath) {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace BACKEND_URL with NEXT_PUBLIC_API_URL
  const oldContent = content;
  content = content.replace(/process\.env\.BACKEND_URL/g, 'process.env.NEXT_PUBLIC_API_URL');
  
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
const updatedCount = walkDir(apiDir);
console.log(`Done. Updated ${updatedCount} files.`); 