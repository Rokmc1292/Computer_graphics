/**
 * 조명 스위치 클래스
 * 천장 조명을 켜고 끌 수 있는 스위치
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class LightSwitch {
    constructor(scene) {
        this.scene = scene;
        this.switchModel = null;
        this.isLightOn = true; // 초기 상태: 조명 켜짐
        this.buttonMaterial = null;
    }

    /**
     * 스위치 생성
     * @param {number} x - X 위치
     * @param {number} y - Y 위치
     * @param {number} z - Z 위치
     */
    create(x, y, z) {
        // 스위치 그룹
        this.switchModel = new THREE.Group();

        // 스위치 배경판 (벽에 붙는 부분)
        const plateGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05);
        const plateMaterial = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.3,
            metalness: 0.1
        });
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        this.switchModel.add(plate);

        // 스위치 버튼 (클릭 가능한 부분)
        const buttonGeometry = new THREE.BoxGeometry(0.15, 0.2, 0.08);
        this.buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0x00FF00, // 초록색 (켜짐 상태)
            emissive: 0x00FF00,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.5
        });
        const button = new THREE.Mesh(buttonGeometry, this.buttonMaterial);
        button.position.z = 0.06; // 배경판보다 약간 앞으로
        button.name = 'lightSwitchButton'; // raycasting을 위한 이름
        this.switchModel.add(button);

        // 위치 설정
        this.switchModel.position.set(x, y, z);

        // 그림자 설정
        this.switchModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.scene.add(this.switchModel);
        console.log('✓ 조명 스위치 생성 완료');
    }

    /**
     * 스위치 토글 (조명 켜기/끄기)
     * @returns {boolean} 현재 조명 상태
     */
    toggle() {
        this.isLightOn = !this.isLightOn;

        // 버튼 색상 변경
        if (this.isLightOn) {
            // 켜짐: 초록색
            this.buttonMaterial.color.setHex(0x00FF00);
            this.buttonMaterial.emissive.setHex(0x00FF00);
            this.buttonMaterial.emissiveIntensity = 0.5;
        } else {
            // 꺼짐: 빨간색
            this.buttonMaterial.color.setHex(0xFF0000);
            this.buttonMaterial.emissive.setHex(0xFF0000);
            this.buttonMaterial.emissiveIntensity = 0.3;
        }

        console.log(`조명 스위치: ${this.isLightOn ? 'ON' : 'OFF'}`);
        return this.isLightOn;
    }

    /**
     * 현재 조명 상태 반환
     * @returns {boolean}
     */
    getLightState() {
        return this.isLightOn;
    }

    /**
     * 스위치 버튼 메쉬 반환 (raycasting용)
     * @returns {THREE.Mesh}
     */
    getButton() {
        return this.switchModel.children.find(child => child.name === 'lightSwitchButton');
    }
}
