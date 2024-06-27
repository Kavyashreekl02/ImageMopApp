/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from './image.entity';
import { ProductImage } from './image-image.entity';

@Entity('product_sku_variation')
export class ProductSkuVariation {
  @PrimaryGeneratedColumn()
  sgid: number;

  @Column({ nullable: true })
  product_id: string;


  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  asset_value: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @ManyToOne(() => Product, product => product.productSkuVariations)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductImage, productImage => productImage.skuVariation)
  productImages: ProductImage[];
}
