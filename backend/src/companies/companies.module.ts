
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { Empresa } from '../entities/empresa.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Empresa, User, Project])],
    controllers: [CompaniesController],
    providers: [CompaniesService],
    exports: [CompaniesService],
})
export class CompaniesModule { }
