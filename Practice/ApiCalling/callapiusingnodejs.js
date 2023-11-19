const https = require('https');
const fs = require('fs');

const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1'; // Replace with the actual API URL
const outputFilePath = 'data.txt'; // Replace with the desired output file path

const fileStream = fs.createWriteStream(outputFilePath);

https.get(apiUrl, (response) => {
  response.pipe(fileStream);

  response.on('end', () => {
    console.log('Data has been saved to', outputFilePath);
  });
}).on('error', (error) => {
  console.error('Error retrieving data:', error);
});