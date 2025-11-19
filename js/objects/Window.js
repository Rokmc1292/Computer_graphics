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
        this.windowModel = null;
        this.glassMaterials = [];
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

                        this.windowModel = gltf.scene;

                        // 모델 위치 설정
                        this.windowModel.position.set(x, y, z);
                        this.windowModel.rotation.y = Math.PI ;
                        this.windowModel.scale.set(0.8,1,0.1);

                        // 그림자 설정 및 유리 재질 찾기
                        this.windowModel.traverse((child) => {
                            if (child.isMesh) {
                                child.castShadow = false;
                                child.receiveShadow = true;

                                // 투명하거나 반투명한 재질을 유리로 간주
                                if (child.material) {
                                    if (child.material.transparent || child.material.opacity < 1.0) {
                                        child.material = child.material.clone();
                                        child.material.emissive = new THREE.Color(0x87CEEB);
                                        child.material.emissiveIntensity = 0.0;
                                        this.glassMaterials.push(child.material);
                                    }
                                }
                            }
                        });

                        this.scene.add(this.windowModel);
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

    /**
     * 창문 빛 색상 애니메이션 업데이트 (낮/밤 효과)
     * @param {number} delta - 프레임 간 시간차
     * @param {number} elapsed - 총 경과 시간
     */
    update(delta, elapsed) {
        if (this.glassMaterials.length === 0) return;

        // 시간에 따른 빛 색상 변화 (낮 -> 저녁 -> 밤)
        const dayNightCycle = (Math.sin(elapsed * 0.2) * 0.5 + 0.5); // 0~1

        this.glassMaterials.forEach(material => {
            // 낮: 하늘색, 저녁: 주황색, 밤: 파란색
            if (dayNightCycle > 0.66) {
                // 낮 (하늘색)
                material.emissive.setHSL(0.55, 0.7, 0.6);
                material.emissiveIntensity = 0.2;
            } else if (dayNightCycle > 0.33) {
                // 저녁 (주황색)
                material.emissive.setHSL(0.08, 1.0, 0.5);
                material.emissiveIntensity = 0.3;
            } else {
                // 밤 (어두운 파란색)
                material.emissive.setHSL(0.6, 0.5, 0.2);
                material.emissiveIntensity = 0.1;
            }
        });
    }
}
