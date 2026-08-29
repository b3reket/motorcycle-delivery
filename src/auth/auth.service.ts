import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(UserEntity) 
        private readonly userRepo:Repository<UserEntity>,
        private readonly jwtService: JwtService
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

    async validateUser(loginDto: LoginDto) {
        const email = loginDto.email.trim().toLowerCase()

        const user = await this.userRepo.findOne({
            where: { email }
        })

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(loginDto.password, user.passwordHash)

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        
        const payload = {
            sub: user.id,
        }

        const accessToken = await this.jwtService.signAsync(payload)

        return {accessToken}
    }

    async getMe(userId: string) {

    const user = await this.userRepo.findOne({
        where: { id: userId },
    });

    if (!user) {
        throw new UnauthorizedException('User no longer exists');
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
    };

    }
}
