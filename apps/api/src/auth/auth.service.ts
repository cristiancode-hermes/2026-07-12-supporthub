import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User } from '../organizations/user.entity';
import { Organization } from '../organizations/organization.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
    private readonly jwtService: JwtService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterDto): Promise<{ token: string; user: Partial<User> }> {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const slug = dto.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let org = await this.orgRepo.findOne({ where: { slug } });
    if (!org) {
      org = this.orgRepo.create({ name: dto.organizationName, slug });
      org = await this.orgRepo.save(org) as unknown as Organization;
    }

    const user = this.userRepo.create({
      email: dto.email,
      name: dto.name,
      password: this.hashPassword(dto.password),
      organizationId: org.id,
      role: 'agent',
    });
    const saved = await this.userRepo.save(user) as unknown as User;
    const token = this.jwtService.sign({ sub: saved.id, email: saved.email, organizationId: org.id });
    const { password, ...userWithoutPassword } = saved;
    return { token, user: userWithoutPassword };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || user.password !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, email: user.email, organizationId: user.organizationId });
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
