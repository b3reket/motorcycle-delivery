import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserEntity) private readonly userRepo:Repository<UserEntity>
    ) {}

    async register (registerDto: RegisterDto) {
        const existingUser = await this.userRepo.findOne({
            where: [
                {email: registerDto.email},
                {phone: registerDto.phone}
            ]
        })

        if( existingUser ) {
            throw new ConflictException('A user with this email or phone already exists')
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 12)

        const user = await this.userRepo.create({
            name: registerDto.name.trim(),
            email: registerDto.email.trim().toLowerCase(),
            phone: registerDto.phone.trim(),
            passwordHash,
        })

        const savedUser = this.userRepo.save(user)

        return {
        id: (await savedUser).id,
        name: (await savedUser).name,
        email: (await savedUser).email,
        phone: (await savedUser).phone,
        createdAt: (await savedUser).createdAt,
        }
        
    }
}
