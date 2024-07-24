"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
const image_image_entity_1 = require("./entities/image-image.entity");
const image_sku_entity_1 = require("./entities/image-sku.entity");
let ImageService = class ImageService {
    constructor(productRepository, productImageRepository, productSkuVariationRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.productSkuVariationRepository = productSkuVariationRepository;
    }
    create(createProductDto) {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }
    findAll() {
        return this.productRepository.find();
    }
    findOne(id) {
        return this.productRepository.findOneBy({ sgid: id });
    }
    async getTotalImages() {
        try {
            const totalImages = await this.productImageRepository.count();
            return totalImages;
        }
        catch (error) {
            console.error('Error fetching total number of images:', error);
            throw new common_1.InternalServerErrorException('Failed to fetch total number of images');
        }
    }
    async getImageAttributes(limit, offset) {
        try {
            const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';
            console.log(`Fetching image attributes`);
            const imageResult = await this.productRepository.query(`
        SELECT 
            p.sgid as sgid,
            pi.sku_variation_id AS sku_variation_id,
            p.sku AS product_sku,
            psv.sku AS product_variation_sku,
            p.name AS product_name,
            p.description AS product_description,
            p.meta_title AS meta_title,
            p.meta_description AS meta_description,
            p.meta_keywords AS meta_keywords,
            psv.weight AS product_weight,
            psv.dimension AS product_dimension,
            pi.image AS product_image,
            pi.alt_text AS alt_text,
            pi.created_at AS created_at,
            pi.updated_at AS updated_at,
            pi.image_url AS image_url,
            pi.status AS status
        FROM 
            product p
        JOIN 
            product_sku_variation psv ON p.sgid = psv.product_id
        JOIN 
            product_images pi ON psv.sgid = pi.sku_variation_id
        ORDER BY 
            p.sgid
        LIMIT $1 OFFSET $2;
      `, [limit, offset]);
            if (imageResult.length === 0) {
                throw new common_1.NotFoundException('No images found');
            }
            const result = imageResult.map((item) => ({
                ...item,
                image_url: `${baseUrl}/${item.product_sku}/${item.product_variation_sku}/${item.product_image}`,
            }));
            console.log('Fetched image attributes:', result);
            return result;
        }
        catch (error) {
            console.error('Error fetching image attributes:', error);
            throw new Error('Internal server error');
        }
    }
    async updateImageAttributes(productSku, variationSku, updateImageDto) {
        try {
            const product = await this.productRepository.query(`
        SELECT p.sku AS product_sku, psv.sku AS product_variation_sku
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        WHERE p.sku = $1 AND psv.sku = $2
      `, [productSku, variationSku]);
            if (!product.length) {
                throw new common_1.NotFoundException('Product or SKU variation not found');
            }
            const { product_variation_sku } = product[0];
            console.log('Updating image attributes:', { product_variation_sku, updateImageDto });
            const updateResult = await this.productImageRepository.query(`
        UPDATE "product_images" "ProductImage"
        SET
          "status" = $1,
          "updated_at" = $2
        FROM "product_sku_variation" "ProductSkuVariation"
        JOIN "product" "Product" ON "ProductSkuVariation"."product_id" = "Product"."sgid"
        WHERE "ProductSkuVariation"."sgid" = "ProductImage"."sku_variation_id"
          AND "Product"."sku" = $3
          AND "ProductSkuVariation"."sku" = $4
        RETURNING "ProductImage".*
      `, [
                updateImageDto.status,
                new Date(),
                productSku,
                variationSku
            ]);
            if (!updateResult.length) {
                throw new common_1.NotFoundException('Image not found or not updated');
            }
            const updatedImage = updateResult[0];
            const payload = {
                ...updatedImage,
                image_url: `https://d12kqwzvfrkt5o.cloudfront.net/products/${productSku}/${product_variation_sku}/${updatedImage.image}`,
            };
            console.log('Payload:', payload);
            return payload;
        }
        catch (error) {
            console.error('Error updating image attributes:', error);
            throw new common_1.InternalServerErrorException('Failed to update image attributes');
        }
    }
    async findProductsByStatus(status) {
        const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';
        const query = `
        SELECT 
            p.sgid as sgid,
            pi.sku_variation_id AS sku_variation_id,
            p.sku AS product_sku,
            psv.sku AS product_variation_sku,
            p.name AS product_name,
            p.description AS product_description,
            p.meta_title AS meta_title,
            p.meta_description AS meta_description,
            p.meta_keywords AS meta_keywords,
            psv.weight AS product_weight,
            psv.dimension AS product_dimension,
            pi.image AS product_image,
            pi.alt_text AS alt_text,
            pi.created_at AS created_at,
            pi.updated_at AS updated_at,
            pi.image_url AS image_url,
            pi.status AS status
        FROM 
            product p
        JOIN 
            product_sku_variation psv ON p.sgid = psv.product_id
        JOIN 
            product_images pi ON psv.sgid = pi.sku_variation_id
        WHERE 
            pi.status = $1
        ORDER BY 
            pi.updated_at DESC
        LIMIT 500 OFFSET 0;
    `;
        const imageResult = await this.productImageRepository.query(query, [
            status,
        ]);
        if (imageResult.length === 0) {
            console.log(`No products found with status: ${status}`);
            return [];
        }
        const result = imageResult.map((item) => ({
            ...item,
            image_url: `${baseUrl}/${item.product_sku}/${item.product_variation_sku}/${item.product_image}`,
        }));
        return result;
    }
    async deleteImage(deleteImageDto) {
        const { productSku, variationSku, imageName } = deleteImageDto;
        console.log('Received parameters for deletion:', {
            productSku,
            variationSku,
            imageName,
        });
        if (!productSku || !variationSku || !imageName) {
            console.error('Invalid parameters:', {
                productSku,
                variationSku,
                imageName,
            });
            throw new common_1.BadRequestException('Invalid parameters for deletion');
        }
        const image = await this.productImageRepository.findOne({
            where: { image: imageName },
            relations: ['skuVariation', 'skuVariation.product'],
        });
        console.log('Found image:', image);
        if (!image ||
            image.skuVariation.sku !== variationSku ||
            image.skuVariation.product.sku !== productSku) {
            console.error('Image not found or mismatched parameters:', {
                imageSku: image?.skuVariation.sku,
                imageProductSku: image?.skuVariation.product.sku,
            });
            throw new common_1.NotFoundException('Image not found');
        }
        await this.productImageRepository.remove(image);
        console.log('Image deleted successfully:', {
            productSku,
            variationSku,
            imageName,
        });
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
    async remove(id) {
        if (isNaN(id)) {
            throw new common_1.BadRequestException('Invalid ID for deletion');
        }
        const product = await this.findOne(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        await this.productRepository.remove(product);
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(image_image_entity_1.ProductImage)),
    __param(2, (0, typeorm_1.InjectRepository)(image_sku_entity_1.ProductSkuVariation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ImageService);
//# sourceMappingURL=image.service.js.map