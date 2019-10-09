import EventEmitter from './helpers/EventEmitter.js';

import { v2d, add2d, v3d, add3d, mult2d } from './helpers/';
import { runInThisContext } from 'vm';

export default class Controls extends EventEmitter {
    constructor() {

        super();

        this.keys = {};

        const checkKeyDown = e => {
            this.keys[e.keyCode] = true;
        }
        const checkKeyUp = e => {
            this.keys[e.keyCode] = false;
        }

        this.step = .1;

        // this.on('gamepadUpdate', checkGamepad);
        document.body.addEventListener('keydown', checkKeyDown);
        document.body.addEventListener('keyup', checkKeyUp);

        this.update = t => {
            this.keyoard();
            this.gamepad();
        }
    }
    keyoard() {
        if (this.keys[87]) { this.emit('rotateA', v2d(0, -this.step)); } // w
        if (this.keys[65]) { this.emit('rotateA', v2d(-this.step, 0)); } // a
        if (this.keys[83]) { this.emit('rotateA', v2d(0, this.step)); } // s
        if (this.keys[68]) { this.emit('rotateA', v2d(this.step, 0)); } // d
        if (this.keys[38]) { this.emit('rotateB', v2d(0, -this.step)); } // up
        if (this.keys[37]) { this.emit('rotateB', v2d(-this.step, 0)); } // left
        if (this.keys[40]) { this.emit('rotateB', v2d(0, this.step)); } // down
        if (this.keys[39]) { this.emit('rotateB', v2d(this.step, 0)); } // right
        if (this.keys[16]) { this.emit('move', this.step); } // shift
        if (this.keys[17]) { this.emit('move', -this.step); } // Ctrl
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

            if (LftStkG || LftStkV) {
                this.emit('rotateA', mult2d(v2d(
                    LftStkG,
                    LftStkV
                ), this.step));
            }

            if (RgtStkG || RgtStkV) {
                this.emit('rotateB', mult2d(v2d(
                    RgtStkG,
                    RgtStkV
                ), this.step));
            }

            if (rt) {
                this.emit('forward');
            }

            if (lt) {
                this.emit('back');
            }
        }
        // gp.vibrationActuator.playEffect("dual-rumble", {
        //     startDelay: 0,
        //     duration: 1000,
        //     weakMagnitude: 1.0,
        //     strongMagnitude: 1.0
        // }).then(() => {});
    }
}
