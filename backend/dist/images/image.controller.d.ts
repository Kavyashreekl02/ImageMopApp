import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { DeleteImageDto } from './dto/delete-image.dto';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    findProductsByStatus(status: string): Promise<any[]>;
    getImageAttributes(limit?: number, offset?: number): Promise<any>;
    getTotalImages(): Promise<number>;
    updateImageAttributes(productSku: string, variationSku: string, updateImageAttributes: UpdateImageDto): Promise<any>;
    create(createProductDto: CreateImageDto): Promise<import("./entities/image.entity").Product>;
    findAll(): Promise<import("./entities/image.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/image.entity").Product>;
    update(id: string, updateProductDto: UpdateImageDto): Promise<import("./entities/image.entity").Product>;
    remove(id: string): Promise<void>;
    deleteImage(deleteImageDto: DeleteImageDto): Promise<void>;
}
