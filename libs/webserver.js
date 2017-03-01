const fs = require('fs');
const http = require('http');

module.exports = function webServer(options, timer) {
    const html = fs.createReadStream(options.file);
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        html.pipe(res);
    }).listen(options.port||3333, () => console.log('Server is start!'));

    (function countDown(counter) {
        if(counter > 0)
        return setTimeout(countDown, 1000, counter--);

        console.log(counter);
        server.close(() => console.log('Server closed!'));
    })(timer)
}
