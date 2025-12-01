/**
 * 장식용 Bezier Curve 클래스
 * Bezier curve를 이용한 장식 객체
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class DecorativeCurve {
    constructor(scene) {
        this.scene = scene;
        this.curveObject = null;
    }

    /**
     * Bezier curve 생성
     * @param {Array} controlPoints - 제어점 배열 [p0, p1, p2, p3]
     * @param {number} color - 곡선 색상
     * @param {number} radius - 튜브 반지름
     */
    create(controlPoints, color = 0xFFD700, radius = 0.05) {
        // Cubic Bezier Curve 생성 (4개의 제어점 사용)
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(...controlPoints[0]),
            new THREE.Vector3(...controlPoints[1]),
            new THREE.Vector3(...controlPoints[2]),
            new THREE.Vector3(...controlPoints[3])
        );

        // 곡선을 따라 튜브 지오메트리 생성
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            64,      // 세그먼트 수 (부드러움)
            radius,  // 튜브 반지름
            8,       // 방사형 세그먼트
            false    // 닫힌 곡선 아님
        );

        // 재질 생성 (발광 효과)
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.5,
            roughness: 0.3,
            metalness: 0.7
        });

        // 메쉬 생성
        this.curveObject = new THREE.Mesh(tubeGeometry, material);
        this.curveObject.castShadow = true;
        this.curveObject.receiveShadow = true;

        this.scene.add(this.curveObject);
        console.log('✓ Bezier Curve 생성 완료');
    }

    /**
     * 여러 개의 Bezier curve를 생성 (장식 패턴)
     * @param {Array} curvesData - [{controlPoints, color, radius}, ...]
     */
    createMultiple(curvesData) {
        const group = new THREE.Group();

        curvesData.forEach(curveData => {
            const { controlPoints, color, radius } = curveData;

            const curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(...controlPoints[0]),
                new THREE.Vector3(...controlPoints[1]),
                new THREE.Vector3(...controlPoints[2]),
                new THREE.Vector3(...controlPoints[3])
            );

            const tubeGeometry = new THREE.TubeGeometry(curve, 64, radius || 0.05, 8, false);
            const material = new THREE.MeshStandardMaterial({
                color: color || 0xFFD700,
                emissive: color || 0xFFD700,
                emissiveIntensity: 0.5,
                roughness: 0.3,
                metalness: 0.7
            });

            const mesh = new THREE.Mesh(tubeGeometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            group.add(mesh);
        });

        this.curveObject = group;
        this.scene.add(this.curveObject);
        console.log(`✓ ${curvesData.length}개의 Bezier Curve 생성 완료`);
    }
}
