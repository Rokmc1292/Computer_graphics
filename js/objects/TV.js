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
     * TV 생성
     */
    create() {
        const tvGroup = new THREE.Group();
        
        // TV 프레임
        const frameGeometry = new THREE.BoxGeometry(3.3, 2, 0.05);
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        tvGroup.add(frame);
        
        // TV 화면
        const screenGeometry = new THREE.BoxGeometry(1.8, 1, 0.02);
        const screenMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.06;
        tvGroup.add(screen);
        
        tvGroup.position.set(0, 4.5, 7.9);
        this.scene.add(tvGroup);
    }
}