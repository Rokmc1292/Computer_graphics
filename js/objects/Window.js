/**
 * 창문 클래스
 * 생활관 창문을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Window {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 창문 생성 (현실적인 유리 재질)
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        const windowGroup = new THREE.Group();

        // 유리창 (PBR 재질로 현실적인 유리 효과 + 발광)
        const glassGeometry = new THREE.BoxGeometry(0.02, 1.8, 1.3);
        const glassMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.2,
            roughness: 0.05,      // 매우 매끄러운 유리
            metalness: 0.0,
            envMapIntensity: 1.5,
            transmission: 0.95,    // 높은 빛 투과
            thickness: 0.5,
            emissive: 0xFFFAE0,   // 햇빛이 통과하는 밝은 발광
            emissiveIntensity: 0.8
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.castShadow = false;
        glass.receiveShadow = true;
        windowGroup.add(glass);

        // 금속 창틀 재질
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x909090,
            roughness: 0.3,
            metalness: 0.8
        });

        // 가로 창틀
        const horizontalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.04, 1.3),
            frameMaterial
        );
        horizontalDivider.position.y = 0;
        horizontalDivider.castShadow = true;
        horizontalDivider.receiveShadow = true;
        windowGroup.add(horizontalDivider);

        // 세로 창틀
        const verticalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 1.8, 0.04),
            frameMaterial
        );
        verticalDivider.position.z = 0;
        verticalDivider.castShadow = true;
        verticalDivider.receiveShadow = true;
        windowGroup.add(verticalDivider);

        windowGroup.position.set(x, y, z);
        windowGroup.rotation.y = Math.PI / 2;
        this.scene.add(windowGroup);
    }
}