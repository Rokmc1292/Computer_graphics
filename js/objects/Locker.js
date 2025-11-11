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
     * 사물함 생성
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        const lockerGroup = new THREE.Group();
        
        // 사물함 본체
        const lockerGeometry = new THREE.BoxGeometry(5, 2.5, 0.6);
        const lockerMaterial = new THREE.MeshLambertMaterial({ color: 0xD3D3D3 });
        const locker =new THREE.Mesh(lockerGeometry, lockerMaterial);
        locker.position.set(0, 1.25, 0);
        locker.castShadow = true;
        locker.receiveShadow = true;
        lockerGroup.add(locker);
        
        // 사물함 문
        const doorGeometry = new THREE.BoxGeometry(1.4, 2.4, 0.02);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0xB0B0B0 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 0.31);
        lockerGroup.add(door);
        
        // 손잡이
        const handleGeometry = new THREE.BoxGeometry(0.08, 0.03, 0.03);
        const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x404040 });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.set(0.5, 1.25, 0.33);
        lockerGroup.add(handle);
        
        lockerGroup.position.set(x, y, z);
        this.scene.add(lockerGroup);
    }
}