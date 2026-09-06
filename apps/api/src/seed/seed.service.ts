import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Organization } from '../organizations/organization.entity';
import { User } from '../organizations/user.entity';
import { Customer } from '../customers/customer.entity';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Organization) private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
  ) {}

  async seed(): Promise<void> {
    const existing = await this.orgRepo.findOne({ where: { slug: 'acme-corp' } });
    if (existing) {
      console.log('Database already seeded.');
      return;
    }

    const org = await this.orgRepo.save(
      this.orgRepo.create({ name: 'Acme Corp', slug: 'acme-corp' }),
    ) as unknown as Organization;

    const globalOrg = await this.orgRepo.save(
      this.orgRepo.create({ name: 'Globex Inc', slug: 'globex-inc' }),
    ) as unknown as Organization;

    const hash = (pw: string) => crypto.createHash('sha256').update(pw).digest('hex');

    const admin = await this.userRepo.save(
      this.userRepo.create({ email: 'admin@acme.com', name: 'Admin User', password: hash('password123'), organizationId: org.id, role: 'admin' }),
    ) as unknown as User;

    const agent = await this.userRepo.save(
      this.userRepo.create({ email: 'agent@acme.com', name: 'Support Agent', password: hash('password123'), organizationId: org.id, role: 'agent' }),
    ) as unknown as User;

    const customersData = [
      { name: 'John Smith', email: 'john@example.com', phone: '+1-555-0101' },
      { name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1-555-0102' },
      { name: 'Mike Wilson', email: 'mike@example.com', phone: '+1-555-0103' },
      { name: 'Emily Davis', email: 'emily@example.com', phone: '+1-555-0104' },
      { name: 'Robert Brown', email: 'robert@example.com', phone: '+1-555-0105' },
    ];

    const customers: Customer[] = [];
    for (const data of customersData) {
      const customer = await this.customerRepo.save(
        this.customerRepo.create({ ...data, organizationId: org.id }),
      ) as unknown as Customer;
      customers.push(customer);
    }

    const ticketsData = [
      { title: 'Cannot login to dashboard', description: 'User receives "Invalid credentials" error when trying to login with correct password.', priority: 'high' as const, customerIdx: 0, status: 'new' as const },
      { title: 'Invoice payment not reflecting', description: 'Paid invoice #INV-2024-089 but payment status still shows "pending".', priority: 'urgent' as const, customerIdx: 1, status: 'in_progress' as const },
      { title: 'Feature request: Dark mode', description: 'Would love to have a dark mode option for the dashboard interface.', priority: 'low' as const, customerIdx: 2, status: 'new' as const },
      { title: 'Data export taking too long', description: 'Exporting project data with date range filter takes over 5 minutes.', priority: 'medium' as const, customerIdx: 0, status: 'assigned' as const },
      { title: 'Mobile layout broken on iOS', description: 'Navigation menu overlaps with content on iPhone 15 Safari browser.', priority: 'high' as const, customerIdx: 3, status: 'in_progress' as const },
      { title: 'Password reset email not sent', description: 'Clicked "Forgot password" but never received the reset email.', priority: 'urgent' as const, customerIdx: 4, status: 'new' as const },
      { title: 'API rate limit too aggressive', description: 'Our integration keeps hitting rate limits with only 100 requests/minute.', priority: 'medium' as const, customerIdx: 1, status: 'resolved' as const },
      { title: 'Search results not accurate', description: 'Searching for specific project names returns unrelated results.', priority: 'medium' as const, customerIdx: 2, status: 'closed' as const },
      { title: 'Notification settings not saving', description: 'Changes to email notification preferences are not persisted after logout.', priority: 'high' as const, customerIdx: 3, status: 'new' as const },
      { title: 'Team member invitation broken', description: 'Invite link expires immediately after sending. New users cannot join organization.', priority: 'urgent' as const, customerIdx: 4, status: 'assigned' as const },
    ];

    for (const t of ticketsData) {
      await this.ticketRepo.save(
        this.ticketRepo.create({
          title: t.title,
          description: t.description,
          priority: t.priority,
          status: t.status === 'resolved' || t.status === 'closed' ? t.status : t.status,
          customerId: customers[t.customerIdx].id,
          organizationId: org.id,
          createdById: admin.id,
          assignedToId: t.status === 'assigned' || t.status === 'in_progress' ? agent.id : null,
          closedAt: t.status === 'closed' || t.status === 'resolved' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        }),
      );
    }

    console.log('Seed data created successfully!');
    console.log(`  Organizations: 2 (Acme Corp, Globex Inc)`);
    console.log(`  Users: 2 (admin, agent)`);
    console.log(`  Customers: ${customers.length}`);
    console.log(`  Tickets: ${ticketsData.length}`);
  }
}
