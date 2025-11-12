/**
 * TV 클래스
 * 생활관 벽걸이 TV를 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class TV {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * TV 생성 (플라스틱 프레임 + 스크린)
     */
    create() {
        const tvGroup = new THREE.Group();

        // TV 프레임 (플라스틱 재질)
        const frameGeometry = new THREE.BoxGeometry(3.3, 2, 0.05);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x2F2F2F,
            roughness: 0.5,
            metalness: 0.1
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.castShadow = true;
        frame.receiveShadow = true;
        tvGroup.add(frame);

        // TV 화면 (약간 반사되는 검은 스크린)
        const screenGeometry = new THREE.BoxGeometry(1.8, 1, 0.02);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x0A0A0A,
            roughness: 0.1,      // 반사되는 스크린
            metalness: 0.3,
            emissive: 0x001122,  // 꺼진 TV의 미세한 발광
            emissiveIntensity: 0.1
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.06;
        screen.receiveShadow = true;
        tvGroup.add(screen);

        tvGroup.position.set(0, 4.5, 7.9);
        this.scene.add(tvGroup);
    }
}