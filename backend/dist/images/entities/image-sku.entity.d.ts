import { Product } from './image.entity';
import { ProductImage } from './image-image.entity';
export declare class ProductSkuVariation {
    sgid: number;
    product_id: string;
    sku_variation: string;
    image_name: string;
    created_at: Date;
    updated_at: Date;
    alt_text: string;
    product: Product;
    productImages: ProductImage[];
}
