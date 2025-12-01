/**
 * 상호작용 컨트롤러
 * Raycasting을 이용한 객체 클릭 감지
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class InteractionController {
    constructor(camera, canvas, interactableObjects = []) {
        this.camera = camera;
        this.canvas = canvas;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.interactableObjects = interactableObjects; // 클릭 가능한 객체들

        this.onClick = this.onClick.bind(this);
        this.canvas.addEventListener('click', this.onClick);
    }

    /**
     * 클릭 가능한 객체 추가
     * @param {THREE.Object3D} object
     */
    addInteractable(object) {
        if (object && !this.interactableObjects.includes(object)) {
            this.interactableObjects.push(object);
        }
    }

    /**
     * 클릭 이벤트 처리
     * @param {MouseEvent} event
     */
    onClick(event) {
        // 마우스 위치를 NDC(Normalized Device Coordinates)로 변환
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Raycaster 업데이트
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 교차점 검사
        const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            console.log('클릭된 객체:', clickedObject.name || clickedObject.type);

            // 클릭된 객체에 onClick 콜백이 있으면 실행
            if (clickedObject.userData.onClick) {
                clickedObject.userData.onClick(clickedObject);
            }

            // 부모에 onClick 콜백이 있으면 실행
            if (clickedObject.parent && clickedObject.parent.userData.onClick) {
                clickedObject.parent.userData.onClick(clickedObject.parent);
            }
        }
    }

    /**
     * 이벤트 리스너 제거
     */
    dispose() {
        this.canvas.removeEventListener('click', this.onClick);
    }
}
