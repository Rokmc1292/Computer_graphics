/**
 * 메인 진입점
 * Three.js 씬을 초기화하고 모든 매니저들을 통합 관리
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { SceneManager } from './scene/SceneManager.js';
import { LightManager } from './scene/LightManager.js';
import { Avatar } from './objects/Avatar.js';
import { Barracks } from './objects/Barracks.js';
import { CameraController } from './controls/CameraController.js';
import { AvatarController } from './controls/AvatarController.js';

class App {
    constructor() {
        this.sceneManager = null;
        this.lightManager = null;
        this.avatar = null;
        this.barracks = null;
        this.cameraController = null;
        this.avatarController = null;
    }

    /**
     * 애플리케이션 초기화
     */
    async init() {
        // 씬 매니저 생성
        this.sceneManager = new SceneManager();
        
        // 조명 설정
        this.lightManager = new LightManager(this.sceneManager.scene);
        this.lightManager.setupLights();
        
        // 생활관 건물 생성 (비동기)
        this.barracks = new Barracks(this.sceneManager.scene);
        await this.barracks.create();
        
        // 아바타 생성
        this.avatar = new Avatar(this.sceneManager.scene);
        this.avatar.create();
        
        // 카메라 컨트롤러 생성
        this.cameraController = new CameraController(
            this.sceneManager.camera,
            this.sceneManager.renderer.domElement,
            this.avatar
        );
        
        // 아바타 컨트롤러 생성
        this.avatarController = new AvatarController(
            this.avatar,
            this.cameraController
        );
        
        // 애니메이션 시작
        this.animate();
        
        // 로딩 화면 숨기기
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
            }
        }, 2000); // 체스터 로딩 시간을 고려하여 2초로 변경
        
        console.log('3D 군대 생활관과 아바타가 로드되었습니다!');
    }

    /**
     * 애니메이션 루프
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 아바타 위치 업데이트
        this.avatarController.update();
        
        // 렌더링
        this.sceneManager.render();
    }
}

// 애플리케이션 시작
const app = new App();
app.init();
