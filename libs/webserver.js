const fs = require('fs');
const http = require('http');

module.exports = function webServer(options, timer=100) {
    let time = timer;

    const server = http.createServer((req, res) => {         
        fs.readFile(options.file, "binary", (err, data) => {
            if(err){
                res.writeHead(500, {"Content-Type": "text/plain"})
                res.end("500 Error read file.");
                return
            } else {
                res.writeHead(200, {"Content-Type":"text/html; charset=windows-1251"});
                res.write(data,"binary");
                res.end();
            }
        });
    }).listen(options.port||3333, () => 'Server is start!');

    server.setTimeout(timer/2*1000);

    let idinterval = setInterval(() => {
        if(time > 0) {
            --time;
        } else {
            clearInterval(idinterval);
            server.close()
        }
    }, 1000);
    return server;
}
