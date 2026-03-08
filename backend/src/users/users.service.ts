import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private activityLogsService: ActivityLogsService,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'nombre', 'rol', 'activo', 'empresaId'] // Include empresaId
        });
    }

    async create(userData: Partial<User>, empresaId: string): Promise<User> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        // Si el empresaId viene en userData (acción de SUPER_ADMIN), usamos ese
        const targetEmpresaId = userData.empresaId || empresaId;
        const user = this.usersRepository.create({ ...userData, empresaId: targetEmpresaId });
        const saved = await this.usersRepository.save(user);
        await this.activityLogsService.log('CREATE_USER', `Usuario creado: ${user.email}`, undefined, 'USER', saved.id, targetEmpresaId);
        return saved;
    }

    async update(id: string, updateData: Partial<User>, empresaId: string, isSuperAdmin: boolean = false): Promise<User> {
        // Si es Super Admin, no filtramos por empresaId al buscar el usuario a editar
        const findOptions = isSuperAdmin ? { where: { id } } : { where: { id, empresaId } };
        const user = await this.usersRepository.findOne(findOptions);

        if (!user) throw new Error('Usuario no encontrado');

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        Object.assign(user, updateData);
        const saved = await this.usersRepository.save(user);
        await this.activityLogsService.log('UPDATE_USER', `Usuario actualizado: ${user.email}`, undefined, 'USER', id, user.empresaId);
        return saved;
    }

    async updateResetToken(id: string, token: string, expires: Date) {
        await this.usersRepository.update(id, {
            resetToken: token,
            resetTokenExpires: expires
        });
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { resetToken: token },
            select: ['id', 'resetTokenExpires']
        });
    }

    async updatePassword(id: string, passwordHash: string) {
        await this.usersRepository.update(id, {
            password: passwordHash,
            resetToken: null as any,
            resetTokenExpires: null as any
        });
    }

    async findAll(empresaId: string, isSuperAdmin: boolean = false): Promise<User[]> {
        // El Super Admin puede ver todos los usuarios si quiere (aunque solemos filtrar en el front por empresa si es necesario)
        const findOptions = isSuperAdmin ? {} : { where: { empresaId } };
        return this.usersRepository.find({
            ...findOptions,
            relations: ['empresa'],
            select: {
                id: true,
                nombre: true,
                email: true,
                rol: true,
                activo: true,
                empresaId: true,
                empresa: {
                    id: true,
                    nombre: true
                }
            }
        });
    }

    async adminUpdatePassword(id: string, newPass: string, empresaId: string, isSuperAdmin: boolean = false) {
        const findOptions = isSuperAdmin ? { where: { id } } : { where: { id, empresaId } };
        const user = await this.usersRepository.findOne(findOptions);
        if (!user) throw new Error('Usuario no encontrado');
        const passwordHash = await bcrypt.hash(newPass, 10);
        await this.activityLogsService.log('ADMIN_RESET_PASSWORD', `Contraseña reseteada para el usuario: ${user.email}`, undefined, 'USER', id, user.empresaId);
        return this.updatePassword(id, passwordHash);
    }

    async count(empresaId: string, isSuperAdmin: boolean = false): Promise<number> {
        const where = isSuperAdmin ? {} : { empresaId };
        return this.usersRepository.count({ where });
    }
}
