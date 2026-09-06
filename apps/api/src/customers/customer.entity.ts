import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../organizations/organization.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Organization, org => org.customers)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
