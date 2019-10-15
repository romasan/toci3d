import { interval, animationFrameScheduler, Subject } from 'rxjs';
import wsClient from './ws.js';
import initGL, { Cube } from './gl.js';

import research from './research.js';

import * as THREE from 'three';

import Controls from './controls.js';

const main = () => {

    research();

    const wrap = document.querySelector('#wrap');
    const gl = initGL(wrap);

    const cubes = [
        [-.2, .2, 0], [.2, .2, 0],
        [0, 0, 0],
        [-.2, -.2, 0], [.2, -.2, 0]
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

    const clock = new Subject();

    const FPS = 60;
    interval(1000 / FPS, animationFrameScheduler).subscribe(clock);

    clock.subscribe(controls.update);
    clock.subscribe(gl.render);
    
    // const ws = wsClient();
}

document.addEventListener('DOMContentLoaded', main);