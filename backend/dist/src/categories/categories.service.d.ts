import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
export declare class CategoriesService {
    private categoriesRepository;
    constructor(categoriesRepository: Repository<Category>);
    findAll(): Promise<Category[]>;
    findOne(id: string): Promise<Category>;
    create(categoryData: Partial<Category>): Promise<Category>;
    update(id: string, updateData: Partial<Category>): Promise<Category>;
    remove(id: string): Promise<void>;
}
