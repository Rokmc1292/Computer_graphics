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
import { Radiator } from './Radiator.js';
import { TextureLoaderUtil } from '../loaders/TextureLoader.js';

export class Barracks {
    constructor(scene) {
        this.scene = scene;
        this.chester = new Chester(scene); // 체스터 추가
        this.textureLoader = new TextureLoaderUtil();
        this.floorTextures = null;
        this.bedTextures = null;

        // 애니메이션을 위한 객체 참조
        this.ceilingLights = [];
        this.tv = null;
        this.windows = [];
        this.door = null;
        this.radiators = [];
        this.bunkBeds = [];
        this.ceilingFans = [];
        this.dustParticles = null;
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
            console.log('>>> 라디에이터 생성 중...');
            await this.createRadiator(); // 비동기로 라디에이터 생성

            console.log('>>> 천장 조명 생성 중...');
            this.createCeilingLights();
            console.log('>>> 천장 선풍기 생성 중...');
            this.createCeilingFans();
            console.log('>>> 먼지 파티클 생성 중...');
            this.createDustParticles();

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
            this.bunkBeds.push(bed);
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
            { x: -10.3, y: 0, z: -6, rotationY: Math.PI / 1 },
            { x: -10.3, y: 0, z: -2, rotationY: Math.PI / 1 },
            { x: -10.3, y: 0, z: 2, rotationY: Math.PI / 1 },
            { x: -10.3, y: 0, z: 6, rotationY: Math.PI / 1 },
            
            // 오른쪽 침대들 옆
            { x: 10.3, y: 0, z: -6, rotationY: -Math.PI / 0.5 },
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
            [4.5, 5, 7.9],
            [8.5, 5, 7.9],
            [-4.5, 5, 7.9],
            [-8.5, 5, 7.9]
        ];

        // 모든 창문이 로드될 때까지 기다림
        const promises = positions.map(pos => {
            const window = new Window(this.scene);
            this.windows.push(window);
            return window.create(...pos);
        });

