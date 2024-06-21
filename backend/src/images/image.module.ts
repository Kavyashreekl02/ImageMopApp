/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Product } from './entities/image.entity';
import { ProductImage } from './entities/image-image.entity';
import { ProductSkuVariation } from './entities/image-sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductSkuVariation])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ProductModule {}
