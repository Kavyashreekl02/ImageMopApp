import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Product } from './entities/image.entity';
import { ProductImage } from './entities/image-image.entity';
export declare class ImageService {
    private readonly productRepository;
    private readonly productImageRepository;
    constructor(productRepository: Repository<Product>, productImageRepository: Repository<ProductImage>);
    create(createProductDto: CreateImageDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    getProductDetails(): Promise<any>;
    getImageAttributes(productSku: string, variationSku: string): Promise<any>;
    updateImageAttributes(productSku: string, variationSku: string, updateImageDto: UpdateImageDto): Promise<ProductImage>;
    findProductsByStatus(status: string): Promise<ProductImage[]>;
    update(id: number, updateProductDto: UpdateImageDto): Promise<Product>;
    remove(id: number): Promise<void>;
}
