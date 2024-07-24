import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from './entities/image.entity';
import { ProductImage } from './entities/image-image.entity';
import { ProductSkuVariation } from './entities/image-sku.entity';
import { DeleteImageDto } from './dto/delete-image.dto';
export declare class ImageService {
    private readonly productRepository;
    private readonly productImageRepository;
    private readonly productSkuVariationRepository;
    constructor(productRepository: Repository<Product>, productImageRepository: Repository<ProductImage>, productSkuVariationRepository: Repository<ProductSkuVariation>);
    create(createProductDto: CreateImageDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    getTotalImages(): Promise<number>;
    getImageAttributes(limit: number, offset: number): Promise<any>;
    updateImageAttributes(productSku: string, variationSku: string, updateImageDto: UpdateImageDto): Promise<any>;
    findProductsByStatus(status: string): Promise<any[]>;
    deleteImage(deleteImageDto: DeleteImageDto): Promise<void>;
    update(id: number, updateProductDto: UpdateImageDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
