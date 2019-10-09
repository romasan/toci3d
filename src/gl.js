import * as THREE from 'three';

export const Cube = (p = {}, r = {}) => {

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
    
    mesh.position.set(p.x || 0, p.y || 0, p.z || 0);
    mesh.rotation.set(r.x || 0, r.y || 0, r.z || 0);

    return mesh;
}

export default wrap => {

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1.0;
 
    const scene = new THREE.Scene();
 
    const renderer = new THREE.WebGLRenderer({
        // canvas,
        // antialias: true
        alpha: true,
    });

    renderer.setSize( window.innerWidth, window.innerHeight );

    // const skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// const skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	// const skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    // scene.add(skyBox);
    
    // const controls = new THREE.OrbitControls( camera, renderer.domElement );
    // controls.update();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    });

    wrap.appendChild( renderer.domElement );

    return {
        scene,
        camera,
        render: () => {
            renderer.render( scene, camera );
        }
    }
}