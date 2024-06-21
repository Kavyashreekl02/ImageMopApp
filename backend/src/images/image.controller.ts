/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('products')
export class ImageController {
  constructor(private readonly productService: ImageService) {}

  @Post()
  create(@Body() createProductDto: CreateImageDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateImageDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
