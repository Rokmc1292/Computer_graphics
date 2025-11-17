/**
 * TV 클래스
 * 생활관 벽걸이 TV를 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

export class TV {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    /**
     * TV 생성 (GLB 모델 사용)
     * @returns {Promise} 모델 로딩 완료 Promise
     */
    create() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'models/tv.glb',
                (gltf) => {
                    const tvModel = gltf.scene;

                    // 모델 위치 설정
                    tvModel.position.set(0, 4.5, 7.9);

                    // 그림자 설정
                    tvModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    this.scene.add(tvModel);
                    resolve();
                },
                (progress) => {
                    console.log('TV loading: ' + (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('Error loading TV model:', error);
                    reject(error);
                }
            );
        });
    }
}
