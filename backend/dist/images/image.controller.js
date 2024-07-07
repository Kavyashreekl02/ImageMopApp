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
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const image_service_1 = require("./image.service");
const create_image_dto_1 = require("./dto/create-image.dto");
const update_image_dto_1 = require("./dto/update-image.dto");
let ImageController = class ImageController {
    constructor(imageService) {
        this.imageService = imageService;
    }
    async getProductDetails() {
        return this.imageService.getProductDetails();
    }
    findProductsByStatus(status) {
        return this.imageService.findProductsByStatus(status);
    }
    async getImageAttributes(productSku, variationSku) {
        return this.imageService.getImageAttributes(productSku, variationSku);
    }
    async updateImageAttributes(productSku, variationSku, updateImageAttributes) {
        return this.imageService.updateImageAttributes(productSku, variationSku, updateImageAttributes);
    }
    create(createProductDto) {
        return this.imageService.create(createProductDto);
    }
    findAll() {
        return this.imageService.findAll();
    }
    async findOne(id) {
        const product = await this.imageService.findOne(+id);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    update(id, updateProductDto) {
        return this.imageService.update(+id, updateProductDto);
    }
    remove(id) {
        return this.imageService.remove(+id);
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Get)('details'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getProductDetails", null);
__decorate([
    (0, common_1.Get)('status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "findProductsByStatus", null);
__decorate([
    (0, common_1.Get)('image-attributes/:productSku/:variationSku'),
    __param(0, (0, common_1.Param)('productSku')),
    __param(1, (0, common_1.Param)('variationSku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getImageAttributes", null);
__decorate([
    (0, common_1.Put)('image-attributes/:productSku/:variationSku'),
    __param(0, (0, common_1.Param)('productSku')),
    __param(1, (0, common_1.Param)('variationSku')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_image_dto_1.UpdateImageDto]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "updateImageAttributes", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_image_dto_1.CreateImageDto]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_image_dto_1.UpdateImageDto]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImageController.prototype, "remove", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], ImageController);
//# sourceMappingURL=image.controller.js.map