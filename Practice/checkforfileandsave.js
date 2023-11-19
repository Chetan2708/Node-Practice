const fs = require('fs');
const path = require('path');
const { copyFileSync, mkdirSync } = require('fs');

function findFilesByExtension(srcDir, extension, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
  }

  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    const stats = fs.statSync(filePath);   //isFile() , Size , isDirectory()

    if (stats.isFile() && path.extname(file) === extension) {
      const destPath = path.join(destDir, file);
      copyFileSync(filePath, destPath);
    } else if (stats.isDirectory()) {
      const subDir = path.join(srcDir, file);
      findFilesByExtension(subDir, extension, destDir);
    }
  }
}
// Example usage
const sourceDir = 'D:/check';
const destinationDir = 'C:/Users/Chetan Gupta/Desktop/Mystuff/NodeJs/supercoders';
const fileExtension = '.txt';     //Search for file with extension as .txt


findFilesByExtension(sourceDir, fileExtension, destinationDir);