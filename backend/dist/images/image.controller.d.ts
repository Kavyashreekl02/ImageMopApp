import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    getProductDetails(): Promise<any>;
    findProductsByStatus(status: string): Promise<import("./entities/image-image.entity").ProductImage[]>;
    getImageAttributes(productSku: string, variationSku: string): Promise<any>;
    updateImageAttributes(productSku: string, variationSku: string, updateImageAttributes: UpdateImageDto): Promise<import("./entities/image-image.entity").ProductImage>;
    create(createProductDto: CreateImageDto): Promise<import("./entities/image.entity").Product>;
    findAll(): Promise<import("./entities/image.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/image.entity").Product>;
    update(id: string, updateProductDto: UpdateImageDto): Promise<import("./entities/image.entity").Product>;
    remove(id: string): Promise<void>;
}
