/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from './entities/image.entity';
import { ProductImage } from './entities/image-image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
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
      .leftJoinAndSelect('p.skuVariations', 'psv')
      .leftJoinAndSelect('psv.images', 'pi')
      .select([
        'p.sgid AS product_sgid',
        'psv.sgid AS variation_sgid',
        'pi.image_name AS image_name',
        'pi.alt_text AS alt_text',
        'pi.is_default AS is_default',
        'pi.sort_order AS sort_order',
      ])
      .getRawMany();

    const imagePathArray = imageResult.map(item => ({
      product_sgid: item.product_sgid,
      variation_sgid: item.variation_sgid,
      image_name: item.image_name,
      alt_text: item.alt_text,
      is_default: item.is_default,
      sort_order: item.sort_order,
    }));
    console.log(`imagePathArray: ${JSON.stringify(imagePathArray)}`);
    return imagePathArray;
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