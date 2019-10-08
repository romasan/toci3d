import EventEmitter from './helpers/EventEmitter.js';

import { v2d, add2d, v3d, add3d, mult2d } from './helpers/';

export default class Controls extends EventEmitter {
    constructor() {

        super();

        const keys = {};
        const kstep = .15;
        const checkKeyDown = e => {
            keys[e.keyCode] = keys[e.keyCode] ? keys[e.keyCode] + 1 : 1;
            if (keys[87]) { this.emit('rotate', v2d(0, kstep)); } // w
            if (keys[65]) { this.emit('rotate', v2d(-kstep, 0)); } // a
            if (keys[83]) { this.emit('rotate', v2d(0, -kstep)); } // s
            if (keys[68]) { this.emit('rotate', v2d(kstep, 0)); } // d
            if (keys[38]) { this.emit('rotateB', v2d(0, .1)); } // up
            if (keys[37]) { this.emit('rotateB', v2d(-.1, 0)); } // left
            if (keys[40]) { this.emit('rotateB', v2d(0, -.1)); } // down
            if (keys[39]) { this.emit('rotateB', v2d(.1, 0)); } // right
            // if (keys[16] === 1) { avatar.move(); } // shift
        }
        const checkKeyUp = e => {
            keys[e.keyCode] = 0;
            // if (!keys[16]) { avatar.stop(); } // shift
        }
        const gstep = .1;
        const checkGamepad = e => {
            if (e.LftStkG || e.LftStkV) {
                this.emit('rotate', mult2d(v2d(
                    e.LftStkG,
                    e.LftStkV
                ), gstep));
            }
            if (e.RgtStkG || e.RgtStkV) {
                this.emit('rotateB', mult2d(v2d(
                    e.RgtStkG,
                    e.RgtStkV
                ), .01));
            }
            // e.rt ? avatar.move() : avatar.stop();
        }
        this.on('gamepadUpdate', checkGamepad);
        document.body.addEventListener('keydown', checkKeyDown);
        document.body.addEventListener('keyup', checkKeyUp);

        this.update = () => {
            this.gamepad();
        }
    }
    gamepad() {
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
            this.emit('gamepadUpdate', {
                LftStkG, LftStkV, LftStkBtn,
                RgtStkG, RgtStkV, RgtStkBtn,
                a, b, x, y,
                lb, lt, rb, rt,
                select, start,
                up, down, left, right, 
            });
        }
        // gp.vibrationActuator.playEffect("dual-rumble", {
        //     startDelay: 0,
        //     duration: 1000,
        //     weakMagnitude: 1.0,
        //     strongMagnitude: 1.0
        // }).then(() => {});
    }
}
