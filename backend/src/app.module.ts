/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './images/image.module';
import { Product } from './images/entities/image.entity';
import { ProductImage } from './images/entities/image-image.entity';
import { ProductSkuVariation } from './images/entities/image-sku.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'nestapp',
      entities: [Product, ProductImage, ProductSkuVariation],
      synchronize: true,
      logging: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}
