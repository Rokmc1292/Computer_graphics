/**
 * 생활관 클래스
 * 군대 생활관의 모든 구조물과 가구를 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { BunkBed } from './BunkBed.js';
import { Locker } from './Locker.js';
import { Chester } from './Chester.js';
import { Window } from './Window.js';
import { TV } from './TV.js';
import { Door } from './Door.js';

export class Barracks {
    constructor(scene) {
        this.scene = scene;
        this.chester = new Chester(scene); // 체스터 추가
    }

    /**
     * 생활관 전체 생성
     */
    async create() {
        this.createFloor();
        this.createWalls();
        this.createCeiling();
        this.createBunkBeds();
        this.createLockers();
        await this.createChesters(); // 비동기로 체스터 생성
        this.createWindows();
        this.createTV();
        this.createDoor();
        this.createCeilingLights();
    }

    /**
     * 바닥 생성
     */
    createFloor() {
        const geometry = new THREE.PlaneGeometry(20, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xEEEEEE });
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    /**
     * 벽 생성
     */
    createWalls() {
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xF8F8F8,
            side: THREE.DoubleSide  
        });
        
        // 앞벽
        const frontWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 8),
            material
        );
        frontWall.position.set(0, 4, 8);
        frontWall.receiveShadow = true;
        this.scene.add(frontWall);
        
        // 뒷벽
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 8),
            material
        );
        backWall.position.set(0, 4, -8);
        backWall.rotation.y = Math.PI;
        backWall.receiveShadow = true;
        this.scene.add(backWall);
        
        // 왼쪽 벽
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(16, 8),
            material
        );
        leftWall.position.set(-10, 4, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);
        
        // 오른쪽 벽
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(16, 8),
            material
        );
        rightWall.position.set(10, 4, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }

    /**
     * 천장 생성
     */
    createCeiling() {
        const geometry = new THREE.PlaneGeometry(20, 16);
        const material = new THREE.MeshLambertMaterial({ color: 0xF0F0F0 });
        const ceiling = new THREE.Mesh(geometry, material);
        ceiling.position.set(0, 8, 0);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);
    }

    /**
     * 2층 침대 배치
     */
    createBunkBeds() {
        const positions = [
            [-7.9, 0, -4],
            [-7.9, 0, 0],
            [-7.9, 0, 4],
            [7.9, 0, -4],
            [7.9, 0, 0],
            [7.9, 0, 4]
        ];

        positions.forEach(pos => {
            const bed = new BunkBed(this.scene);
            bed.create(...pos);
        });
    }

    /**
     * 사물함 배치
     */
    createLockers() {
        const locker = new Locker(this.scene);
        locker.create(0, 0, 7.5);
    }

    /**
     * 체스터(서랍장) 배치
     * 각 침대 옆에 배치
     */
    async createChesters() {
        const positions = [
            // 왼쪽 침대들 옆
            { x: -10.3, y: 0, z: -2, rotationY: Math.PI / 1 },
            { x: -10.3, y: 0, z: 2, rotationY: Math.PI / 1 },
            { x: -10.3, y: 0, z: 6, rotationY: Math.PI / 1 },
            // 오른쪽 침대들 옆
            { x: 10.3, y: 0, z: -2, rotationY: -Math.PI / 0.5 },
            { x: 10.3, y: 0, z: 2, rotationY: -Math.PI / 0.5 },
            { x: 10.3, y: 0, z: 6, rotationY: -Math.PI / 0.5 }
        ];

        await this.chester.createMultiple(positions);
        console.log('체스터 배치 완료!');
    }

    /**
     * 창문 배치
     */
    createWindows() {
        const positions = [
            [4, 5, 7.9],
            [7, 5, 7.9],
            [-4, 5, 7.9],
            [-7, 5, 7.9]
        ];

        positions.forEach(pos => {
            const window = new Window(this.scene);
            window.create(...pos);
        });
    }

    /**
     * TV 생성
     */
    createTV() {
        const tv = new TV(this.scene);
        tv.create();
    }

    /**
     * 출입문 생성
     */
    createDoor() {
        const door = new Door(this.scene);
        door.create();
    }

    /**
     * 천장 조명 생성
     */
    createCeilingLights() {
        const positions = [
            [-6, 7.8, 0],
            [6, 7.8, 0],
            [0, 7.8, -5],
            [0, 7.8, 5]
        ];

        positions.forEach(pos => {
            const geometry = new THREE.CylinderGeometry(0.4, 0.4, 0.08);
            const material = new THREE.MeshLambertMaterial({ 
                color: 0xFFFFFF,
                emissive: 0x333333
            });
            const light = new THREE.Mesh(geometry, material);
            light.position.set(...pos);
            this.scene.add(light);
        });
    }
}