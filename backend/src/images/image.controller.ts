/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('product')
export class ImageController {
  constructor(private readonly productService: ImageService) {}

  @Get('details')
  async getProductDetails() {
    return this.productService.getProductDetails();
  }

  @Get('image-attributes/:productSku/:variationSku')
async getImageAttributes(@Param('productSku') productSku: string, @Param('variationSku') variationSku: string) {
  return this.productService.getImageAttributes(productSku, variationSku);
}


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
  update(@Param('id') id: string, @Body() updateProductDto: UpdateImageDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
