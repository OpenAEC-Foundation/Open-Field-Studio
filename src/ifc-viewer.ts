// Minimal IFC viewer for Open Field Studio.
// Uses web-ifc (WASM parser) + three.js. Exposes window.__ofsIfcViewer for use by public/app.js.
// Phase 1: upload → parse → render meshes + orbit/pan/zoom. Ticket-pins on the 3D model come later.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IfcAPI } from 'web-ifc';
import webIfcWasmUrl from 'web-ifc/web-ifc.wasm?url';

type Viewer = {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    root: THREE.Group;
    dispose(): void;
};

let viewer: Viewer | null = null;
let ifcApi: IfcAPI | null = null;
let ifcApiReady: Promise<void> | null = null;

function initViewer(container: HTMLElement): Viewer {
    while (container.firstChild) container.removeChild(container.firstChild);
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a20);

    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 5000);
    camera.position.set(15, 15, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Ambient + hemisphere + one directional for readable shading.
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(30, 50, 20);
    scene.add(dir);

    const grid = new THREE.GridHelper(50, 50, 0x555555, 0x333333);
    scene.add(grid);

    const root = new THREE.Group();
    scene.add(root);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.target.set(0, 0, 0);

    let raf = 0;
    const loop = () => {
        controls.update();
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
        const nw = container.clientWidth || 800;
        const nh = container.clientHeight || 500;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return {
        scene, camera, renderer, controls, root,
        dispose() {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        }
    };
}

async function ensureIfcApi(): Promise<IfcAPI> {
    if (ifcApi && ifcApiReady) { await ifcApiReady; return ifcApi; }
    ifcApi = new IfcAPI();
    // Point web-ifc at the WASM bundled by Vite (?url returns the served path).
    const wasmPath = new URL(webIfcWasmUrl, window.location.origin).href;
    const wasmDir = wasmPath.substring(0, wasmPath.lastIndexOf('/') + 1);
    ifcApi.SetWasmPath(wasmDir);
    ifcApiReady = ifcApi.Init();
    await ifcApiReady;
    return ifcApi;
}

async function loadIfcArrayBuffer(container: HTMLElement, buffer: ArrayBuffer) {
    if (!viewer) viewer = initViewer(container);
    // Clear previous model
    while (viewer.root.children.length) {
        const c = viewer.root.children[0];
        viewer.root.remove(c);
        // @ts-expect-error dispose exists on geometry/material
        if (c.geometry) c.geometry.dispose();
    }

    const api = await ensureIfcApi();
    const modelId = api.OpenModel(new Uint8Array(buffer));

    // Iterate geometries and convert to Three.js meshes.
    const geometries = api.LoadAllGeometry(modelId);
    const sz = geometries.size();
    const groupBox = new THREE.Box3();

    for (let i = 0; i < sz; i++) {
        const placedGeom = geometries.get(i);
        const geom = api.GetGeometry(modelId, placedGeom.geometryExpressID);
        const verts = api.GetVertexArray(geom.GetVertexData(), geom.GetVertexDataSize());
        const indices = api.GetIndexArray(geom.GetIndexData(), geom.GetIndexDataSize());

        // Vertex layout: [x, y, z, nx, ny, nz] repeated
        const posArr = new Float32Array(verts.length / 2);
        const normArr = new Float32Array(verts.length / 2);
        for (let v = 0; v < verts.length / 6; v++) {
            posArr[v * 3]     = verts[v * 6];
            posArr[v * 3 + 1] = verts[v * 6 + 1];
            posArr[v * 3 + 2] = verts[v * 6 + 2];
            normArr[v * 3]     = verts[v * 6 + 3];
            normArr[v * 3 + 1] = verts[v * 6 + 4];
            normArr[v * 3 + 2] = verts[v * 6 + 5];
        }

        const bg = new THREE.BufferGeometry();
        bg.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
        bg.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
        bg.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

        const color = placedGeom.color;
        const mat = new THREE.MeshLambertMaterial({
            color: new THREE.Color(color.x, color.y, color.z),
            transparent: color.w < 1,
            opacity: color.w
        });
        const mesh = new THREE.Mesh(bg, mat);

        // Apply flat transformation from web-ifc (4x4 row-major).
        const m = new THREE.Matrix4();
        m.fromArray(placedGeom.flatTransformation);
        mesh.applyMatrix4(m);

        viewer.root.add(mesh);
        bg.computeBoundingBox();
        if (bg.boundingBox) groupBox.expandByObject(mesh);
    }

    api.CloseModel(modelId);

    // Frame the model in the camera.
    if (!groupBox.isEmpty()) {
        const center = groupBox.getCenter(new THREE.Vector3());
        const size = groupBox.getSize(new THREE.Vector3()).length();
        const dist = size * 1.2;
        viewer.camera.position.copy(center).add(new THREE.Vector3(dist, dist, dist));
        viewer.controls.target.copy(center);
        viewer.controls.update();
    }

    return { meshCount: sz };
}

function disposeViewer() {
    if (viewer) { viewer.dispose(); viewer = null; }
}

(window as unknown as { __ofsIfcViewer: unknown }).__ofsIfcViewer = {
    loadIfcArrayBuffer,
    disposeViewer
};
