export default () => {

    const ws = new WebSocket('ws://localhost:80');

    ws.onopen = () => {
        console.log("Connected!");
    }

    ws.onmessage = e => {
        console.log('Message:', e);
    }

    return ws;
}