/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './image.entity';
import { ProductSkuVariation } from './image-sku.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true })
  product_id: string;

  @Column({ nullable: true })
  sku_variation: string;

  @Column({ nullable: true })
  image_name: string;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ nullable: true })
  is_default: string;

  @Column({ nullable: true })
  sort_order: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ProductSkuVariation, skuVariation => skuVariation.productImages)
  @JoinColumn({ name: 'sku_variation' })
  skuVariation: ProductSkuVariation;

  @ManyToOne(() => Product, product => product.productImages)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
