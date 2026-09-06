import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { Ticket } from '../tickets/ticket.entity';
import { Customer } from '../customers/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Customer])],
  controllers: [DashboardController],
})
export class DashboardModule {}
