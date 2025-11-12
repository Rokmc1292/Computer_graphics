/**
 * 씬 관리 클래스
 * Three.js의 기본 씬, 카메라, 렌더러를 관리
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class SceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.setupEventListeners();
    }

    /**
     * 씬 초기화
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xF5F5F5);
        this.scene.fog = new THREE.Fog(0xF5F5F5, 1, 100);
    }

    /**
     * 카메라 초기화
     */
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 5);
    }

    /**
     * 렌더러 초기화 (PBR 최적화)
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // 고해상도 지원

        // PBR을 위한 물리 기반 렌더링 설정
        this.renderer.physicallyCorrectLights = true;

        // 톤 매핑 (현실적인 밝기 표현)
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        // 출력 색상 공간 설정
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // 향상된 그림자 설정
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // 배경색
        this.renderer.setClearColor(0xF5F5F5);
    }

    /**
     * 윈도우 리사이즈 이벤트 설정
     */
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    /**
     * 윈도우 크기 변경 핸들러
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 렌더링 실행
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}