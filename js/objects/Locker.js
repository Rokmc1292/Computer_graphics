/**
 * 사물함 클래스
 * 개인 사물함을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Locker {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 사물함 생성 (금속 재질)
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        const lockerGroup = new THREE.Group();

        // 사물함 본체 (금속 재질)
        const lockerGeometry = new THREE.BoxGeometry(5, 2.5, 0.6);
        const lockerMaterial = new THREE.MeshStandardMaterial({
            color: 0xC8C8C8,
            roughness: 0.5,
            metalness: 0.7
        });
        const locker = new THREE.Mesh(lockerGeometry, lockerMaterial);
        locker.position.set(0, 1.25, 0);
        locker.castShadow = true;
        locker.receiveShadow = true;
        lockerGroup.add(locker);

        // 사물함 문 (약간 어두운 금속)
        const doorGeometry = new THREE.BoxGeometry(1.4, 2.4, 0.02);
        const doorMaterial = new THREE.MeshStandardMaterial({
            color: 0xA8A8A8,
            roughness: 0.4,
            metalness: 0.8
        });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 0.31);
        door.castShadow = true;
        door.receiveShadow = true;
        lockerGroup.add(door);

        // 손잡이 (어두운 금속)
        const handleGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.03);
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x303030,
            roughness: 0.3,
            metalness: 0.9
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.5, 1.25, 0.33);
        handle.castShadow = true;
        handle.receiveShadow = true;
        lockerGroup.add(handle);

        lockerGroup.position.set(x, y, z);
        this.scene.add(lockerGroup);
    }
}