import * as THREE from 'three';

export default wrap => {

    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = .5;
    // camera.rotation.z = .1;
 
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
        update: () => {
            renderer.render( scene, camera );
        }
    }
}