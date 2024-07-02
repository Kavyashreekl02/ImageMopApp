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

//   // Method to get product details with specific query
//   async getProductDetails() {
//     // const imageResult = await this.productRepository
//     //   .createQueryBuilder('p')
//     //   .select([
//     //     'p.sku AS product_sku',
//     //     'psv.sku AS variation_sku',
//     //     'pi.image_name AS image_name',
//     //   ])
//     //   .innerJoin('p.productSkuVariations', 'psv')
//     //   .innerJoin('psv.productImages', 'pi')
   
//     //   .getRawMany();
//     //   /*console.log(`imageResult: ${JSON.stringify(imageResult)}`);*/
//     //   const imagePathArray = imageResult.map(item => `${item.product_sgid}/${item.variation_sku}/${item.image_name}`);
     
//     //   return imagePathArray

//     const imageResult = await this.productRepository.query(` select p.sku as product_sku,psv.sku as variation_sku ,pi.image_name  as  image_name
// from product p, product_sku_variation psv, product_images pi where
// p.sgid=psv.product_id and psv.sgid=pi.sku_variation_id and p.sgid=2`)
   
//     console.log(`imageResult: ${JSON.stringify(imageResult)}`);

//     const result = imageResult.map(item => `${item.p.product_sku}/${item.variation_sku}/${item.image_name}`);

//     return result;


//     //imageResult.array.forEach(item => {
//       //result.push(`${item.product_sku}/${item.variation_sku}/${item.image_name}`)
//     //});
 
    
//     // `${item.product_sku}/${item.variation_sku}/${item.image_name}`

   
//     // console.log(`*********************************************`);

//     // return result

//   }

async getProductDetails() {
  try {
    const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';

    // Execute the SQL query and get the results
    const imageResult = await this.productRepository.query(`
      SELECT p.sku AS product_sku, psv.sku AS variation_sku, pi.image_name AS image_name
      FROM product p
      JOIN product_sku_variation psv ON p.sgid = psv.product_id
      JOIN product_images pi ON psv.sgid = pi.sku_variation_id
      WHERE p.sgid = 2;
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
      SELECT pi.sgid, pi.product_id, pi.sku_variation_id, pi.image_name, pi.alt_text, pi.is_default, pi.sort_order, pi.created_at, pi.updated_at, p.description
      FROM product_images pi
      JOIN product_sku_variation psv ON pi.sku_variation_id = psv.sgid
      JOIN product p ON psv.product_id = p.sgid
      WHERE p.sku = $1 AND psv.sku = $2;
    `, [productSku, variationSku]);

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