const fs = require('fs');
const https = require('https');

function readFileAsync(filePath) {   //Reading from file 
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function makeHttpRequest(url) {                  //making http request of apis and extracting data
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let responseData = '';

      response.on('data', (chunk) => {
        responseData += chunk;
      }).on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON response: ${error.message}`));
        }
      })
    }).on('error', (error) => {
      reject(new Error(`HTTP request failed: ${error.message}`));
    });
  });
}

async function processUrls() {
  const filePath = 'api.json'; //  file path of api's

  try {
    const fileData = await readFileAsync(filePath);
    const jsonData = JSON.parse(fileData);

    for (let i = 0; i < jsonData.length; i++) {
      const { name, url } = jsonData[i];

      try {
        const responseData = await makeHttpRequest(url);
        const fileName = `api_${i}.json`;

        fs.writeFile(fileName, JSON.stringify(responseData, null, 2), 'utf8', (err) => {
          if (err) {
            console.error(`Error writing to file ${fileName}: ${err}`);
          } else {
            console.log(`Data from URL ${url} saved to ${fileName}`);
          }
        });
      } catch (error) {
        console.error(`Error processing URL ${url}: ${error}`);
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${error}`);
  }
}

processUrls();
