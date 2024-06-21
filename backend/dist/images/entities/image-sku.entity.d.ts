import { Product } from './image.entity';
export declare class ProductSkuVariation {
    sgid: number;
    sku_variation: string;
    image_name: string;
    created_at: Date;
    updated_at: Date;
    alt_text: string;
    product: Product;
}
