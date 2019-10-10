import {
    interval, animationFrameScheduler,
    from, fromEvent, fromEventPattern,
} from 'rxjs';

import {
    max, map, mapTo, take
} from 'rxjs/internal/operators';

import { webSocket } from "rxjs/webSocket";

export default () => {

    fromEvent(document.body, 'click')
        .pipe(
            // take(3),
            map(e => e.screenX),
            max()
        )
        .subscribe(v => console.log(v));

    // fromEventPattern(h => controls.on('rotateA', h))
    //     .subscribe(v => console.log(v));

    //    ---

    const ws = webSocket('ws://localhost:80');
    
    ws.subscribe(v => console.log(v));

    const channelTEST = ws.multiplex(
        () => ({subscribe: 'TEST'}),
        () => ({unsubscribe: 'TEST'}),
        message => message.type === 'TEST'
    ).subscribe(v => console.log('TEST:', v));

    interval(1e3).pipe(
        mapTo(2)
    ).subscribe(ws);
}