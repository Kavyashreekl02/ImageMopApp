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

// async getProductDetails() {
//   try {
//     const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';

//     // Execute the SQL query and get the results
//     const imageResult = await this.productRepository.query(`
//       SELECT p.sku AS product_sku, psv.sku AS variation_sku, pi.image_name AS image_name
//       FROM product p
//       JOIN product_sku_variation psv ON p.sgid = psv.product_id
//       JOIN product_images pi ON psv.sgid = pi.sku_variation_id
//       WHERE p.sgid = 2;
//     `);

//     console.log(`imageResult: ${JSON.stringify(imageResult)}`);

//     // Directly construct the URLs
//     const result = imageResult.map(item => ({
//       image_url: `${baseUrl}/${item.product_sku}/${item.variation_sku}/${item.image_name}`
//     }));

//     return result;
//   } catch (error) {
//     console.error('Error fetching product details:', error);
//     throw new Error('Internal server error');
//   }
// }

async getProductDetails() {
  try {
    const baseUrl = 'https://d12kqwzvfrkt5o.cloudfront.net/products';

    // Execute the SQL query and get the results
    const imageResult = await this.productRepository.query(`
      SELECT p.sgid, p.sku AS product_sku, p.name, p.description, p.created_at, p.updated_at,
             psv.sku AS variation_sku, pi.sgid AS image_sgid, pi.image_name, pi.alt_text, pi.is_default,
             pi.sort_order, pi.created_at AS image_created_at, pi.updated_at AS image_updated_at
      FROM product p
      JOIN product_sku_variation psv ON p.sgid = psv.product_id
      JOIN product_images pi ON psv.sgid = pi.sku_variation_id
    `);

    console.log(`imageResult: ${JSON.stringify(imageResult)}`);

    // Directly construct the URLs and return the structured data
    const result = imageResult.map(item => ({
      sgid: item.sgid,
      product_sku: item.product_sku,
      name: item.name,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product_images: [{
        sgid: item.image_sgid,
        product_id: item.product_sku,
        sku_variation_id: item.variation_sku,
        image_name: item.image_name,
        alt_text: item.alt_text,
        is_default: item.is_default,
        sort_order: item.sort_order,
        created_at: item.image_created_at,
        updated_at: item.image_updated_at,
        image_url: `${baseUrl}/${item.product_sku}/${item.variation_sku}/${item.image_name}`
      }],
    }));

    return result;
  } catch (error) {
    console.error('Error fetching product details:', error);
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