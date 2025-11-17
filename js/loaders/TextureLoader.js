/**
 * 텍스처 로더 유틸리티
 * PBR 텍스처 (diffuse, normal, roughness 등)를 로드
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

export class TextureLoaderUtil {
    constructor() {
        this.loader = new THREE.TextureLoader();
    }

    /**
     * PBR 텍스처 세트 로드
     * @param {string} basePath - 텍스처 폴더 경로
     * @param {Object} textureFiles - 텍스처 파일명 객체
     * @returns {Promise<Object>} 로드된 텍스처 객체
     */
    async loadPBRTextures(basePath, textureFiles) {
        const textures = {};
        let loadedCount = 0;
        let failedCount = 0;

        console.log(`텍스처 로딩 시작: ${basePath}`);

        // Diffuse (Base Color) 텍스처
        if (textureFiles.diffuse) {
            try {
                textures.diffuse = await this.loadTexture(`${basePath}/${textureFiles.diffuse}`);
                textures.diffuse.encoding = THREE.sRGBEncoding;
                loadedCount++;
                console.log(`✓ Diffuse 텍스처 로드 성공: ${textureFiles.diffuse}`);
            } catch (error) {
                console.warn(`✗ Diffuse 텍스처 로드 실패: ${textureFiles.diffuse}`, error.message);
                failedCount++;
            }
        }

        // Normal 텍스처
        if (textureFiles.normal) {
            try {
                textures.normal = await this.loadTexture(`${basePath}/${textureFiles.normal}`);
                loadedCount++;
                console.log(`✓ Normal 텍스처 로드 성공: ${textureFiles.normal}`);
            } catch (error) {
                console.warn(`✗ Normal 텍스처 로드 실패: ${textureFiles.normal}`, error.message);
                failedCount++;
            }
        }

        // Roughness 텍스처
        if (textureFiles.roughness) {
            try {
                textures.roughness = await this.loadTexture(`${basePath}/${textureFiles.roughness}`);
                loadedCount++;
                console.log(`✓ Roughness 텍스처 로드 성공: ${textureFiles.roughness}`);
            } catch (error) {
                console.warn(`✗ Roughness 텍스처 로드 실패: ${textureFiles.roughness}`, error.message);
                failedCount++;
            }
        }

        // AO (Ambient Occlusion) + Roughness + Metallic 텍스처
        if (textureFiles.arm) {
            try {
                textures.arm = await this.loadTexture(`${basePath}/${textureFiles.arm}`);
                loadedCount++;
                console.log(`✓ ARM 텍스처 로드 성공: ${textureFiles.arm}`);
            } catch (error) {
                console.warn(`✗ ARM 텍스처 로드 실패: ${textureFiles.arm}`, error.message);
                failedCount++;
            }
        }

        // Specular IOR 텍스처
        if (textureFiles.specular) {
            try {
                textures.specular = await this.loadTexture(`${basePath}/${textureFiles.specular}`);
                loadedCount++;
                console.log(`✓ Specular 텍스처 로드 성공: ${textureFiles.specular}`);
            } catch (error) {
                console.warn(`✗ Specular 텍스처 로드 실패: ${textureFiles.specular}`, error.message);
                failedCount++;
            }
        }

        console.log(`텍스처 로딩 완료: ${basePath} (성공: ${loadedCount}, 실패: ${failedCount})`);

        // 최소 하나의 텍스처라도 로드되면 객체 반환
        return Object.keys(textures).length > 0 ? textures : null;
    }

    /**
     * 단일 텍스처 로드 (타임아웃 포함)
     * @param {string} path - 텍스처 파일 경로
     * @param {number} timeout - 타임아웃 시간 (밀리초)
     * @returns {Promise<THREE.Texture>}
     */
    loadTexture(path, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let isResolved = false;

            // 타임아웃 설정
            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    reject(new Error(`텍스처 로딩 타임아웃: ${path}`));
                }
            }, timeout);

            this.loader.load(
                path,
                (texture) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        resolve(texture);
                    }
                },
                (progress) => {
                    // 로딩 진행상황 (선택적)
                    if (progress.lengthComputable) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        console.log(`  로딩 중: ${path.split('/').pop()} - ${percent}%`);
                    }
                },
                (error) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeoutId);
                        reject(new Error(`텍스처 로딩 실패: ${path} - ${error.message}`));
                    }
                }
            );
        });
    }

    /**
     * 벽 텍스처 로드
     */
    async loadWallTextures() {
        return await this.loadPBRTextures('wall_texture_mapping/textures', {
            diffuse: 'cracked_concrete_wall_diff_1k.jpg',
            normal: 'cracked_concrete_wall_nor_gl_1k.jpg',
            roughness: 'cracked_concrete_wall_rough_1k.jpg'
        });
    }

    /**
     * 바닥 텍스처 로드
     */
    async loadFloorTextures() {
        return await this.loadPBRTextures('floor_texture_mapping/textures', {
            diffuse: 'marble_01_diff_1k.jpg',
            normal: 'marble_01_nor_gl_1k.jpg',
            roughness: 'marble_01_rough_1k.jpg'
        });
    }

    /**
     * 침대 텍스처 로드
     */
    async loadBedTextures() {
        return await this.loadPBRTextures('bed_texture_mapping/textures', {
            diffuse: 'rough_linen_diff_1k.jpg',
            normal: 'rough_linen_nor_gl_1k.jpg',
            arm: 'rough_linen_arm_1k.jpg',
            specular: 'rough_linen_spec_ior_1k.jpg'
        });
    }
}
