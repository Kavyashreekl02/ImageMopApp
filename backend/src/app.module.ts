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
      host: 'dev-pdm-saffron.cereptpeh9n0.us-west-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'OiaWHu7z6V5ojhPSSJfV',
      database: 'furniture_data_cloud',
      entities: [Product, ProductImage, ProductSkuVariation], // Specify your entities here
      synchronize: false, // Don't synchronize with the database
      logging: true,
    }),
    ProductModule,
  ],
})
export class AppModule {}