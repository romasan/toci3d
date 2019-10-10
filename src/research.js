import {
    interval, animationFrameScheduler,
    from, fromEvent, fromEventPattern,
    of,
} from 'rxjs';

import {
    max, map, mapTo, take,
    skipUntil, takeUntil, repeat,
    mergeMap, mergeScan,
    scan, switchMap,
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

    const log = x => console.log(x);

    const move = fromEvent(document.body, 'mousemove');
    const down = fromEvent(document.body, 'mousedown')
    const up = fromEvent(document.body, 'mouseup')

    // const drag = move.pipe(
    //     takeUntil(up),
    //     skipUntil(down),
    //     repeat(),
    //     map(e => ({x: e.clientX, y: e.clientY}))
    // );

    const drag = down.pipe(
        mergeMap(e => {
            console.log('start');
            return move.pipe(
                takeUntil(up)
            )
        }),
        map(e => ({x: e.clientX, y: e.clientY, type: e.type}))
    );

    drag.subscribe(log);

    // ---

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