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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSkuVariation = void 0;
const typeorm_1 = require("typeorm");
const image_entity_1 = require("./image.entity");
const image_image_entity_1 = require("./image-image.entity");
let ProductSkuVariation = class ProductSkuVariation {
};
exports.ProductSkuVariation = ProductSkuVariation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ProductSkuVariation.prototype, "sgid", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSkuVariation.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSkuVariation.prototype, "sku_variation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSkuVariation.prototype, "image_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ProductSkuVariation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ProductSkuVariation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSkuVariation.prototype, "alt_text", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => image_entity_1.Product, product => product.productSkuVariations),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", image_entity_1.Product)
], ProductSkuVariation.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_image_entity_1.ProductImage, productImage => productImage.skuVariation),
    __metadata("design:type", Array)
], ProductSkuVariation.prototype, "productImages", void 0);
exports.ProductSkuVariation = ProductSkuVariation = __decorate([
    (0, typeorm_1.Entity)('product_sku_variation')
], ProductSkuVariation);
//# sourceMappingURL=image-sku.entity.js.map