import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../organizations/organization.entity';
import { Customer } from '../customers/customer.entity';

export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'new' })
  status: TicketStatus;

  @Column({ default: 'medium' })
  priority: TicketPriority;

  @Column({ name: 'customer_id' })
  customerId: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'assigned_to_id', type: 'int', nullable: true })
  assignedToId: number | null;

  @Column({ name: 'created_by_id' })
  createdById: number;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Organization, org => org.tickets)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'closed_at', type: 'datetime', nullable: true })
  closedAt: Date | null;
}
