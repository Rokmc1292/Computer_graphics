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
import { TextureLoaderUtil } from '../loaders/TextureLoader.js';

export class Barracks {
    constructor(scene) {
        this.scene = scene;
        this.chester = new Chester(scene); // 체스터 추가
        this.textureLoader = new TextureLoaderUtil();
        this.floorTextures = null;
        this.bedTextures = null;
    }

    /**
     * 생활관 전체 생성
     */
    async create() {
        try {
            console.log('>>> Barracks.create() 시작');

            // 텍스처 먼저 로드
            console.log('>>> 텍스처 로드 시작...');
            await this.loadTextures();
            console.log('>>> 텍스처 로드 완료');

            console.log('>>> 바닥 생성 중...');
            this.createFloor();
            console.log('>>> 벽 생성 중...');
            this.createWalls();
            console.log('>>> 천장 생성 중...');
            this.createCeiling();

            console.log('>>> 침대 생성 중...');
            await this.createBunkBeds(); // 비동기로 변경 (침대 텍스처 전달)
            console.log('>>> 사물함 생성 중...');
            this.createLockers();

            console.log('>>> 체스터 생성 중...');
            await this.createChesters(); // 비동기로 체스터 생성
            console.log('>>> 창문 생성 중...');
            await this.createWindows(); // 비동기로 창문 생성
            console.log('>>> TV 생성 중...');
            await this.createTV(); // 비동기로 TV 생성
            console.log('>>> 문 생성 중...');
            await this.createDoor(); // 비동기로 문 생성

            console.log('>>> 천장 조명 생성 중...');
            this.createCeilingLights();

            console.log('>>> Barracks.create() 완료');
        } catch (error) {
            console.error('❌ Barracks 생성 중 오류:', error);
            throw error; // 상위로 에러 전파
        }
    }

    /**
     * 모든 텍스처 로드 (에러에 안전한 버전)
     */
    async loadTextures() {
        console.log('=== 텍스처 로딩 시작 ===');

        try {
            // 바닥 텍스처 로드
            try {
                this.floorTextures = await this.textureLoader.loadFloorTextures();
                if (this.floorTextures) {
                    console.log('✓ 바닥 텍스처 로딩 성공');
                } else {
                    console.warn('⚠ 바닥 텍스처 로딩 실패 - 기본 재질 사용');
                }
            } catch (error) {
                console.error('✗ 바닥 텍스처 로딩 중 오류:', error);
                this.floorTextures = null;
            }

            // 침대 텍스처 로드
            try {
                this.bedTextures = await this.textureLoader.loadBedTextures();
                if (this.bedTextures) {
                    console.log('✓ 침대 텍스처 로딩 성공');
                } else {
                    console.warn('⚠ 침대 텍스처 로딩 실패 - 기본 재질 사용');
                }
            } catch (error) {
                console.error('✗ 침대 텍스처 로딩 중 오류:', error);
                this.bedTextures = null;
            }

            console.log('=== 텍스처 로딩 완료 ===');
        } catch (error) {
            console.error('텍스처 로딩 중 예상치 못한 오류:', error);
        }
    }

    /**
     * 바닥 생성 (PBR 재질 + 대리석 텍스처)
     */
    createFloor() {
        const geometry = new THREE.PlaneGeometry(20, 16);
        let material;

        // 로드된 대리석 텍스처 사용
        if (this.floorTextures && this.floorTextures.diffuse) {
            // 텍스처 반복 설정
            if (this.floorTextures.diffuse) {
                this.floorTextures.diffuse.repeat.set(4, 3);
            }
            if (this.floorTextures.normal) {
                this.floorTextures.normal.repeat.set(4, 3);
            }
            if (this.floorTextures.roughness) {
                this.floorTextures.roughness.repeat.set(4, 3);
            }

            // PBR 재질 적용
            material = new THREE.MeshStandardMaterial({
                map: this.floorTextures.diffuse,
                normalMap: this.floorTextures.normal,
                roughnessMap: this.floorTextures.roughness,
                roughness: 0.6,  // 대리석의 약간 매끄러운 표면
                metalness: 0.1,  // 대리석의 미세한 광택
                envMapIntensity: 0.5
            });

            console.log('대리석 바닥 텍스처 적용 완료');
        } else {
            // 폴백: 기본 재질
            material = new THREE.MeshStandardMaterial({
                color: 0xE8E8E8,
                roughness: 0.8,
                metalness: 0.0
            });
            console.log('바닥에 기본 재질 적용 (텍스처 없음)');
        }

        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    /**
     * 벽 생성 (기본 재질)
     */
    createWalls() {
        const material = new THREE.MeshStandardMaterial({
            color: 0xF5F5F5,
            roughness: 0.9,
            metalness: 0.0,
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
     * 2층 침대 배치 (침대 텍스처 전달)
     */
    async createBunkBeds() {
        const positions = [
            [-7.9, 0, -4],
            [-7.9, 0, 0],
            [-7.9, 0, 4],
            [7.9, 0, -4],
            [7.9, 0, 0],
            [7.9, 0, 4]
        ];

        positions.forEach(pos => {
            const bed = new BunkBed(this.scene, this.bedTextures);
            bed.create(...pos);
        });

        console.log('침대 텍스처 적용 완료');
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
    async createWindows() {
        const positions = [
            [4, 5, 7.9],
            [7, 5, 7.9],
            [-4, 5, 7.9],
            [-7, 5, 7.9]
        ];

        // 모든 창문이 로드될 때까지 기다림
        const promises = positions.map(pos => {
            const window = new Window(this.scene);
            return window.create(...pos);
        });

        await Promise.all(promises);
        console.log('창문 배치 완료!');
    }

    /**
     * TV 생성
     */
    async createTV() {
        const tv = new TV(this.scene);
        await tv.create();
        console.log('TV 배치 완료!');
    }

    /**
     * 출입문 생성
     */
    async createDoor() {
        const door = new Door(this.scene);
        await door.create();
        console.log('출입문 배치 완료!');
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