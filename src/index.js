import { trottle } from './helpers/';

import EventEmitter from './helpers/EventEmitter.js';
const ev = new EventEmitter();

const state = {};

const send = trottle(e => {
    // 
}, 100);

const v2d = (x = 0, y = 0) => ({x, y});
const add2d = (a, b) => (v2d(a.x + b.x, a.y + b.y));
const v3d = (x = 0, y = 0, z = 0) => ({x, y, z});
const add3d = (a, b) => (v2d(a.x + b.x, a.y + b.y, a.z + b.z));

class Avatar {
    constructor(avatar, position, direction) {
        this.avatar = avatar;
        this.position = position || v3d();
        this.direction = direction || v2d();
        this.moving = false;
        this.updated = 1;
        this.update();
    }
    rotate(v) {
        this.direction = add2d(this.direction, v);
        this.updated++;
    }
    move(v) {
        this.moving = true;
        this.updated++;
        // this.position = add3d(this.position, v);
    }
    stop() {
        this.moving = false;
        this.updated++
    }
    update() {
        // if (this.moving) {
        //     this.move(this.position, p);
        // }
        if (!this.updated) {
            return;
        }
        this.avatar.text = `pos: ${JSON.stringify(this.position)}, dir: ${JSON.stringify(this.direction)}. ${this.moving ? 'moving' : ''}`;
        this.updated--;
        // send({
        //     pos: this.position,
        //     dir: this.direction
        // });
    }
}

const controls = avatar => {
    const keys = {};
    const checkKeyDown = e => {
        keys[e.keyCode] = true;
        if (keys[87]) { avatar.rotate(v2d(0, 1)); } // w
        if (keys[65]) { avatar.rotate(v2d(-1, 0)); } // a
        if (keys[83]) { avatar.rotate(v2d(0, -1)); } // s
        if (keys[68]) { avatar.rotate(v2d(1, 0)); } // d
        // if (keys[38]) { avatar.rotate(v2d(0, 1)); } // up
        // if (keys[37]) { avatar.rotate(v2d(-1, 0)); } // left
        // if (keys[40]) { avatar.rotate(v2d(0, -1)); } // down
        // if (keys[39]) { avatar.rotate(v2d(1, 0)); } // right
        if (keys[16]) { avatar.move(); } // shift
    }
    const checkKeyUp = e => {
        keys[e.keyCode] = false;
        if (!keys[16]) { avatar.stop(); } // shift
    }
    const checkGamepad = e => {
        if (e.LftStkG || e.LftStkV) {
            avatar.rotate(v2d(
                e.LftStkG,
                e.LftStkV
            ));
        }
        if (e.RgtStkG || e.RgtStkV) {
            // world.rotate();
        }
        e.rt ? avatar.move() : avatar.stop();
    }
    ev.on('gamepadUpdate', checkGamepad);
    document.body.addEventListener('keydown', checkKeyDown)
    document.body.addEventListener('keyup', checkKeyUp)
    // avatar.rotate();
    // avatar.move();
}

const gamepad = () => {
    const gp = navigator.getGamepads && navigator.getGamepads()[0];
    if (gp) {
        const { axes, buttons } = gp;
        const [LftStkG, LftStkV, RgtStkG, RgtStkV] = axes.map(e => Math.abs(e) > .0001 ? e : 0);
        const [
            a, b, x, y,
            lb, rb, lt, rt,
            select, start,
            LftStkBtn, RgtStkBtn,
            up, down, left, right,
        ] = buttons.map(e => e.pressed);
        ev.emit('gamepadUpdate', {
            LftStkG, LftStkV, LftStkBtn,
            RgtStkG, RgtStkV, RgtStkBtn,
            a, b, x, y,
            lb, lt, rb, rt,
            select, start,
            up, down, left, right, 
        });
    }
}

class el {
    constructor(wrap, tag = 'div', text) {
        this.wrap = wrap;
        this.el = document.createElement(tag);
        wrap.appendChild(this.el);
        this.prefix = text;
        this.text = text || '';
    }
    set text(v) {
        this.el.innerText = this.prefix ? (this.prefix + ': ' + v) : v;
    }
    set color(v) {
        this.el.style.color = v;
    }
}

/**
 * GL
 */

const glCube = gl => {
    // 
}

const iGL = canvas => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext && canvas.getContext("webgl");

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    });

    if (gl) {
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);

        glCube(gl);
    }
}

const draw = raf => {
    const wrap = document.querySelector('#wrap');
    let e = new el(wrap, 'div', 'avatar');
    e.el.style.position = 'absolute';
    const avatar = new Avatar(e);
    controls(avatar);
    raf.add(() => {
        avatar.update();
    });

    const canvas = new el(wrap, 'canvas').el;
    iGL(canvas);
}

let runners = [];
class RoadRunner {
    constructor() {
        this.runners = [];
        const raf = t => {
            for (const runner of this.runners) {
                runner(t);
            }
            window.requestAnimationFrame(raf);
        };
        window.requestAnimationFrame && window.requestAnimationFrame(raf);
    }
    add(...runners) {
        for (const runner of runners) {
            typeof runner === 'function' && this.runners.push(runner);
        }
    }
}

const main = () => {
    const raf = new RoadRunner();
    raf.add(
        gamepad,
    );
    draw(raf);
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});