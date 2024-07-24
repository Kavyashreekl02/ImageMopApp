import { ProductSkuVariation } from './image-sku.entity';
export declare class ProductImage {
    sgid: number;
    sku_variation_id: number;
    image: string;
    alt_text: string;
    is_default: string;
    sort_order: string;
    created_at: Date;
    updated_at: Date;
    status: string;
    skuVariation: ProductSkuVariation;
}
