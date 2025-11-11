/**
 * 2층 침대 클래스
 * 군대 생활관의 2층 침대를 생성
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class BunkBed {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * 2층 침대 생성
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     */
    create(x, y, z) {
        const bedGroup = new THREE.Group();
        
        // 프레임 재질
        const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        
        // 기둥 생성
        this.createPosts(bedGroup, frameMaterial);
        
        // 침대 프레임 생성
        this.createFrames(bedGroup, frameMaterial);
        
        // 매트리스 생성
        this.createMattresses(bedGroup);
        
        // 이불 생성
        this.createBedding(bedGroup, x);
        
        // 베개 생성
        this.createPillows(bedGroup, x);
        
        // 지지대 생성
        this.createSupports(bedGroup, frameMaterial);
        
        bedGroup.position.set(x, y, z);
        this.scene.add(bedGroup);
    }

    /**
     * 침대 기둥 생성
     */
    createPosts(group, material) {
        const geometry = new THREE.BoxGeometry(0.08, 2.5, 0.08);
        const positions = [
            [-1, 1, -0.9],
            [1, 1, -0.9],
            [-1, 1, 0.9],
            [1, 1, 0.9]
        ];

        positions.forEach(pos => {
            const post = new THREE.Mesh(geometry, material);
            post.position.set(...pos);
            post.castShadow = true;
            group.add(post);
        });
    }

    /**
     * 침대 프레임 생성
     */
    createFrames(group, material) {
        // 아래층 프레임
        const lowerFrame = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.2, 1.8),
            material
        );
        lowerFrame.position.set(0, 0.6, 0);
        group.add(lowerFrame);

        // 위층 프레임
        const upperFrame = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.05, 1.8),
            material
        );
        upperFrame.position.set(0, 2.2, 0);
        group.add(upperFrame);
    }

    /**
     * 매트리스 생성
     */
    createMattresses(group) {
        const material = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
        
        // 아래층 매트리스
        const lowerMattress = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.1, 1.7),
            material
        );
        lowerMattress.position.set(0, 0.7, 0);
        lowerMattress.castShadow = true;
        group.add(lowerMattress);

        // 위층 매트리스
        const upperMattress = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.1, 1.7),
            material
        );
        upperMattress.position.set(0, 2.3, 0);
        upperMattress.castShadow = true;
        group.add(upperMattress);
    }

    /**
     * 이불 생성
     */
    createBedding(group, x) {
        const material = new THREE.MeshLambertMaterial({ color: 0x1C6EA4 });
        const offsetX = x >= 0 ? -0.5 : 0.5;

        // 아래층 이불
        const lowerBedding = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.1, 1.7),
            material
        );
        lowerBedding.position.set(offsetX, 0.8, 0);
        group.add(lowerBedding);

        // 위층 이불
        const upperBedding = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.1, 1.7),
            material
        );
        upperBedding.position.set(offsetX, 2.4, 0);
        group.add(upperBedding);
    }

    /**
     * 베개 생성
     */
    createPillows(group, x) {
        const material = new THREE.MeshLambertMaterial({ color: 0x1C6EA4 });
        const offsetX = x >= 0 ? 1.5 : -1.5;

        // 아래층 베개
        const lowerPillow = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.8),
            material
        );
        lowerPillow.position.set(offsetX, 0.8, 0);
        group.add(lowerPillow);

        // 위층 베개
        const upperPillow = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.8),
            material
        );
        upperPillow.position.set(offsetX, 2.4, 0);
        group.add(upperPillow);
    }

    /**
     * 침대 지지대 생성
     */
    createSupports(group, material) {
        const geometry = new THREE.BoxGeometry(2, 0.03, 0.03);

        // 아래층 지지대
        const lowerSupport1 = new THREE.Mesh(geometry, material);
        lowerSupport1.position.set(0, 0.3, -0.9);
        group.add(lowerSupport1);

        const lowerSupport2 = new THREE.Mesh(geometry, material);
        lowerSupport2.position.set(0, 0.3, 0.9);
        group.add(lowerSupport2);

        // 위층 지지대
        const upperSupport1 = new THREE.Mesh(geometry, material);
        upperSupport1.position.set(0, 1.9, -0.9);
        group.add(upperSupport1);

        const upperSupport2 = new THREE.Mesh(geometry, material);
        upperSupport2.position.set(0, 1.9, 0.9);
        group.add(upperSupport2);
    }
}