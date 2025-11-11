/**
 * 카메라 컨트롤러 클래스
 * 3인칭 카메라의 회전과 줌을 관리
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class CameraController {
    constructor(camera, domElement, avatar) {
        this.camera = camera;
        this.domElement = domElement;
        this.avatar = avatar;
        
        // 카메라 설정값
        this.distance = 5;          // 아바타와의 거리
        this.height = 2;            // 기본 높이
        this.angle = 0;             // 좌우 회전 각도
        this.pitch = 0.3;           // 상하 각도
        
        // 마우스 컨트롤 변수
        this.isMouseDown = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationSpeed = 0.003;
        
        this.setupEventListeners();
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        this.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        this.domElement.addEventListener('mouseup', () => this.onMouseUp(), false);
        this.domElement.addEventListener('wheel', (e) => this.onMouseWheel(e), false);
        this.domElement.addEventListener('contextmenu', (e) => e.preventDefault(), false);
    }

    /**
     * 마우스 다운 이벤트
     */
    onMouseDown(event) {
        this.isMouseDown = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    /**
     * 마우스 이동 이벤트
     */
    onMouseMove(event) {
        if (!this.isMouseDown) return;
        
        const deltaMove = {
            x: event.clientX - this.previousMousePosition.x,
            y: event.clientY - this.previousMousePosition.y
        };
        
        // 카메라 회전
        this.angle -= deltaMove.x * this.rotationSpeed;
        this.pitch += deltaMove.y * this.rotationSpeed;
        
        // 상하 각도 제한
        this.pitch = Math.max(-0.5, Math.min(1.2, this.pitch));
        
        this.updatePosition();
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    /**
     * 마우스 업 이벤트
     */
    onMouseUp() {
        this.isMouseDown = false;
    }

    /**
     * 마우스 휠 이벤트 (줌)
     */
    onMouseWheel(event) {
        event.preventDefault();
        this.distance += event.deltaY * 0.01;
        this.distance = Math.max(3, Math.min(15, this.distance));
        this.updatePosition();
    }

    /**
     * 카메라 위치 업데이트
     */
    updatePosition() {
        if (!this.avatar) return;

        // 아바타 뒤쪽에 카메라 배치
        const offsetX = Math.sin(this.angle) * this.distance;
        const offsetZ = Math.cos(this.angle) * this.distance;
        const offsetY = this.distance * Math.sin(this.pitch) + this.height;

        this.camera.position.x = this.avatar.position.x + offsetX;
        this.camera.position.y = this.avatar.position.y + offsetY;
        this.camera.position.z = this.avatar.position.z + offsetZ;

        // 카메라를 방 안쪽으로 제한
        this.camera.position.x = Math.max(-9, Math.min(9, this.camera.position.x));
        this.camera.position.z = Math.max(-7, Math.min(7, this.camera.position.z));
        this.camera.position.y = Math.max(1, Math.min(7.5, this.camera.position.y));

        // 카메라가 아바타를 바라보도록
        const lookAtPoint = new THREE.Vector3(
            this.avatar.position.x,
            this.avatar.position.y + 1.5,
            this.avatar.position.z
        );
        this.camera.lookAt(lookAtPoint);
    }

    /**
     * 현재 카메라 각도 반환
     */
    getAngle() {
        return this.angle;
    }
}