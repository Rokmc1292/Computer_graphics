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
            let isResolved = false;
            const timeout = 60000; // 60초 타임아웃 (13MB 파일이라 더 길게)

            // 타임아웃 설정
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    console.warn('⚠️ TV 모델 로딩 타임아웃 - TV 없이 계속 진행');
                    resolve(); // reject 대신 resolve로 계속 진행
                }
            }, timeout);

            this.loader.load(
                'models/tv.glb',
                (gltf) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);

                        const tvModel = gltf.scene;

                        // 모델 위치 설정
                        tvModel.position.set(0, 4.5, 7.9);
                        tvModel.scale.set(5,5,5);

                        // 그림자 설정
                        tvModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });

                        this.scene.add(tvModel);
                        console.log('✓ TV 모델 로드 완료');
                        resolve();
                    }
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`TV 로딩: ${percent}% (${(progress.loaded / 1024 / 1024).toFixed(1)}MB / ${(progress.total / 1024 / 1024).toFixed(1)}MB)`);
                    }
                },
                (error) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        console.error('✗ TV 모델 로딩 실패:', error);
                        resolve(); // reject 대신 resolve로 계속 진행
                    }
                }
            );
        });
    }
}
