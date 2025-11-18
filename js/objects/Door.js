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
     * @returns {Promise} 모델 로딩 완료 Promise
     */
    create() {
        return new Promise((resolve, reject) => {
            let isResolved = false;
            const timeout = 30000; // 30초 타임아웃

            // 타임아웃 설정
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    console.warn('⚠️ 출입문 모델 로딩 타임아웃 - 문 없이 계속 진행');
                    resolve(); // reject 대신 resolve로 계속 진행
                }
            }, timeout);

            this.loader.load(
                'models/door.glb',
                (gltf) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);

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
                        console.log('✓ 출입문 모델 로드 완료');
                        resolve();
                    }
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`출입문 로딩: ${percent}%`);
                    }
                },
                (error) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        console.error('✗ 출입문 모델 로딩 실패:', error);
                        resolve(); // reject 대신 resolve로 계속 진행
                    }
                }
            );
        });
    }
}
