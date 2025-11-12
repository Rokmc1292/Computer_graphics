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
     * 바닥 생성 (PBR 재질 + 텍스처)
     */
    createFloor() {
        const geometry = new THREE.PlaneGeometry(20, 16);

        // 절차적 타일 텍스처 생성
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 타일 패턴
        const tileSize = 64;
        for (let y = 0; y < canvas.height; y += tileSize) {
            for (let x = 0; x < canvas.width; x += tileSize) {
                // 밝은 회색 타일
                ctx.fillStyle = '#E8E8E8';
                ctx.fillRect(x, y, tileSize, tileSize);

                // 어두운 그라우트 선
                ctx.strokeStyle = '#CCCCCC';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, tileSize, tileSize);

                // 미세한 노이즈로 사실감 추가
                for (let i = 0; i < 20; i++) {
                    const nx = x + Math.random() * tileSize;
                    const ny = y + Math.random() * tileSize;
                    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`;
                    ctx.fillRect(nx, ny, 1, 1);
                }
            }
        }

        const floorTexture = new THREE.CanvasTexture(canvas);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 3);

        // PBR 재질 적용
        const material = new THREE.MeshStandardMaterial({
            map: floorTexture,
            roughness: 0.8,  // 약간 거친 표면
            metalness: 0.0,  // 비금속
            envMapIntensity: 0.3
        });

        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    /**
     * 벽 생성 (PBR 재질 + 벽지 텍스처)
     */
    createWalls() {
        // 벽지 텍스처 생성
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // 베이스 색상
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 미세한 텍스처 패턴
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const gray = 240 + Math.random() * 10;
            ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
            ctx.fillRect(x, y, 1, 1);
        }

        // 수직 라인 패턴 (벽지 효과)
        ctx.strokeStyle = 'rgba(0,0,0,0.015)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        const wallTexture = new THREE.CanvasTexture(canvas);
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.repeat.set(3, 2);

        const material = new THREE.MeshStandardMaterial({
            map: wallTexture,
            roughness: 0.9,   // 매우 거친 표면 (매트한 벽지)
            metalness: 0.0,   // 비금속
            side: THREE.DoubleSide
        });

        // 앞벽
        const frontWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 8),
            material
        );
        frontWall.position.set(0, 4, 8);
        frontWall.receiveShadow = true;
        frontWall.castShadow = true;
        this.scene.add(frontWall);

        // 뒷벽
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 8),
            material
        );
        backWall.position.set(0, 4, -8);
        backWall.rotation.y = Math.PI;
        backWall.receiveShadow = true;
        backWall.castShadow = true;
        this.scene.add(backWall);

        // 왼쪽 벽
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(16, 8),
            material
        );
        leftWall.position.set(-10, 4, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        leftWall.castShadow = true;
        this.scene.add(leftWall);

        // 오른쪽 벽
        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(16, 8),
            material
        );
        rightWall.position.set(10, 4, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        rightWall.castShadow = true;
        this.scene.add(rightWall);
    }

    /**
     * 천장 생성 (PBR 재질)
     */
    createCeiling() {
        const geometry = new THREE.PlaneGeometry(20, 16);

        // 천장 텍스처 (페인트 질감)
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#EEEEEE';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 미세한 페인트 질감
        for (let i = 0; i < 800; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const gray = 235 + Math.random() * 15;
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.3)`;
            ctx.fillRect(x, y, 2, 2);
        }

        const ceilingTexture = new THREE.CanvasTexture(canvas);
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(2, 2);

        const material = new THREE.MeshStandardMaterial({
            map: ceilingTexture,
            roughness: 0.85,
            metalness: 0.0
        });

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
     * 천장 조명 생성 (발광 효과)
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
            const material = new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                emissive: 0xFFEEDD,      // 따뜻한 빛
                emissiveIntensity: 2.0,   // 강한 발광
                roughness: 0.2,
                metalness: 0.8            // 금속성 조명 커버
            });
            const light = new THREE.Mesh(geometry, material);
            light.position.set(...pos);
            light.castShadow = false;  // 조명 자체는 그림자를 만들지 않음
            this.scene.add(light);
        });
    }
}