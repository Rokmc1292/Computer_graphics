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
        this.tvModel = null;
        this.screenMaterial = null;
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

                        this.tvModel = gltf.scene;

                        // 모델 위치 설정
                        this.tvModel.position.set(0, 4.5, 7.9);
                        this.tvModel.scale.set(5,5,5);

                        // 그림자 설정 및 화면 찾기
                        this.tvModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = true;
                                child.receiveShadow = true;

                                // TV 화면 찾기 (이름이나 재질로 식별)
                                // 화면은 일반적으로 어두운 색상의 평면
                                if (child.material && child.material.color) {
                                    // 어두운 재질을 화면으로 간주
                                    const color = child.material.color;
                                    const brightness = (color.r + color.g + color.b) / 3;
                                    if (brightness < 0.3 && !this.screenMaterial) {
                                        // 화면 재질 설정
                                        child.material = child.material.clone();
                                        child.material.emissive = new THREE.Color(0x2244FF);
                                        child.material.emissiveIntensity = 0.5;
                                        this.screenMaterial = child.material;
                                    }
                                }
                            }
                        });

                        this.scene.add(this.tvModel);
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

    /**
     * TV 화면 애니메이션 업데이트
     * @param {number} delta - 프레임 간 시간차
     * @param {number} elapsed - 총 경과 시간
     */
    update(delta, elapsed) {
        if (!this.screenMaterial) return;

        // 채널 변경 효과: 색상이 천천히 변화
        const hue = (Math.sin(elapsed * 0.3) * 0.5 + 0.5); // 0~1 사이
        this.screenMaterial.emissive.setHSL(hue * 0.7, 0.8, 0.5); // 다양한 색상

        // 밝기 변화 (미세한 깜빡임)
        const flicker = Math.sin(elapsed * 10) * 0.1; // 빠른 깜빡임
        const slow = Math.sin(elapsed * 0.5) * 0.3; // 느린 변화
        this.screenMaterial.emissiveIntensity = 0.5 + flicker + slow;
    }
}
