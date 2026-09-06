import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => require('./user.entity').User, (user: any) => user.organization)
  users: any[];

  @OneToMany(() => require('../customers/customer.entity').Customer, (customer: any) => customer.organization)
  customers: any[];

  @OneToMany(() => require('../tickets/ticket.entity').Ticket, (ticket: any) => ticket.organization)
  tickets: any[];
}
