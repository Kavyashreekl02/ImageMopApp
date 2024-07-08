/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from './entities/image.entity';
import { ProductImage } from './entities/image-image.entity';
import { ProductSkuVariation } from './entities/image-sku.entity';
import { DeleteImageDto } from './dto/delete-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductSkuVariation)
    private readonly productSkuVariationRepository: Repository<ProductSkuVariation>,
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

  async getProductDetails() {
    try {
      const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';

      // Execute the SQL query and get the results
      const imageResult = await this.productRepository.query(`
        SELECT p.sku AS product_sku, psv.sku AS variation_sku, pi.image AS image_name
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        JOIN product_images pi ON psv.sgid = pi.sku_variation_id
        WHERE p.sgid IN (2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
      `);

      console.log(`imageResult: ${JSON.stringify(imageResult)}`);

      // Directly construct the URLs
      const result = imageResult.map(item => ({
        image_url: `${baseUrl}/${item.product_sku}/${item.variation_sku}/${item.image_name}`
      }));

      return result;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw new Error('Internal server error');
    }
  }

  async getImageAttributes(productSku: string, variationSku: string) {
    try {
      console.log(`Fetching image attributes for Product SKU: ${productSku}, Variation SKU: ${variationSku}`);
      const imageResult = await this.productRepository.query(`
        SELECT pi.sgid, psv.product_id, pi.sku_variation_id, pi.image AS image_name, pi.alt_text, pi.is_default, pi.sort_order, pi.created_at, pi.updated_at, pi.status
        FROM product_images pi
        JOIN product_sku_variation psv ON pi.sku_variation_id = psv.sgid
        JOIN product p ON psv.product_id = p.sgid
        WHERE p.sku = $1 AND psv.sku = $2;
      `, [productSku, variationSku]);

      console.log(productSku,variationSku)

      if (imageResult.length === 0) {
        throw new NotFoundException(`No image found for product SKU: ${productSku} and variation SKU: ${variationSku}`);
      }

      console.log('Fetched image attributes:', imageResult[0]);
      return imageResult[0];
    } catch (error) {
      console.error('Error fetching image attributes:', error);
      throw new Error('Internal server error');
    }
  }

  async updateImageAttributes(
    productSku: string,
    variationSku: string,
    updateImageDto: UpdateImageDto
  ): Promise<any> {
    try {
      const product = await this.productRepository.query(`
        SELECT p.sgid AS sgid, psv.sgid AS sku_variation_id
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        WHERE p.sku = $1 AND psv.sku = $2
      `, [productSku, variationSku]);

      if (!product.length) {
        throw new NotFoundException('Product or SKU variation not found');
      }

     const { sku_variation_id } = product[0];

      console.log('Updating image attributes:', { sku_variation_id, updateImageDto });

      const image = await this.productImageRepository.findOne({
        where: { sku_variation_id: sku_variation_id }
      })

      console.log(`image name: ${JSON.stringify(image)}`)

      if (!image) {

        throw new NotFoundException('Image not found');
      }

      Object.assign(image, updateImageDto);
      return await this.productImageRepository.save(image);

      
     
    } catch (error) {
      console.error('Error updating image attributes:', error);
      throw new InternalServerErrorException('Failed to update image attributes');
    }
  }

  async findProductsByStatus(status: string): Promise<ProductImage[]> {
    return this.productImageRepository.find({
      where: { status },
      relations: ['skuVariation'],
    });
  }

  async deleteImage(deleteImageDto: DeleteImageDto): Promise<void> {
    const { productSku, variationSku, imageName } = deleteImageDto;

    console.log('Received parameters for deletion:', { productSku, variationSku, imageName });

    if (!productSku || !variationSku || !imageName) {
      console.error('Invalid parameters:', { productSku, variationSku, imageName });
      throw new BadRequestException('Invalid parameters for deletion');
    }

    const image = await this.productImageRepository.findOne({
      where: { image: imageName },
      relations: ['skuVariation', 'skuVariation.product'],
    });

    console.log('Found image:', image);

    if (!image || image.skuVariation.sku !== variationSku || image.skuVariation.product.sku !== productSku) {
      console.error('Image not found or mismatched parameters:', {
        imageSku: image?.skuVariation.sku,
        imageProductSku: image?.skuVariation.product.sku,
      });
      throw new NotFoundException('Image not found');
    }

    await this.productImageRepository.remove(image);
    console.log('Image deleted successfully:', { productSku, variationSku, imageName });
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
    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID for deletion');
    }
  
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    await this.productRepository.remove(product);
  }
}