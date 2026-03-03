import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            relations: ['usuariosAutorizados'],
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['usuariosAutorizados'],
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async create(categoryData: Partial<Category>): Promise<Category> {
        const category = this.categoriesRepository.create(categoryData);
        return this.categoriesRepository.save(category);
    }

    async update(id: string, updateData: Partial<Category>): Promise<Category> {
        const category = await this.findOne(id);

        // Handle usuariosAutorizados separately if passed as ID array
        if (updateData.usuariosAutorizados) {
            category.usuariosAutorizados = updateData.usuariosAutorizados;
        }

        Object.assign(category, { ...updateData, usuariosAutorizados: category.usuariosAutorizados });
        return this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
    }
}
