/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Product } from './image.entity';

@Entity('product_sku_variation')
export class ProductSkuVariation {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true })
  sku_variation: string;

  @Column({ nullable: true })
  image_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  alt_text: string;

  @ManyToOne(() => Product, product => product.productSkuVariations)
  product: Product;
}
