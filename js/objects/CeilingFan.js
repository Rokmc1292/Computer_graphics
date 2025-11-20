/**
 * 천장 선풍기 클래스
 * GLB 모델을 사용하여 천장 선풍기 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

export class CeilingFan {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.fanModel = null;
    }

    /**
     * 천장 선풍기 생성 (GLB 모델 사용)
     * @param {number} x - X 위치
     * @param {number} y - Y 위치
     * @param {number} z - Z 위치
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
                    console.warn('⚠️ 천장 선풍기 모델 로딩 타임아웃 - 선풍기 없이 계속 진행');
                    resolve(); // reject 대신 resolve로 계속 진행
                }
            }, timeout);

            this.loader.load(
                'models/ceiling_fan.glb',
                (gltf) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);

                        this.fanModel = gltf.scene;

                        // 모델 위치 설정
                        this.fanModel.position.set(x, y, z);
                        this.fanModel.scale.set(1,1,1); // 스케일 증가
                        this.fanModel.rotation.set(0, 0, 0);

                        // 그림자 설정
                        this.fanModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });

                        this.scene.add(this.fanModel);
                        console.log('✓ 천장 선풍기 모델 로드 완료');
                        resolve();
                    }
                },
                (progress) => {
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`천장 선풍기 로딩: ${percent}%`);
                    }
                },
                (error) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        console.error('✗ 천장 선풍기 모델 로딩 실패:', error);
                        resolve(); // reject 대신 resolve로 계속 진행
                    }
                }
            );
        });
    }

    /**
     * 선풍기 회전 애니메이션 업데이트
     * @param {number} delta - 프레임 간 시간차
     */
    update(delta) {
        if (this.fanModel) {
            this.fanModel.rotation.y += delta * 5; // 빠르게 회전
        }
    }
}
