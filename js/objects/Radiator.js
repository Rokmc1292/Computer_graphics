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
        this.radiatorModel = null;
        this.radiatorMaterial = null;
    }

    /**
     * 라디에이터 생성 (GLB 모델 사용)
     * @param {number} x - X 위치
     * @param {number} y - Y 위치
     * @param {number} z - Z 위치
     */
    create(x = 8, y = 0, z = 8) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'models/radiator.glb',
                (gltf) => {
                    this.radiatorModel = gltf.scene;

                    // 모델 위치 설정
                    this.radiatorModel.position.set(x, y, z);
                    this.radiatorModel.scale.set(5,5,5)

                    // 그림자 설정 및 발열 재질 추가
                    this.radiatorModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;

                            // 라디에이터 메인 메시에 발열 효과 추가
                            if (!this.radiatorMaterial && child.material) {
                                child.material = child.material.clone();
                                child.material.emissive = new THREE.Color(0xFF4400);
                                child.material.emissiveIntensity = 0.0;
                                this.radiatorMaterial = child.material;
                            }
                        }
                    });

                    this.scene.add(this.radiatorModel);
                    resolve();
                },
                (progress) => {
                    console.log('Radiator loading: ' + (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('Error loading radiator model:', error);
                    reject(error);
                }
            );
        });
    }

    /**
     * 라디에이터 열기 애니메이션 업데이트
     * @param {number} delta - 프레임 간 시간차
     * @param {number} elapsed - 총 경과 시간
     */
    update(delta, elapsed) {
        if (!this.radiatorMaterial) return;

        // 열기 강도 변화 (느리게 숨쉬듯이)
        const heatIntensity = (Math.sin(elapsed * 0.5) * 0.5 + 0.5); // 0~1
        this.radiatorMaterial.emissiveIntensity = heatIntensity * 0.3;

        // 색상도 약간 변화 (주황색에서 빨강색으로)
        const hue = 0.05 - (heatIntensity * 0.02); // 주황~빨강
        this.radiatorMaterial.emissive.setHSL(hue, 1.0, 0.5);
    }
}
