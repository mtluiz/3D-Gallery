import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragment from './shaders/fragment.fs.glsl';
import vertex from './shaders/vertex.vs.glsl';

export default class Screen {
    constructor(options) {
        const {domElement, debug} = options;
        this.renderer = new THREE.WebGLRenderer({ canvas: domElement, antialias: true, });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.scene = new THREE.Scene();
        this.time = 0;

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
        const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 100, 100);
        this.material = new THREE.ShaderMaterial({
            wireframe: true, 
                uniforms:{
                    time: {value: 1.0},
                    resolution: {value: new THREE.Vector2()}
                },
                vertexShader: vertex,
                fragmentShader: fragment

        })
        this.box = new THREE.Mesh(geometry, this.material);

        this.scene.add(this.box)
    }

    animate() {
        this.time += 0.1
        console.log(this.time)
        this.material.uniforms.time.value = this.time

        this.renderer.render(this.scene, this.camera)
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