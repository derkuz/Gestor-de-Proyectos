import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: string, updateData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
}
