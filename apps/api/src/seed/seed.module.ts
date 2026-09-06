import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Organization } from '../organizations/organization.entity';
import { User } from '../organizations/user.entity';
import { Customer } from '../customers/customer.entity';
import { Ticket } from '../tickets/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Customer, Ticket])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
