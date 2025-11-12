/**
 * 아바타 컨트롤러 클래스
 * 키보드 입력으로 아바타를 이동시키고 회전 관리
 */
export class AvatarController {
    constructor(avatar, cameraController) {
        this.avatar = avatar;
        this.cameraController = cameraController;
        
        // 이동 속도
        this.speed = 0.3;
        
        // 키 입력 상태
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        this.setupEventListeners();
    }

    /**
     * 키보드 이벤트 리스너 설정
     */
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    /**
     * 키 다운 이벤트
     */
    onKeyDown(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = true;
        }
    }

    /**
     * 키 업 이벤트
     */
    onKeyUp(event) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = false;
        }
    }

    /**
     * 아바타 위치 업데이트 (매 프레임마다 호출)
     */
    update() {
        if (!this.avatar.group) return;
        
        let moveX = 0;
        let moveZ = 0;

        // WASD 입력 처리
        if (this.keys.w) moveZ -= 1;
        if (this.keys.s) moveZ += 1;
        if (this.keys.a) moveX -= 1;
        if (this.keys.d) moveX += 1;

        // 이동이 있을 때만 처리
        if (moveX !== 0 || moveZ !== 0) {
            // 카메라 각도를 고려한 이동 방향 계산
            const cameraAngle = this.cameraController.getAngle();
            const moveAngle = Math.atan2(moveX, moveZ);
            const finalAngle = cameraAngle + moveAngle;

            // 아바타 회전
            this.avatar.group.rotation.y = finalAngle;

            // 아바타 이동
            this.avatar.position.x += Math.sin(finalAngle) * this.speed;
            this.avatar.position.z += Math.cos(finalAngle) * this.speed;

            // 방 경계 제한
            this.avatar.position.x = Math.max(-9, Math.min(9, this.avatar.position.x));
            this.avatar.position.z = Math.max(-7, Math.min(7, this.avatar.position.z));
        }

        // 카메라 위치 업데이트
        this.cameraController.updatePosition();
    }
}