var http = require('http');
var WebSocketServer = require('ws').Server;

function v2d(x, y) {
    return {
        x: x || 0,
        y: y || 0
    };
}

function v3d(x, y, z) {
    return {
        x: x || 0,
        y: y || 0,
        z: z || 0
    };
}

var host = process.env.ADDR || "127.0.0.1";
var port = process.env.PORT || 80;

var server = http.createServer(function(request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.end(':)');
}).listen(port, host);

var wss = new WebSocketServer({
	server,
	autoAcceptConnections: false
});

var clients = {
    id: {}
};

let count = 0;

function calcSpace(position) {
    return v3d(0, 0, 0);
}

wss.on('connection', client => {

	const addr = client._socket.remoteAddress;
    
	const id = ++count;
    clients[id] = {
        client,
        name: 'Guest ' + id,
        avatar: '',
        position: v3d(0, 0, 0),
        direction: v2d(0, 0),
        space: v3d(0, 0, 0)
    };

    console.log('connected: client#' + id + ' from ' + addr + ' ' + new Date());

    // ping-pong
    client.on(2, function() {
        client.send(3);
    });
    
    client.on('upd', function(data) {
        for (var key in data) {
            if (key != 'client' && key != 'space' && clients[id][key]) {
                clients[id][key] = data[key];
            }
            if (data.position) {
                var space = calcSpace(data.position);
                if (
                    clients[id].space.x != space.x ||
                    clients[id].space.y != space.y ||
                    clients[id].space.z != space.z
                ) {
                    clients[id].space = space;
                }
            }
        }
    });

    client.on('close', function() {
        console.log('disconnected: client#' + id + ' ' + new Date());
	    delete clients[id];
	    // for (var key in clients) {
	    //   clients[key].send(JSON.stringify(response));
	    // }
    });
});