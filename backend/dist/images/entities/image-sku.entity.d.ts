import { Product } from './image.entity';
import { ProductImage } from './image-image.entity';
export declare class ProductSkuVariation {
    sgid: number;
    product_id: number;
    sku: string;
    asset_value: number;
    created_at: Date;
    updated_at: Date;
    product: Product;
    productImages: ProductImage[];
}
