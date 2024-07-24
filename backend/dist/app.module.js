"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const image_module_1 = require("./images/image.module");
const image_entity_1 = require("./images/entities/image.entity");
const image_image_entity_1 = require("./images/entities/image-image.entity");
const image_sku_entity_1 = require("./images/entities/image-sku.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'dev-pdm-saffron.cereptpeh9n0.us-west-1.rds.amazonaws.com',
                port: 5432,
                username: 'postgres',
                password: 'OiaWHu7z6V5ojhPSSJfV',
                database: 'furniture_data_cloud',
                entities: [image_entity_1.Product, image_image_entity_1.ProductImage, image_sku_entity_1.ProductSkuVariation],
                synchronize: false,
                logging: true,
            }),
            image_module_1.ProductModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map