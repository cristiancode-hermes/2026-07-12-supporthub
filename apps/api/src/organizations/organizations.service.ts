import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './organization.entity';
import { CreateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private readonly repo: Repository<Organization>,
  ) {}

  async findAll(): Promise<Organization[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Organization> {
    const org = await this.repo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    const org = this.repo.create(dto);
    return this.repo.save(org) as unknown as Organization;
  }
}
