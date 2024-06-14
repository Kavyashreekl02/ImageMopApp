import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
export declare class ImageController {
    private readonly productService;
    constructor(productService: ImageService);
    create(createProductDto: CreateImageDto): Promise<import("./entities/image.entity").Product>;
    findAll(): Promise<import("./entities/image.entity").Product[]>;
    findOne(id: string): Promise<import("./entities/image.entity").Product>;
    update(id: number, updateProductDto: UpdateImageDto): Promise<import("./entities/image.entity").Product>;
    remove(id: number): Promise<void>;
}
