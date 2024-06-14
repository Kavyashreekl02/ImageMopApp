/* eslint-disable prettier/prettier */
// src/image/image.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  fdc_product_id: string;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  product_image_uri: string;

  @Column('text')
  product_description: string;

  @Column({nullable: true})
  product_dimensions: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('float')
  price: number;

  @Column('int')
  quantity: number;

  @Column({nullable: true})
  status: string;
}



