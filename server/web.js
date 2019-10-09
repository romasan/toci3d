const http = require('http');

const host = process.env.ADDR || "127.0.0.1";
const port = process.env.PORT || 80;

let webCounter = 0;

exports.server = http.createServer(function(request, response) {

    if (request.url === '/favicon.ico') {
        response.writeHead(200, {'Content-Type': 'image/x-icon'});
        response.end('');
        return;    
    }

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(
`<html>
<head>
<meta charset="utf-8">
</head>
<body>
Поздравляю! ты ${++webCounter}-й кто зачем-то сюда зашёл :)
</body>
</html>`);

}).listen(port, host);