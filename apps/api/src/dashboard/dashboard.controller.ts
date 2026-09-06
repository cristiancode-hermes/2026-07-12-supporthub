import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Ticket } from '../tickets/ticket.entity';
import { Customer } from '../customers/customer.entity';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard KPIs for current organization' })
  async getStats(@Req() req: Request) {
    const orgId = (req.user as any).organizationId;

    const totalTickets = await this.ticketRepo.count({ where: { organizationId: orgId } });
    const openTickets = await this.ticketRepo.count({ where: { organizationId: orgId, status: 'new' } });
    const inProgress = await this.ticketRepo.count({ where: { organizationId: orgId, status: 'in_progress' } });
    const resolvedTickets = await this.ticketRepo.count({ where: { organizationId: orgId, status: 'resolved' } });
    const urgentTickets = await this.ticketRepo.count({ where: { organizationId: orgId, priority: 'urgent', status: 'new' } });
    const totalCustomers = await this.customerRepo.count({ where: { organizationId: orgId } });

    const tickets = await this.ticketRepo.find({ where: { organizationId: orgId } });
    const closedWithTime = tickets.filter(t => t.closedAt && t.createdAt);
    let avgResolutionHours = 0;
    if (closedWithTime.length > 0) {
      const totalHours = closedWithTime.reduce((sum, t) => {
        return sum + (new Date(t.closedAt!).getTime() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Math.round(totalHours / closedWithTime.length);
    }

    const byStatus = await this.ticketRepo
      .createQueryBuilder('t')
      .select('t.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('t.organizationId = :orgId', { orgId })
      .groupBy('t.status')
      .getRawMany();

    const byPriority = await this.ticketRepo
      .createQueryBuilder('t')
      .select('t.priority', 'priority')
      .addSelect('COUNT(*)', 'count')
      .where('t.organizationId = :orgId', { orgId })
      .groupBy('t.priority')
      .getRawMany();

    return {
      totalTickets,
      openTickets,
      inProgress,
      resolvedTickets,
      urgentTickets,
      totalCustomers,
      avgResolutionHours,
      byStatus,
      byPriority,
    };
  }
}
