import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Length } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_visa_details' })
export class VisaDetail {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  userId: number;

  @Column()
  @IsString()
  visaOption: string;

  @Column({ nullable: true })
  @IsString()
  visaNumber: string;

  @Column({ nullable: true })
  issueDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  @IsString()
  country: string;

  @Column({ nullable: true, default: 'pending' })
  status: string;

    @Column()
    remarks:string;

    @Column()
    passportImagePath: string;

  @Column()
  userPhotoPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
