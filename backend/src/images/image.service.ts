/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async getTotalImages(): Promise<number> {
    try {
      const totalImages = await this.productImageRepository.count();
      return totalImages;
    } catch (error) {
      console.error('Error fetching total number of images:', error);
      throw new InternalServerErrorException('Failed to fetch total number of images');
    }
  }

  async getImageAttributes(limit: number, offset: number) {
    try {
      const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';
      console.log(`Fetching image attributes`);


      const imageResult = await this.productRepository.query(`
        SELECT 
            p.sgid as sgid,
            pi.sku_variation_id AS sku_variation_id,
            p.sku AS product_sku,
            psv.sku AS product_variation_sku,
            p.name AS product_name,
            p.description AS product_description,
            p.meta_title AS meta_title,
            p.meta_description AS meta_description,
            p.meta_keywords AS meta_keywords,
            psv.weight AS product_weight,
            psv.dimension AS product_dimension,
            pi.image AS product_image,
            pi.alt_text AS alt_text,
            pi.created_at AS created_at,
            pi.updated_at AS updated_at,
            pi.image_url AS image_url,
            pi.status AS status
        FROM 
            product p
        JOIN 
            product_sku_variation psv ON p.sgid = psv.product_id
        JOIN 
            product_images pi ON psv.sgid = pi.sku_variation_id
        ORDER BY 
            p.sgid
        LIMIT $1 OFFSET $2;
      `, [limit, offset]);

      if (imageResult.length === 0) {
        throw new NotFoundException('No images found');
      }

      const result = imageResult.map((item) => ({
        ...item,
        image_url: `${baseUrl}/${item.product_sku}/${item.product_variation_sku}/${item.product_image}`,
      }));


      console.log('Fetched image attributes:', result);
      return result;
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
        SELECT p.sku AS product_sku, psv.sku AS product_variation_sku
        FROM product p
        JOIN product_sku_variation psv ON p.sgid = psv.product_id
        WHERE p.sku = $1 AND psv.sku = $2
      `, [productSku, variationSku]);
  
      if (!product.length) {
        throw new NotFoundException('Product or SKU variation not found');
      }
  
      const { product_variation_sku } = product[0];
  
      console.log('Updating image attributes:', { product_variation_sku, updateImageDto });
  
      // Update the image attributes
      const updateResult = await this.productImageRepository.query(`
        UPDATE "product_images" "ProductImage"
        SET
          "status" = $1,
          "updated_at" = $2
        FROM "product_sku_variation" "ProductSkuVariation"
        JOIN "product" "Product" ON "ProductSkuVariation"."product_id" = "Product"."sgid"
        WHERE "ProductSkuVariation"."sgid" = "ProductImage"."sku_variation_id"
          AND "Product"."sku" = $3
          AND "ProductSkuVariation"."sku" = $4
        RETURNING "ProductImage".*
      `, [
        updateImageDto.status,
        new Date(),
        productSku,
        variationSku
      ]);
  
      if (!updateResult.length) {
        throw new NotFoundException('Image not found or not updated');
      }
  
      const updatedImage = updateResult[0];
  
      const payload = {
        ...updatedImage,
        image_url: `https://d12kqwzvfrkt5o.cloudfront.net/products/${productSku}/${product_variation_sku}/${updatedImage.image}`,
      };
  
      console.log('Payload:', payload);
      return payload;
  
    } catch (error) {
      console.error('Error updating image attributes:', error);
      throw new InternalServerErrorException('Failed to update image attributes');
    }
  }
  
  
  
  

  async findProductsByStatus(status: string): Promise<any[]> {
    const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products'; // Define the base URL for image resources

    const query = `
        SELECT 
            p.sgid as sgid,
            pi.sku_variation_id AS sku_variation_id,
            p.sku AS product_sku,
            psv.sku AS product_variation_sku,
            p.name AS product_name,
            p.description AS product_description,
            p.meta_title AS meta_title,
            p.meta_description AS meta_description,
            p.meta_keywords AS meta_keywords,
            psv.weight AS product_weight,
            psv.dimension AS product_dimension,
            pi.image AS product_image,
            pi.alt_text AS alt_text,
            pi.created_at AS created_at,
            pi.updated_at AS updated_at,
            pi.image_url AS image_url,
            pi.status AS status
        FROM 
            product p
        JOIN 
            product_sku_variation psv ON p.sgid = psv.product_id
        JOIN 
            product_images pi ON psv.sgid = pi.sku_variation_id
        WHERE 
            pi.status = $1
        ORDER BY 
            pi.updated_at DESC
        LIMIT 500 OFFSET 0;
    `;

    const imageResult = await this.productImageRepository.query(query, [
      status,
    ]); // Execute the query

    if (imageResult.length === 0) {
      console.log(`No products found with status: ${status}`);
      return []; // Return an empty array if no products are found
    }

    // Map the result to include a full image URL
    const result = imageResult.map((item) => ({
      ...item,
      image_url: `${baseUrl}/${item.product_sku}/${item.product_variation_sku}/${item.product_image}`,
    }));

    return result; // Return the enriched product data
  }

  async deleteImage(deleteImageDto: DeleteImageDto): Promise<void> {
    const { productSku, variationSku, imageName } = deleteImageDto;

    console.log('Received parameters for deletion:', {
      productSku,
      variationSku,
      imageName,
    });

    if (!productSku || !variationSku || !imageName) {
      console.error('Invalid parameters:', {
        productSku,
        variationSku,
        imageName,
      });
      throw new BadRequestException('Invalid parameters for deletion');
    }

    const image = await this.productImageRepository.findOne({
      where: { image: imageName },
      relations: ['skuVariation', 'skuVariation.product'],
    });

    console.log('Found image:', image);

    if (
      !image ||
      image.skuVariation.sku !== variationSku ||
      image.skuVariation.product.sku !== productSku
    ) {
      console.error('Image not found or mismatched parameters:', {
        imageSku: image?.skuVariation.sku,
        imageProductSku: image?.skuVariation.product.sku,
      });
      throw new NotFoundException('Image not found');
    }

    await this.productImageRepository.remove(image);
    console.log('Image deleted successfully:', {
      productSku,
      variationSku,
      imageName,
    });
  }

  // async deleteByProductAndVariation(
  //   productSku: string,
  //   variationSku: string,
  // ): Promise<void> {
  //   const query = `
  //     BEGIN;

  //     WITH product_cte AS (
  //         SELECT sgid 
  //         FROM product 
  //         WHERE sku = $1
  //     ),
  //     sku_variation_cte AS (
  //         SELECT sgid 
  //         FROM product_sku_variation 
  //         WHERE sku = $2 AND product_id = (SELECT sgid FROM product_cte)
  //     )
  //     DELETE FROM product_images 
  //     WHERE sku_variation_id = (SELECT sgid FROM sku_variation_cte);

  //     DELETE FROM product_sku_variation 
  //     WHERE sgid = (SELECT sgid FROM sku_variation_cte);

  //     DELETE FROM product 
  //     WHERE sgid = (SELECT sgid FROM product_cte);

  //     COMMIT;
  //   `;

  //   try {
  //     await this.productRepository.query(query, [productSku, variationSku]);
  //   } catch (error) {
  //     console.error('Error deleting product and variations:', error);
  //     throw new InternalServerErrorException(
  //       'Failed to delete product and variations',
  //     );
  //   }
  // }

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
