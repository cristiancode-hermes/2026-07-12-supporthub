import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private readonly repo: Repository<Customer>,
  ) {}

  async findAll(organizationId: number): Promise<Customer[]> {
    return this.repo.find({ where: { organizationId } });
  }

  async findOne(id: number, organizationId: number): Promise<Customer> {
    const customer = await this.repo.findOne({ where: { id, organizationId } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto, organizationId: number): Promise<Customer> {
    const customer = this.repo.create({ ...dto, organizationId });
    return this.repo.save(customer) as unknown as Customer;
  }

  async update(id: number, dto: UpdateCustomerDto, organizationId: number): Promise<Customer> {
    await this.findOne(id, organizationId);
    await this.repo.update({ id, organizationId }, dto);
    return this.findOne(id, organizationId);
  }

  async remove(id: number, organizationId: number): Promise<void> {
    const result = await this.repo.delete({ id, organizationId });
    if (result.affected === 0) throw new NotFoundException('Customer not found');
  }
}
