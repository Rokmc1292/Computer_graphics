/**
 * 출입문 클래스
 * 생활관 출입문을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

export class Door {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    /**
     * 출입문 생성 (GLB 모델 사용)
     */
    create() {
        this.loader.load(
            'models/door.glb',
            (gltf) => {
                const doorModel = gltf.scene;

                // 모델 위치 설정
                doorModel.position.set(0, 2.4, -8);

                // 그림자 설정
                doorModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(doorModel);
            },
            (progress) => {
                console.log('Door loading: ' + (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading door model:', error);
            }
        );
    }
}
