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
let ImageService = class ImageService {
    constructor(productRepository, productImageRepository) {
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
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
    async getProductDetails() {
        try {
            const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';
            const imageResult = await this.productRepository.query(`
        SELECT p.sku AS product_sku, psv.sku AS variation_sku, pi.image_name AS image_name
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        JOIN product_images pi ON psv.sgid = pi.sku_variation_id
        WHERE p.sgid IN (2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
      `);
            console.log(`imageResult: ${JSON.stringify(imageResult)}`);
            const result = imageResult.map(item => ({
                image_url: `${baseUrl}/${item.product_sku}/${item.variation_sku}/${item.image_name}`
            }));
            return result;
        }
        catch (error) {
            console.error('Error fetching product details:', error);
            throw new Error('Internal server error');
        }
    }
    async getImageAttributes(productSku, variationSku) {
        try {
            console.log(`Fetching image attributes for Product SKU: ${productSku}, Variation SKU: ${variationSku}`);
            const imageResult = await this.productRepository.query(`
        SELECT pi.sgid, pi.product_id, pi.sku_variation_id, pi.image_name, pi.alt_text, pi.is_default, pi.sort_order, pi.created_at, pi.updated_at, pi.status
        FROM product_images pi
        JOIN product_sku_variation psv ON pi.sku_variation_id = psv.sgid
        JOIN product p ON psv.product_id = p.sgid
        WHERE p.sku = $1 AND psv.sku = $2;
      `, [productSku, variationSku]);
            if (imageResult.length === 0) {
                throw new common_1.NotFoundException(`No image found for product SKU: ${productSku} and variation SKU: ${variationSku}`);
            }
            console.log('Fetched image attributes:', imageResult[0]);
            return imageResult[0];
        }
        catch (error) {
            console.error('Error fetching image attributes:', error);
            throw new Error('Internal server error');
        }
    }
    async updateImageAttributes(productSku, variationSku, updateImageDto) {
        try {
            const product = await this.productRepository.query(`
        SELECT p.sgid AS product_id, psv.sgid AS sku_variation_id
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        WHERE p.sku = $1 AND psv.sku = $2
      `, [productSku, variationSku]);
            if (!product.length) {
                throw new common_1.NotFoundException('Product or SKU variation not found');
            }
            const { product_id, sku_variation_id } = product[0];
            console.log('Updating image attributes:', { product_id, sku_variation_id, updateImageDto });
            const image = await this.productImageRepository.findOne({
                where: { product_id, sku_variation_id }
            });
            if (!image) {
                throw new common_1.NotFoundException('Image not found');
            }
            Object.assign(image, updateImageDto);
            return await this.productImageRepository.save(image);
        }
        catch (error) {
            console.error('Error updating image attributes:', error);
            throw new common_1.InternalServerErrorException('Failed to update image attributes');
        }
    }
    async findProductsByStatus(status) {
        return this.productImageRepository.find({
            where: { status },
            relations: ['product', 'skuVariation'],
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
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ImageService);
//# sourceMappingURL=image.service.js.map