import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragment from './shaders/fragment.fs.glsl';
import fragment from './shaders/vertex.vs.glsl';

export default class Screen {
    constructor(options) {
        const {domElement, debug} = options;
        this.renderer = new THREE.WebGLRenderer({ canvas: domElement, antialias: true, });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1)
        this.camera.position.z = 5

       this.setupScreen(debug)
    }

    debugHelpers(){
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setupScreen(debug){
        this.createGeometries()
        this.animate()
        this.startEvents()
        if(debug) this.debugHelpers()
    }

    createGeometries() {
        const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        this.box = new THREE.Mesh(geometry, material);

        this.scene.add(this.box)
    }

    animate() {
        this.renderer.render(this.scene, this.camera)
        this.box.rotation.x += 0.01
        requestAnimationFrame(this.animate.bind(this))
    }

    startEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.camera.updateProjectionMatrix();
        })
    }
}