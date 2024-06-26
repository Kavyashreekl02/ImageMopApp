/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Method to create a new product
  create(createProductDto: CreateImageDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  // Method to find all products
  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  // Method to find one product by ID
  findOne(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ sgid: id });
  }

  // Method to get product details with specific query
  async getProductDetails() {
    const imageResult = await this.productRepository
      .createQueryBuilder('p')
      .select([
        'p.sgid AS product_sgid',
        'psv.sku_variation AS variation_sku',
        'pi.image_name AS image_name',
      ])
      .innerJoin('p.productSkuVariations', 'psv')
      .innerJoin('psv.productImages', 'pi')
      .where('p.sgid = :sgid', { sgid: 1 })
      .getRawMany();
      /*console.log(`imageResult: ${JSON.stringify(imageResult)}`);*/
      const imagePathArray = imageResult.map(item => `${item.product_sgid}/${item.variation_sku}/${item.image_name}`);
      console.log(`imagePathArray: ${JSON.stringify(imagePathArray)}`);
      return imagePathArray

  }

  // Method to update a product by ID
  async update(id: number, updateProductDto: UpdateImageDto): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // Method to remove a product by ID
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }
}
