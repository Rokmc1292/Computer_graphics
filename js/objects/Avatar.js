/**
 * 아바타 클래스
 * 플레이어 캐릭터를 생성하고 관리
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class Avatar {
    constructor(scene) {
        this.scene = scene;
        this.group = null;
    }

    /**
     * 아바타 생성
     */
    create() {
        this.group = new THREE.Group();
        this.group.position.set(0, 0, 0);

        this.createHead();
        this.createTorso();
        this.createArms();
        this.createLegs();

        this.scene.add(this.group);
    }

    /**
     * 머리 생성
     */
    createHead() {
        const geometry = new THREE.SphereGeometry(0.25, 16, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xFFDBAC });
        const head = new THREE.Mesh(geometry, material);
        head.position.y = 1.5;
        head.castShadow = true;
        this.group.add(head);
    }

    /**
     * 몸통 생성
     */
    createTorso() {
        const geometry = new THREE.CylinderGeometry(0.2, 0.25, 0.6, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0x4A5D23 });
        const torso = new THREE.Mesh(geometry, material);
        torso.position.y = 1.0;
        torso.castShadow = true;
        this.group.add(torso);
    }

    /**
     * 팔 생성
     */
    createArms() {
        const geometry = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x4A5D23 });

        // 왼팔
        const leftArm = new THREE.Mesh(geometry, material);
        leftArm.position.set(-0.3, 1.0, 0);
        leftArm.castShadow = true;
        this.group.add(leftArm);

        // 오른팔
        const rightArm = new THREE.Mesh(geometry, material);
        rightArm.position.set(0.3, 1.0, 0);
        rightArm.castShadow = true;
        this.group.add(rightArm);
    }

    /**
     * 다리 생성
     */
    createLegs() {
        const geometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
        const material = new THREE.MeshLambertMaterial({ color: 0x4A5D23 });

        // 왼다리
        const leftLeg = new THREE.Mesh(geometry, material);
        leftLeg.position.set(-0.1, 0.4, 0);
        leftLeg.castShadow = true;
        this.group.add(leftLeg);

        // 오른다리
        const rightLeg = new THREE.Mesh(geometry, material);
        rightLeg.position.set(0.1, 0.4, 0);
        rightLeg.castShadow = true;
        this.group.add(rightLeg);
    }

    /**
     * 아바타 위치 반환
     */
    get position() {
        return this.group.position;
    }

    /**
     * 아바타 회전 설정/반환
     */
    get rotation() {
        return this.group.rotation;
    }

    set rotation(value) {
        this.group.rotation.copy(value);
    }
}