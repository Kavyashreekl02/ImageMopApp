/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ProductImage } from './image-image.entity';
import { ProductSkuVariation } from './image-sku.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  status: string;


  @OneToMany(() => ProductImage, productImage => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => ProductSkuVariation, productSkuVariation => productSkuVariation.product)
  productSkuVariations: ProductSkuVariation[];
}
