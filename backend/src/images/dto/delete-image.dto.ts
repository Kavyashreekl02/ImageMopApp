/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteImageDto {
  @IsNotEmpty()
  @IsString()
  productSku: string;

  @IsNotEmpty()
  @IsString()
  variationSku: string;

  @IsNotEmpty()
  @IsString()
  imageName: string;
}

