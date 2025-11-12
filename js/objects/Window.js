/**
 * 창문 클래스
 * 생활관 창문을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

export class Window {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    /**
     * 창문 생성 (GLB 모델 사용)
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        this.loader.load(
            'models/window.glb',
            (gltf) => {
                const windowModel = gltf.scene;

                // 모델 위치 설정
                windowModel.position.set(x, y, z);
                windowModel.rotation.y = Math.PI / 2;

                // 그림자 설정
                windowModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = false;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(windowModel);
            },
            (progress) => {
                console.log('Window loading: ' + (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading window model:', error);
            }
        );
    }
}
