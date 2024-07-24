/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';

@Controller('product')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('status/:status')
  findProductsByStatus(@Param('status') status: string) {
    return this.imageService.findProductsByStatus(status);
  }
  
  @Get('image-attributes')
  async getImageAttributes(
    @Query('limit') limit: number = 500,
    @Query('offset') offset: number = 0,
  ) {
    return this.imageService.getImageAttributes(limit, offset);
  }

  @Get('total-images')
  async getTotalImages() {
    return this.imageService.getTotalImages();
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

  @Delete('image')
  async deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    console.log('Delete request received with body:', deleteImageDto);

    if (
      !deleteImageDto.productSku ||
      !deleteImageDto.variationSku ||
      !deleteImageDto.imageName
    ) {
      console.error('Missing parameters:', deleteImageDto);
      throw new BadRequestException('Missing required parameters');
    }

    return this.imageService.deleteImage(deleteImageDto);
  }

  // @Delete('deleteByProductAndVariation/:productSku/:variationSku')
  // async deleteImageByProductAndVariation(
  //   @Param('productSku') productSku: string,
  //   @Param('variationSku') variationSku: string,
  // ): Promise<void> {
  //   await this.imageService.deleteByProductAndVariation(
  //     productSku,
  //     variationSku,
  //   );
  // }
}
