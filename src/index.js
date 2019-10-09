import { trottle, el, v3d, v2d, add2d, add3d } from './helpers/';
import wsClient from './ws.js';
import initGL, { Cube } from './gl.js';

import * as THREE from 'three';

import Controls from './controls.js';

const state = {};

const send = trottle(e => {
    // 
}, 100);

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

    const wrap = document.querySelector('#wrap');
    const gl = initGL(wrap);

    const cubes = [
        [0, 0, 0],
        [-.2, .2, 0],
        [.2, .2, 0],
        [-.2, -.2, 0],
        [.2, -.2, 0]
    ].map(e => Cube(new THREE.Vector3(...e)));

    cubes.forEach(cube => gl.scene.add(cube));

    const controls = new Controls();
    controls.on('rotateA', v => {
        cubes.forEach(cube => {
            cube.rotation.x += v.y;
            cube.rotation.y += v.x;
        });
    }).on('rotateB', v => {
        gl.camera.rotation.y += -v.x * .5;
        gl.camera.rotation.x += -v.y * .5;
    }).on('move', v => {
        const wd = gl.camera.getWorldDirection(new THREE.Vector3());
        gl.camera.position.add(wd.multiplyScalar(v))
    });

    const raf = new RoadRunner();
    raf.add(
        controls.update,
        gl.render
    );

    wsClient();
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});