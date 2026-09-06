import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Organization } from '../organizations/organization.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: 'agent' })
  role: string;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @ManyToOne(() => Organization, org => org.users)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn()
  createdAt: Date;
}
