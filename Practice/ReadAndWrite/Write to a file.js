const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the file path: ', (filePath) => {
  rl.question('Enter the text to write: ', (text) => {
    fs.writeFile(filePath, text, (err) => {   //either appendFile or this 
      if (err) { 
        console.error(`Error writing to file: ${err}`);
        rl.close();
        return;
      }

      console.log('Successfully wrote to file!');
      rl.close();
    });
  });
});
