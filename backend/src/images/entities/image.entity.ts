/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductImage } from './image-image.entity';
import { ProductSkuVariation } from './image-sku.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true, length: 300 })
  name: string;

  @Column({ nullable: true, length: 10 })
  sku: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //@OneToMany(() => ProductImage, productImage => productImage.product)
  productImages: ProductImage[];

  //@OneToMany(() => ProductSkuVariation, productSkuVariation => productSkuVariation.product)
  productSkuVariations: ProductSkuVariation[];
}

