// Program to generate random number 


const random_val =()=>{
    const choice = Math.floor(Math.random() * 20) +1;    //Random number generated between range 1-20 (inclusive)
    return choice;
}

module.exports = random_val; // to export single function or value 