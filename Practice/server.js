const http = require('http')

const receptor = function(request, response){
    const url = request.url
    const method = request.method
    if (url ==='/'){
        response.end('Hello world')
    }
    else if (url === '/about'){
        response.end('About')
    }
    
    else if (url === '/contact'){
        response.end('contact')
    }
    else{
        response.end('Not found')
    }
    
}


const server = http.createServer(receptor)

server.listen(3000, function(){
    console.log('Server is listening')
})





