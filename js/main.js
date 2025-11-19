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
        this.clock = new THREE.Clock(); // 애니메이션을 위한 Clock 추가
    }

    /**
     * 애플리케이션 초기화
     */
    async init() {
        try {
            console.log('=== 애플리케이션 초기화 시작 ===');

            // 씬 매니저 생성
            console.log('1. 씬 매니저 생성 중...');
            this.sceneManager = new SceneManager();
            console.log('✓ 씬 매니저 생성 완료');

            // 조명 설정
            console.log('2. 조명 설정 중...');
            this.lightManager = new LightManager(this.sceneManager.scene);
            this.lightManager.setupLights();
            console.log('✓ 조명 설정 완료');

            // 생활관 건물 생성 (비동기 - 모든 모델 로딩 완료까지 대기)
            console.log('3. 생활관 건물 생성 중...');
            this.barracks = new Barracks(this.sceneManager.scene);
            await this.barracks.create();
            console.log('✓ 생활관 건물 생성 완료');

            // 아바타 생성
            console.log('4. 아바타 생성 중...');
            this.avatar = new Avatar(this.sceneManager.scene);
            this.avatar.create();
            console.log('✓ 아바타 생성 완료');

            // 카메라 컨트롤러 생성
            console.log('5. 카메라 컨트롤러 생성 중...');
            this.cameraController = new CameraController(
                this.sceneManager.camera,
                this.sceneManager.renderer.domElement,
                this.avatar
            );
            console.log('✓ 카메라 컨트롤러 생성 완료');

            // 아바타 컨트롤러 생성
            console.log('6. 아바타 컨트롤러 생성 중...');
            this.avatarController = new AvatarController(
                this.avatar,
                this.cameraController
            );
            console.log('✓ 아바타 컨트롤러 생성 완료');

            // 애니메이션 시작
            console.log('7. 애니메이션 시작...');
            this.animate();
            console.log('✓ 애니메이션 시작 완료');

            // 모든 모델이 로드되었으므로 로딩 화면 숨기기
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
                console.log('✓ 로딩 화면 숨김 완료');
            }

            console.log('=== 애플리케이션 초기화 완료 ===');
            console.log('✅ 3D 군대 생활관과 아바타가 로드되었습니다!');

        } catch (error) {
            console.error('❌ 애플리케이션 초기화 중 오류 발생:', error);
            console.error('오류 스택:', error.stack);

            // 에러가 발생해도 로딩 화면을 숨기고 에러 메시지 표시
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = `
                    <div style="color: white; text-align: center; padding: 20px;">
                        <h2>⚠️ 로딩 실패</h2>
                        <p style="margin-top: 10px;">${error.message}</p>
                        <p style="margin-top: 10px; font-size: 14px;">브라우저 콘솔(F12)을 확인하세요.</p>
                    </div>
                `;
            }
        }
    }

    /**
     * 애니메이션 루프
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        // Delta time 계산
        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // 아바타 위치 업데이트
        this.avatarController.update();

        // 생활반 애니메이션 업데이트 (아바타 위치 전달)
        if (this.barracks && this.barracks.update && this.avatar) {
            this.barracks.update(delta, elapsed, this.avatar.position);
        }

        // 렌더링
        this.sceneManager.render();
    }
}

// 애플리케이션 시작
const app = new App();
app.init();
