/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Product } from './entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
