import { trottle, el, v3d, v2d, add2d, add3d } from './helpers/';
import wsClient from './ws.js';
import iGL from './gl.js';

import * as THREE from 'three';

import Controls from './controls.js';

const state = {};

const send = trottle(e => {
    // 
}, 100);

class Cube {
    constructor(gl, position, direction) {

        const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        // const material = new THREE.MeshNormalMaterial();
        const texAvatart = new THREE.TextureLoader().load( '/assets/avatar.png' );
        const texSide = new THREE.TextureLoader().load( '/assets/side.png' );
        const matAvatar = new THREE.MeshBasicMaterial( { map: texAvatart } );
        const matSide = new THREE.MeshBasicMaterial( { map: texSide } );

        const materials = [
            matSide,
            matSide,
            matSide,
            matSide,
            matAvatar,
            matSide,
        ];

        const mesh = new THREE.Mesh( geometry, materials );

        this.position = position || v3d();
        this.direction = direction || v2d();

        mesh.position.x = this.position.x;
        mesh.position.y = this.position.x;
        mesh.position.z = this.position.x;

        mesh.rotation.x = this.direction.x;
        mesh.rotation.y = this.direction.y;

        gl.scene.add( mesh );

        this.mesh = mesh;

        this.moving = false;
    }
    rotate(v) {
        this.direction = add2d(this.direction, v);
        this.mesh.rotation.y = this.direction.x;
        this.mesh.rotation.x = this.direction.y;
    }
    move(v) {
        this.moving = true;
        // this.position = add3d(this.position, v);
    }
    stop() {
        this.moving = false;
    }
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

    const wrap = document.querySelector('#wrap');

    // let e = new el(wrap, 'div', 'avatar');
    // e.el.style.position = 'absolute';

    const gl = iGL(wrap);

    const avatar = new Cube(gl);

    const controls = new Controls();
    controls.on('rotate', v => {
        avatar.rotate(v);
    });
    // controls.on('move', avatar.move);

    raf.add(
        () => controls.gamepad(),
        gl.update
    );

    // const canvas = new el(wrap, 'canvas').el;

    // raf.add(() => {
    //     mesh.rotation.x += 0.01;
    //     mesh.rotation.y += 0.02;
    //     gl.update();
    // });
    wsClient();
}

document.addEventListener('DOMContentLoaded', () => {
    main();
});