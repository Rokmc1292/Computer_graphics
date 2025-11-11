/**
 * 조명 관리 클래스
 * 씬의 모든 조명을 생성하고 관리
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class LightManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 모든 조명 설정
     */
    setupLights() {
        this.createAmbientLight();
        this.createDirectionalLight();
        this.createCeilingLights();
    }

    /**
     * 환경광 생성
     */
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
    }

    /**
     * 방향성 조명 생성 (그림자 포함)
     */
    createDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 15, 10);
        directionalLight.castShadow = true;
        
        // 그림자 맵 설정
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
    }

    /**
     * 천장 포인트 조명 생성
     */
    createCeilingLights() {
        const positions = [
            [-6, 7.5, 0],
            [6, 7.5, 0],
            [0, 7.5, -5],
            [0, 7.5, 5]
        ];

        positions.forEach(pos => {
            const light = new THREE.PointLight(0xffffff, 0.4, 30);
            light.position.set(...pos);
            this.scene.add(light);
        });
    }
}