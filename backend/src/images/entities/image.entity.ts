/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductImage } from './image-image.entity';
import { ProductSkuVariation } from './image-sku.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  product_image_uri: string;

  @Column('text')
  product_description: string;

  @Column({ nullable: true })
  product_dimensions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('float')
  price: number;

  @Column('int')
  quantity: number;

  @Column()
  status: string;

  @OneToMany(() => ProductImage, productImage => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => ProductSkuVariation, productSkuVariation => productSkuVariation.product)
  productSkuVariations: ProductSkuVariation[];
}
