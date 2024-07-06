/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('product')
export class ImageController {
  
  constructor(private readonly imageService: ImageService) {}

  @Get('details')
  async getProductDetails() {
    return this.imageService.getProductDetails();
  }

  @Get('status/:status')
  findProductsByStatus(@Param('status') status: string) {
    return this.imageService.findProductsByStatus(status);
  }

  @Get('image-attributes/:productSku/:variationSku')
  async getImageAttributes(
    @Param('productSku') productSku: string, 
    @Param('variationSku') variationSku: string
  ) {
    return this.imageService.getImageAttributes(productSku, variationSku);
  }

  @Put('image-attributes/:productSku/:variationSku')
  async updateImageAttributes(
    @Param('productSku') productSku: string,
    @Param('variationSku') variationSku: string,
    @Body() updateImageAttributes: UpdateImageDto,
  ) {
    return this.imageService.updateImageAttributes(productSku, variationSku, updateImageAttributes);
  }

  @Post()
  create(@Body() createProductDto: CreateImageDto) {
    return this.imageService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.imageService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateImageDto) {
    return this.imageService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
