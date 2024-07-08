/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import { ProductSkuVariation } from './image-sku.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true })
  sku_variation_id: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  alt_text: string;

  @Column({ length: 10, nullable: true })
  is_default: string;

  @Column({ length: 10, nullable: true })
  sort_order: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => ProductSkuVariation, skuVariation => skuVariation.productImages)
  @JoinColumn({ name: 'sku_variation_id' })
  skuVariation: ProductSkuVariation;

 
}
