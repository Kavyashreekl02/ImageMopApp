import { Product } from './image.entity';
import { ProductSkuVariation } from './image-sku.entity';
export declare class ProductImage {
    sgid: number;
    sku_variation: string;
    image_name: string;
    created_at: Date;
    updated_at: Date;
    alt_text: string;
    skuVariation: ProductSkuVariation;
    product: Product;
}
