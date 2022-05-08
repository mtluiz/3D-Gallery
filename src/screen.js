import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragment from './shaders/fragment.fs.glsl';
import vertex from './shaders/vertex.vs.glsl';
import dat from 'dat.gui';
import texture from '../texture.jpg';

export default class Screen {
    constructor(options) {
        this.container = options.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 10, 1000);
        this.camera.position.z = 600;

        this.camera.fov = 2 * Math.atan((this.height / 2) / 600) * 180 / Math.PI;

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild(this.renderer.domElement);

        this.camera.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.camera.updateProjectionMatrix();

        this.settings = {
            progress: 0
        }
        const gui = new dat.GUI();
        gui.add(this.settings, "progress", 0, 1, 0.001)

        this.setupScreen(options.debug)
    }

    debugHelpers() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    setupScreen(debug) {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.createGeometries()
        this.animate()
        this.startEvents()
        if (debug) this.debugHelpers()
    }

    createGeometries() {
        const geometry = new THREE.PlaneBufferGeometry(300, 300, 100, 100);
        this.material = new THREE.ShaderMaterial({
            wireframe: !true,
            uniforms: {
                time: { value: 1.0 },
                uProgress: { value: 0 },
                uTexture: {value: new THREE.TextureLoader().load(texture)},
                uTextureSize: {value: new THREE.Vector2(100,100)},
                uCorners: {value: new THREE.Vector4(0,0,0,0)},
                uResolution: { value: new THREE.Vector2(this.width,this.height) },
                uQuadSize: { value: new THREE.Vector2(300,300) }
            },
            vertexShader: vertex,
            fragmentShader: fragment

        })
        this.mesh = new THREE.Mesh(geometry, this.material);

        this.scene.add(this.mesh)
    }

    animate() {
        this.time += 0.05;
        this.material.uniforms.time.value = this.time;
        this.material.uniforms.uProgress.value = this.settings.progress;

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.animate.bind(this))
    }

    startEvents() {
        window.addEventListener('resize', () => {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        })
    }
}