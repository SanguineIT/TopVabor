import { IsEmail } from 'class-validator';
import { VisaDetail } from 'src/visa-detail/entities/visa-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  country: string;


  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  password: string;

  @Column({ nullable: true, default: 'user' })
  role: string;


  @Column({ default: true, nullable: true })
  isActive: boolean;


  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ nullable: true })
  ssoId: string;


  @Column({ type: 'varchar', default: null, nullable: true })
  provider: string;

  @OneToMany(() => VisaDetail, (visaDetail) => visaDetail.user)
  visaDetails: VisaDetail[];
}
