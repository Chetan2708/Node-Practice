const random_choice = require("./RandomNumber")    // importing RandomNumber module 


// Random number 
const random_num  =  random_choice() 


// Perform calculations on the random number
const squaredNumber = random_num ** 2;
const cubedNumber = random_num ** 3;
const squareRoot = Math.sqrt(random_num);
const roundedNumber = Math.round(random_num);

// Display the results
console.log("Random Number:", random_num);
console.log("Squared Number:", squaredNumber);
console.log("Cubed Number:", cubedNumber);
console.log("Square Root:", squareRoot);


