/**
 * 체스터(서랍장) 클래스
 * JSON 모델 파일을 로드하여 생성
 */
import { ModelLoader } from '../loaders/ModelLoader.js';

export class Chester {
    constructor(scene) {
        this.scene = scene;
        this.modelLoader = new ModelLoader(scene);
        this.models = [];
    }

    /**
     * 체스터 생성
     * @param {number} x - X 좌표
     * @param {number} y - Y 좌표
     * @param {number} z - Z 좌표
     * @param {number} rotationY - Y축 회전 (라디안)
     */
    async create(x = 0, y = 0, z = 0, rotationY = 0) {
        const model = await this.modelLoader.load(
            'models/group.json',
            { x, y, z },
            { x: 0, y: rotationY, z: 0 },
            { x: 1, y: 1, z: 1 }
        );
        
        if (model) {
            this.models.push(model);
        }
        
        return model;
    }

    /**
     * 여러 개의 체스터 생성
     * @param {Array} positions - 위치 배열 [{x, y, z, rotationY}, ...]
     */
    async createMultiple(positions) {
        const configs = positions.map(pos => ({
            path: 'models/group.json',
            position: { x: pos.x, y: pos.y, z: pos.z },
            rotation: { x: 0, y: pos.rotationY || 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        }));

        const models = await this.modelLoader.loadMultiple(configs);
        this.models.push(...models.filter(m => m !== null));
        return models;
    }

    /**
     * 모든 체스터 제거
     */
    removeAll() {
        this.models.forEach(model => {
            this.scene.remove(model);
        });
        this.models = [];
    }
}