/**
 * 출입문 클래스
 * 생활관 출입문을 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Door {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 출입문 생성 (나무 문 + 금속 손잡이)
     */
    create() {
        const doorGroup = new THREE.Group();

        // 나무 문 텍스처
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 나무 색상 베이스
        ctx.fillStyle = '#bc6c25';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 나무 결 패턴
        for (let y = 0; y < canvas.height; y += 2) {
            const darkness = Math.sin(y * 0.05) * 15;
            const color = 188 + darkness;
            ctx.strokeStyle = `rgba(${color}, ${color * 0.57}, ${color * 0.15}, 0.3)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        const woodTexture = new THREE.CanvasTexture(canvas);
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;

        // 문짝 (나무 재질)
        const doorGeometry = new THREE.BoxGeometry(2, 5, 0.05);
        const doorMaterial = new THREE.MeshStandardMaterial({
            map: woodTexture,
            color: 0xbc6c25,
            roughness: 0.7,
            metalness: 0.0
        });
        const doorframe = new THREE.Mesh(doorGeometry, doorMaterial);
        doorframe.castShadow = true;
        doorframe.receiveShadow = true;
        doorGroup.add(doorframe);

        // 손잡이 (금속 재질)
        const gripGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const gripMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb703,
            roughness: 0.2,
            metalness: 0.9,
            envMapIntensity: 1.0
        });
        const doorgrip = new THREE.Mesh(gripGeometry, gripMaterial);
        doorgrip.position.set(-0.8, 0, 0);
        doorgrip.castShadow = true;
        doorgrip.receiveShadow = true;
        doorGroup.add(doorgrip);

        doorGroup.position.set(0, 2.4, -8);
        this.scene.add(doorGroup);
    }
}