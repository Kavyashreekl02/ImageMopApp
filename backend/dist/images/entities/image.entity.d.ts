import { ProductImage } from './image-image.entity';
import { ProductSkuVariation } from './image-sku.entity';
export declare class Product {
    sgid: number;
    name: string;
    product_image_uri: string;
    product_description: string;
    product_dimensions: string;
    created_at: Date;
    updated_at: Date;
    price: number;
    quantity: number;
    status: string;
    productImages: ProductImage[];
    productSkuVariations: ProductSkuVariation[];
}
