/**
 * 라디에이터 클래스
 * 생활관 라디에이터를 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

export class Radiator {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    /**
     * 라디에이터 생성 (GLB 모델 사용)
     * TV 옆 바닥에 배치
     */
    create() {
        this.loader.load(
            'models/radiator.glb',
            (gltf) => {
                const radiatorModel = gltf.scene;

                // 모델 위치 설정 (TV 옆 바닥)
                // TV 위치: (0, 4.5, 7.9)
                // Radiator: TV 옆 바닥에 배치
                radiatorModel.position.set(8, 8, 8);

                // 그림자 설정
                radiatorModel.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(radiatorModel);
            },
            (progress) => {
                console.log('Radiator loading: ' + (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading radiator model:', error);
            }
        );
    }
}
