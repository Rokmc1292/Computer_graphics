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
     * @returns {Promise} 모델 로딩 완료 Promise
     */
    create(x, y, z) {
        return new Promise((resolve, reject) => {
            let isResolved = false;
            const timeout = 30000; // 30초 타임아웃

            // 타임아웃 설정
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    console.warn(`⚠️ 창문 모델 로딩 타임아웃 (${x}, ${y}, ${z})`);
                    resolve(); // reject 대신 resolve로 계속 진행
                }
            }, timeout);

            this.loader.load(
                'models/window.glb',
                (gltf) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);

                        const windowModel = gltf.scene;

                        // 모델 위치 설정
                        windowModel.position.set(x, y, z);
                        windowModel.rotation.y = Math.PI ;
                        windowModel.scale.set(0.8,1,0.1);

                        // 그림자 설정
                        windowModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = false;
                                child.receiveShadow = true;
                            }
                        });

                        this.scene.add(windowModel);
                        console.log(`✓ 창문 로드 완료 (${x}, ${y}, ${z})`);
                        resolve();
                    }
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`창문 로딩: ${percent}%`);
                    }
                },
                (error) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        console.error(`✗ 창문 모델 로딩 실패 (${x}, ${y}, ${z}):`, error);
                        resolve(); // reject 대신 resolve로 계속 진행
                    }
                }
            );
        });
    }
}
