const { server } = require('./web.js');
const WebSocketServer = require('ws').Server;

const { v2d, v3d } = require('./helpers.js');

const wss = new WebSocketServer({
	server,
	autoAcceptConnections: false
});

const clients = {
    // id: {}
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
        for (const key in data) {
            if (key != 'client' && key != 'space' && clients[id][key]) {
                clients[id][key] = data[key];
            }
            if (data.position) {
                const space = calcSpace(data.position);
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