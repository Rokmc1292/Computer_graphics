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
        this.drawerStates = []; // 각 체스터의 서랍 상태
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

        // 각 모델에 대한 서랍 상태 초기화
        models.forEach((model, index) => {
            if (model) {
                this.drawerStates.push({
                    model: model,
                    targetPosition: 0,
                    currentPosition: 0,
                    isOpen: false,
                    drawer: null,
                    nextToggleTime: Math.random() * 10 // 랜덤 시간에 첫 번째 토글
                });
            }
        });

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

    /**
     * 서랍 열고 닫기 애니메이션 업데이트
     * @param {number} delta - 프레임 간 시간차
     * @param {number} elapsed - 총 경과 시간
     */
    update(delta, elapsed) {
        this.drawerStates.forEach((state, index) => {
            // 랜덤 시간마다 서랍 토글
            if (elapsed >= state.nextToggleTime) {
                state.isOpen = !state.isOpen;
                state.targetPosition = state.isOpen ? 0.3 : 0; // 서랍 열림/닫힘 거리
                state.nextToggleTime = elapsed + 5 + Math.random() * 10; // 5~15초 후 다시 토글
            }

            // 부드럽게 이동 (lerp)
            state.currentPosition += (state.targetPosition - state.currentPosition) * delta * 2;

            // 모델의 첫 번째 자식을 서랍으로 간주하고 Z축으로 이동
            if (state.model && state.model.children.length > 0) {
                const drawer = state.model.children[0];
                if (drawer) {
                    // 회전에 따라 이동 방향 결정
                    const rotY = state.model.rotation.y;
                    if (Math.abs(rotY - Math.PI) < 0.1 || Math.abs(rotY + Math.PI) < 0.1) {
                        // 180도 회전 (뒤쪽 체스터)
                        drawer.position.z = -state.currentPosition;
                    } else {
                        // 0도 회전 (앞쪽 체스터)
                        drawer.position.z = state.currentPosition;
                    }
                }
            }
        });
    }
}