/**
 * 화병 클래스
 * LatheGeometry를 이용한 회전 표면 객체
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Vase {
    constructor(scene) {
        this.scene = scene;
        this.vaseModel = null;
    }

    /**
     * 화병 생성 (LatheGeometry 사용)
     * @param {number} x - X 위치
     * @param {number} y - Y 위치
     * @param {number} z - Z 위치
     * @param {string} type - 화병 타입 ('vase', 'cup', 'bottle')
     */
    create(x, y, z, type = 'vase') {
        let points = [];

        // 타입에 따라 다른 모양의 포인트 배열 생성
        switch (type) {
            case 'vase':
                // 화병 모양 (아래가 넓고 중간이 좁고 위가 약간 넓음)
                points = [
                    new THREE.Vector2(0, 0),      // 바닥 중심
                    new THREE.Vector2(0.3, 0),    // 바닥 가장자리
                    new THREE.Vector2(0.35, 0.2),
                    new THREE.Vector2(0.25, 0.4), // 중간 좁은 부분
                    new THREE.Vector2(0.28, 0.6),
                    new THREE.Vector2(0.32, 0.8),
                    new THREE.Vector2(0.3, 1.0),  // 목 부분
                    new THREE.Vector2(0.35, 1.1), // 입구
                ];
                break;

            case 'cup':
                // 컵 모양 (아래가 좁고 위가 넓음)
                points = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0.15, 0),
                    new THREE.Vector2(0.18, 0.3),
                    new THREE.Vector2(0.22, 0.6),
                    new THREE.Vector2(0.25, 0.8),
                ];
                break;

            case 'bottle':
                // 병 모양 (아래가 넓고 목이 좁음)
                points = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0.25, 0),
                    new THREE.Vector2(0.28, 0.3),
                    new THREE.Vector2(0.25, 0.6),
                    new THREE.Vector2(0.15, 0.8),  // 목 부분
                    new THREE.Vector2(0.12, 1.0),
                    new THREE.Vector2(0.15, 1.2),  // 입구
                ];
                break;

            default:
                points = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0.3, 0),
                    new THREE.Vector2(0.3, 1.0),
                ];
        }

        // LatheGeometry 생성 (Y축 중심으로 회전)
        const latheGeometry = new THREE.LatheGeometry(
            points,
            32  // 회전 세그먼트 수 (클수록 부드러움)
        );

        // 재질 생성 (도자기 느낌)
        const material = new THREE.MeshStandardMaterial({
            color: type === 'vase' ? 0x8B4513 : (type === 'cup' ? 0xFFFFFF : 0x4169E1),
            roughness: 0.4,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        this.vaseModel = new THREE.Mesh(latheGeometry, material);
        this.vaseModel.position.set(x, y, z);
        this.vaseModel.castShadow = true;
        this.vaseModel.receiveShadow = true;

        this.scene.add(this.vaseModel);
        console.log(`✓ ${type} 생성 완료 (LatheGeometry)`);
    }

    /**
     * 화병 회전 애니메이션 (선택사항)
     * @param {number} delta - 프레임 간 시간차
     */
    update(delta) {
        if (this.vaseModel) {
            this.vaseModel.rotation.y += delta * 0.5; // 천천히 회전
        }
    }
}
