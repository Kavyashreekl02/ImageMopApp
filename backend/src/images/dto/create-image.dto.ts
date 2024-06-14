/* eslint-disable prettier/prettier */
// src/image/dto/create-image.dto.ts
export class CreateImageDto {
  fdc_product_id: string;
  name: string;
  product_image_uri: string;
  product_description: string;
  product_dimensions: string;
  price: number;
  quantity: number;
  status: string;
}
