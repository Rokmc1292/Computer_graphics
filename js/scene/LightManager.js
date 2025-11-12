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
     * 모든 조명 설정 (향상된 현실적 조명)
     */
    setupLights() {
        this.createAmbientLight();
        this.createDirectionalLight();
        this.createCeilingLights();
        this.createWindowLight();
    }

    /**
     * 환경광 생성 (부드러운 간접광)
     */
    createAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xE8F4FF, 0.4);  // 약간 푸른 간접광
        this.scene.add(ambientLight);
    }

    /**
     * 방향성 조명 생성 (창문에서 들어오는 태양광)
     */
    createDirectionalLight() {
        // 메인 태양광
        const directionalLight = new THREE.DirectionalLight(0xFFF8E7, 1.2);  // 따뜻한 햇빛
        directionalLight.position.set(5, 15, 10);
        directionalLight.castShadow = true;

        // 향상된 그림자 설정
        directionalLight.shadow.mapSize.width = 4096;   // 높은 해상도
        directionalLight.shadow.mapSize.height = 4096;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.bias = -0.0001;         // 그림자 아티팩트 제거
        directionalLight.shadow.normalBias = 0.02;

        this.scene.add(directionalLight);
    }

    /**
     * 천장 포인트 조명 생성 (실내 조명)
     */
    createCeilingLights() {
        const positions = [
            [-6, 7.5, 0],
            [6, 7.5, 0],
            [0, 7.5, -5],
            [0, 7.5, 5]
        ];

        positions.forEach((pos, index) => {
            // 따뜻한 실내 조명
            const light = new THREE.PointLight(0xFFE4B5, 1.2, 35);  // 따뜻한 색온도
            light.position.set(...pos);
            light.castShadow = true;

            // 그림자 설정
            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 35;
            light.shadow.bias = -0.001;

            // 감쇠 설정 (자연스러운 빛의 약화)
            light.decay = 2;

            this.scene.add(light);
        });
    }

    /**
     * 창문 빛 효과 (햇빛이 실내로 들어오는 효과)
     */
    createWindowLight() {
        // 창문에서 들어오는 강렬한 햇빛
        const windowPositions = [
            [4, 5, 7.9],
            [7, 5, 7.9],
            [-4, 5, 7.9],
            [-7, 5, 7.9]
        ];

        windowPositions.forEach(pos => {
            // 메인 스포트라이트 (햇빛 광선 효과)
            const spotlight = new THREE.SpotLight(0xFFF8E7, 2.5, 25, Math.PI / 5, 0.3, 1.5);
            spotlight.position.set(pos[0], pos[1], pos[2] + 0.5);
            spotlight.target.position.set(pos[0], 0, pos[2] - 8);
            spotlight.castShadow = true;

            // 그림자 설정
            spotlight.shadow.mapSize.width = 512;
            spotlight.shadow.mapSize.height = 512;
            spotlight.shadow.camera.near = 0.5;
            spotlight.shadow.camera.far = 25;

            this.scene.add(spotlight);
            this.scene.add(spotlight.target);

            // 추가 포인트 라이트 (창문 주변 밝기)
            const windowGlow = new THREE.PointLight(0xFFFFE0, 1.5, 10);
            windowGlow.position.set(pos[0], pos[1], pos[2] - 1);
            this.scene.add(windowGlow);
        });

        // 창문을 통한 전체적인 간접광 추가
        const windowAmbient = new THREE.DirectionalLight(0xFFFFE0, 0.6);
        windowAmbient.position.set(0, 5, 10);
        this.scene.add(windowAmbient);
    }
}