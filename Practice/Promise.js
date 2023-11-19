const fs = require("fs");
readfile = (time, callback) => {
    return new Promise((resolve, reject)=>{

        setTimeout(() => {
            fs.readFile("hello.txt", "utf8", (err, data) => {
              if (err) {
                reject(err);
                // callback(err);
              } else{
                resolve(data);
                // callback(null, data);
              }
            });
          }, time);
    })

};

const promise = readfile(1000)  

promise.then((data) =>{
    console.log(data);
}).catch( (err) =>{
    console.error('Error:', err)
})
console.log('I will get printed first'); 

// readfile(1000, function(e,d){  
//     if (e){
//         console.log(e)
//     }
//     else{
//         console.log(d)
//     }
// })