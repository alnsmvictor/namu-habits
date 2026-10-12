import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const userExists = await this.usersRepository.findOneBy({ email });

    if (userExists) {
      throw new ConflictException('E-mail j\u00e1 cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      name: dto.name.trim(),
      email,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      message: 'Conta criada com sucesso',
      user: this.getPublicUser(savedUser),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('E-mail ou senha inv\u00e1lidos');
    }

    return {
      message: 'Login realizado com sucesso',
      user: this.getPublicUser(user),
    };
  }

  private getPublicUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
