import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto, UpdateTicketDto, TicketFilterDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private readonly repo: Repository<Ticket>,
  ) {}

  async findAll(organizationId: number, filter?: TicketFilterDto): Promise<Ticket[]> {
    const where: any = { organizationId };
    if (filter?.status) where.status = filter.status;
    if (filter?.priority) where.priority = filter.priority;
    if (filter?.assignedToId) where.assignedToId = filter.assignedToId;
    return this.repo.find({ where, relations: { customer: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number, organizationId: number): Promise<Ticket> {
    const ticket = await this.repo.findOne({ where: { id, organizationId }, relations: { customer: true } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(dto: CreateTicketDto, organizationId: number, createdById: number): Promise<Ticket> {
    const ticket = this.repo.create({
      ...dto,
      organizationId,
      createdById,
      status: 'new',
    });
    return this.repo.save(ticket) as unknown as Ticket;
  }

  async update(id: number, dto: UpdateTicketDto, organizationId: number): Promise<Ticket> {
    await this.findOne(id, organizationId);
    
    const updateData: any = { ...dto };
    if (dto.status === 'closed' || dto.status === 'resolved') {
      updateData.closedAt = new Date();
    }
    
    await this.repo.update({ id, organizationId }, updateData);
    return this.findOne(id, organizationId);
  }

  async remove(id: number, organizationId: number): Promise<void> {
    const result = await this.repo.delete({ id, organizationId });
    if (result.affected === 0) throw new NotFoundException('Ticket not found');
  }
}
