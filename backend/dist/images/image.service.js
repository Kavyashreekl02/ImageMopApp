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
let ImageService = class ImageService {
    constructor(productRepository) {
        this.productRepository = productRepository;
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
        const imageResult = await this.productRepository
            .createQueryBuilder('p')
            .select([
            'p.sgid AS product_sgid',
            'psv.sku_variation AS variation_sku',
            'pi.image_name AS image_name',
        ])
            .innerJoin('p.productSkuVariations', 'psv')
            .innerJoin('psv.productImages', 'pi')
            .where('p.sgid = :sgid', { sgid: 1 })
            .getRawMany();
        const imagePathArray = imageResult.map(item => `${item.product_sgid}/${item.variation_sku}/${item.image_name}`);
        console.log(`imagePathArray: ${JSON.stringify(imagePathArray)}`);
        return imagePathArray;
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImageService);
//# sourceMappingURL=image.service.js.map