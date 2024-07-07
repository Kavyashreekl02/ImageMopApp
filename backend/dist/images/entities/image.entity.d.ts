import { ProductImage } from './image-image.entity';
import { ProductSkuVariation } from './image-sku.entity';
export declare class Product {
    sgid: number;
    name: string;
    sku: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    productImages: ProductImage[];
    productSkuVariations: ProductSkuVariation[];
}
