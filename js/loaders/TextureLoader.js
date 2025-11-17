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

        try {
            // Diffuse (Base Color) 텍스처
            if (textureFiles.diffuse) {
                textures.diffuse = await this.loadTexture(`${basePath}/${textureFiles.diffuse}`);
                textures.diffuse.encoding = THREE.sRGBEncoding;
            }

            // Normal 텍스처
            if (textureFiles.normal) {
                textures.normal = await this.loadTexture(`${basePath}/${textureFiles.normal}`);
            }

            // Roughness 텍스처
            if (textureFiles.roughness) {
                textures.roughness = await this.loadTexture(`${basePath}/${textureFiles.roughness}`);
            }

            // AO (Ambient Occlusion) + Roughness + Metallic 텍스처
            if (textureFiles.arm) {
                textures.arm = await this.loadTexture(`${basePath}/${textureFiles.arm}`);
            }

            // Specular IOR 텍스처
            if (textureFiles.specular) {
                textures.specular = await this.loadTexture(`${basePath}/${textureFiles.specular}`);
            }

            console.log(`PBR 텍스처 로드 완료: ${basePath}`);
            return textures;

        } catch (error) {
            console.error(`텍스처 로드 실패 (${basePath}):`, error);
            return null;
        }
    }

    /**
     * 단일 텍스처 로드
     * @param {string} path - 텍스처 파일 경로
     * @returns {Promise<THREE.Texture>}
     */
    loadTexture(path) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    resolve(texture);
                },
                undefined,
                (error) => reject(error)
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
