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
     * 창문 생성
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        const windowGroup = new THREE.Group();
        
        // 유리창
        const glassGeometry = new THREE.BoxGeometry(0.02, 1.8, 1.3);
        const glassMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x87CEFA,
            transparent: true,
            opacity: 0.8
        });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        windowGroup.add(glass);
        
        // 창틀 재질
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xA0A0A0 });
        
        // 가로 창틀
        const horizontalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.04, 1.3),
            frameMaterial
        );
        horizontalDivider.position.y = 0;
        windowGroup.add(horizontalDivider);
        
        // 세로 창틀
        const verticalDivider = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 1.8, 0.04),
            frameMaterial
        );
        verticalDivider.position.z = 0;
        windowGroup.add(verticalDivider);
        
        windowGroup.position.set(x, y, z);
        windowGroup.rotation.y = Math.PI / 2;
        this.scene.add(windowGroup);
    }
}