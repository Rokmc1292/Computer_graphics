/**
 * 출입문 클래스
 * 생활관 출입문을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Door {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 출입문 생성
     */
    create() {
        const doorGroup = new THREE.Group();
        
        // 문짝
        const doorGeometry = new THREE.BoxGeometry(2, 5, 0.05);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xbc6c25 });
        const doorframe = new THREE.Mesh(doorGeometry, doorMaterial);
        doorGroup.add(doorframe);
        
        // 손잡이
        const gripGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const gripMaterial = new THREE.MeshLambertMaterial({ color: 0xffb703 });
        const doorgrip = new THREE.Mesh(gripGeometry, gripMaterial);
        doorgrip.position.set(-0.8, 0, 0);
        doorGroup.add(doorgrip);
        
        doorGroup.position.set(0, 2.4, -8);
        this.scene.add(doorGroup);
    }
}