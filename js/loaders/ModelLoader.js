/**
 * 모델 로더 클래스
 * JSON 형식의 3D 모델을 로드하여 씬에 추가
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.ObjectLoader();
    }

    /**
     * JSON 파일에서 모델 로드
     * @param {string} path - JSON 파일 경로
     * @param {Object} position - 위치 {x, y, z}
     * @param {Object} rotation - 회전 {x, y, z} (라디안)
     * @param {Object} scale - 스케일 {x, y, z}
     * @returns {Promise<THREE.Group>} 로드된 모델
     */
    async load(path, position = {x: 0, y: 0, z: 0}, rotation = {x: 0, y: 0, z: 0}, scale = {x: 1, y: 1, z: 1}) {
        try {
            const response = await fetch(path);
            const json = await response.json();
            
            // JSON 데이터를 Three.js 오브젝트로 변환
            const model = this.loader.parse(json);
            
            // 위치 설정
            model.position.set(position.x, position.y, position.z);
            
            // 회전 설정
            model.rotation.set(rotation.x, rotation.y, rotation.z);
            
            // 스케일 설정
            model.scale.set(scale.x, scale.y, scale.z);
            
            // 그림자 설정
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            // 씬에 추가
            this.scene.add(model);
            
            console.log(`모델 로드 완료: ${path}`);
            return model;
            
        } catch (error) {
            console.error(`모델 로드 실패 (${path}):`, error);
            return null;
        }
    }

    /**
     * 여러 모델을 한번에 로드
     * @param {Array} modelConfigs - 모델 설정 배열 [{path, position, rotation, scale}, ...]
     * @returns {Promise<Array>} 로드된 모델 배열
     */
    async loadMultiple(modelConfigs) {
        const promises = modelConfigs.map(config => 
            this.load(config.path, config.position, config.rotation, config.scale)
        );
        return await Promise.all(promises);
    }
}