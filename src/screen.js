import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fragment from './shaders/fragment.fs.glsl';
import vertex from './shaders/vertex.vs.glsl';
import dat from 'dat.gui';
import texture from '../fallen.jpeg';
import texture2 from '../cabanel.jpeg';

export default class Screen {
    constructor(options) {
        this.container = options.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 10, 10000);
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

        const gui = new dat.GUI();

        console.log(this.meshes)
        this.meshes.forEach((x, i)=> {
            gui.add(x.material.uniforms.uProgress, "value", 0, 1, 0.001)
        })

    }

    createGeometries() {
        
        this.meshes = []

        const images = [texture, texture2];

        
        images.forEach((x, i )=> {
            const mesh = createMesh(x,  i * 500, 0, 0, this.width, this.height);
            this.scene.add(mesh)
            this.meshes.push(mesh)

            //gui.add(x.material.uniforms, "uProgress", 0, 1, 0.001)
        })
        
    }

    animate() {
        this.time += 0.05;

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



function createMesh(texture, positionX, positionY, positionZ, width, height) {

    const geometry = new THREE.PlaneBufferGeometry(350, 300, 100, 100);
    const material = new THREE.ShaderMaterial({
        wireframe: !true,
        uniforms: {
            time: { value: 1.0 },
            uProgress: { value: 0 },
            uTexture: { value: new THREE.TextureLoader().load(texture) },
            uTextureSize: { value: new THREE.Vector2(100, 100) },
            uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
            uResolution: { value: new THREE.Vector2(width, height) },
            uQuadSize: { value: new THREE.Vector2(300, 300) }
        },
        vertexShader: vertex,
        fragmentShader: fragment

    })
    const mesh = new THREE.Mesh(geometry, material) 
    mesh.position.x = positionX - 300 || 0;
    mesh.position.y = positionY - 1 || 0;
    mesh.position.z = positionZ - 1 || 0;
    return mesh;
}