        await Promise.all(promises);
        console.log('창문 배치 완료!');
    }

    /**
     * TV 생성
     */
    async createTV() {
        this.tv = new TV(this.scene);
        await this.tv.create();
        console.log('TV 배치 완료!');
    }

    /**
     * 출입문 생성
     */
    async createDoor() {
        this.door = new Door(this.scene);
        await this.door.create();
        console.log('출입문 배치 완료!');
    }

    /**
     * 라디에이터 생성 (2개)
     */
    async createRadiator() {
        const positions = [
            [6, 0, 7.5],   // 앞벽 오른쪽
            [-6, 0, 7.5]   // 앞벽 왼쪽
        ];

        // 모든 라디에이터가 로드될 때까지 기다림
        const promises = positions.map(pos => {
            const radiator = new Radiator(this.scene);
            this.radiators.push(radiator);
            return radiator.create(...pos);
        });

        await Promise.all(promises);
        console.log('라디에이터 배치 완료!');
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

        positions.forEach((pos, index) => {
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

            // 각 조명마다 다른 위상으로 깜빡이도록 설정
            light.userData.flickerOffset = index * Math.PI / 2;

            this.scene.add(light);
            this.ceilingLights.push(light);
        });
    }

    /**
     * 천장 선풍기 생성
     */
    createCeilingFans() {
        const positions = [
            [-3, 7.5, -3],
            [3, 7.5, -3],
            [-3, 7.5, 3],
            [3, 7.5, 3]
        ];

        positions.forEach(pos => {
            const fanGroup = new THREE.Group();

            // 선풍기 모터 (중앙)
            const motorGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
            const motorMaterial = new THREE.MeshStandardMaterial({
                color: 0x404040,
                roughness: 0.4,
                metalness: 0.8
            });
            const motor = new THREE.Mesh(motorGeometry, motorMaterial);
            motor.castShadow = true;
            fanGroup.add(motor);

            // 선풍기 날개 (3개)
            const bladeGeometry = new THREE.BoxGeometry(1.5, 0.02, 0.2);
            const bladeMaterial = new THREE.MeshStandardMaterial({
                color: 0xE0E0E0,
                roughness: 0.3,
                metalness: 0.6
            });

            for (let i = 0; i < 3; i++) {
                const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
                blade.rotation.y = (i * Math.PI * 2) / 3; // 120도씩 회전
                blade.position.x = Math.cos(blade.rotation.y) * 0.4;
                blade.position.z = Math.sin(blade.rotation.y) * 0.4;
                blade.castShadow = true;
                fanGroup.add(blade);
            }

            fanGroup.position.set(...pos);
            this.scene.add(fanGroup);
            this.ceilingFans.push(fanGroup);
        });
    }

    /**
     * 먼지 파티클 시스템 생성
     */
    createDustParticles() {
        const particleCount = 200;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        // 파티클 초기 위치와 속도 설정
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // 방 전체에 랜덤 배치
            positions[i3] = (Math.random() - 0.5) * 18; // X: -9 ~ 9
            positions[i3 + 1] = Math.random() * 7 + 0.5; // Y: 0.5 ~ 7.5
            positions[i3 + 2] = (Math.random() - 0.5) * 14; // Z: -7 ~ 7

            // 느리게 떠다니는 속도
            velocities[i3] = (Math.random() - 0.5) * 0.05;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.03; // Y축은 더 느리게
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        // 파티클 재질
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xCCCCCC,
            size: 0.02,
            opacity: 0.3,
            transparent: true,
            sizeAttenuation: true
        });

        this.dustParticles = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.dustParticles);
    }

    /**
     * 애니메이션 업데이트
     * @param {number} delta - 프레임 간 시간차
     * @param {number} elapsed - 총 경과 시간
     * @param {THREE.Vector3} avatarPosition - 아바타 위치
     */
    update(delta, elapsed, avatarPosition = null) {
        // 1. 천장 조명 깜빡임 애니메이션
        this.ceilingLights.forEach(light => {
            const offset = light.userData.flickerOffset || 0;
            // 형광등 깜빡임 효과 (미세하고 불규칙)
            const fastFlicker = Math.sin(elapsed * 60 + offset) * 0.05;
            const slowPulse = Math.sin(elapsed * 0.5 + offset) * 0.1;
            const random = (Math.random() - 0.5) * 0.02; // 랜덤 노이즈

            light.material.emissiveIntensity = 2.0 + fastFlicker + slowPulse + random;
        });

        // 2. TV 화면 애니메이션
        if (this.tv && this.tv.update) {
            this.tv.update(delta, elapsed);
        }

        // 3. 라디에이터 열기 효과
        this.radiators.forEach(radiator => {
            if (radiator && radiator.update) {
                radiator.update(delta, elapsed);
            }
        });

        // 4. 창문 빛 색상 변화
        this.windows.forEach(window => {
            if (window && window.update) {
                window.update(delta, elapsed);
            }
        });

        // 5. 침대 이불 흔들림 효과
        this.bunkBeds.forEach(bed => {
            if (bed && bed.update) {
                bed.update(delta, elapsed);
            }
        });

        // 6. 문 여닫기 (아바타 위치 필요)
        if (this.door && this.door.update && avatarPosition) {
            this.door.update(delta, elapsed, avatarPosition);
        }

        // 7. 체스터 서랍 열고 닫기
        if (this.chester && this.chester.update) {
            this.chester.update(delta, elapsed);
        }

        // 8. 천장 선풍기 회전
        this.ceilingFans.forEach(fan => {
            fan.rotation.y += delta * 5; // 빠르게 회전
        });

        // 9. 먼지 파티클 이동
        if (this.dustParticles) {
            const positions = this.dustParticles.geometry.attributes.position.array;
            const velocities = this.dustParticles.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                // 속도에 따라 위치 업데이트
                positions[i] += velocities[i] * delta * 10;
                positions[i + 1] += velocities[i + 1] * delta * 10;
                positions[i + 2] += velocities[i + 2] * delta * 10;

                // 경계 체크 및 리셋
                if (positions[i] < -10 || positions[i] > 10) {
                    positions[i] = (Math.random() - 0.5) * 18;
                }
                if (positions[i + 1] < 0 || positions[i + 1] > 8) {
                    positions[i + 1] = Math.random() * 7 + 0.5;
                }
                if (positions[i + 2] < -8 || positions[i + 2] > 8) {
                    positions[i + 2] = (Math.random() - 0.5) * 14;
                }

                // 미세한 속도 변화 (브라운 운동 효과)
                velocities[i] += (Math.random() - 0.5) * 0.001;
                velocities[i + 1] += (Math.random() - 0.5) * 0.001;
                velocities[i + 2] += (Math.random() - 0.5) * 0.001;

                // 속도 제한
                velocities[i] = Math.max(-0.05, Math.min(0.05, velocities[i]));
                velocities[i + 1] = Math.max(-0.03, Math.min(0.03, velocities[i + 1]));
                velocities[i + 2] = Math.max(-0.05, Math.min(0.05, velocities[i + 2]));
            }

            this.dustParticles.geometry.attributes.position.needsUpdate = true;
        }
    }
}