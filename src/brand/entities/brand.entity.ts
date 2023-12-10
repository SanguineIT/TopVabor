import { Cardetail } from 'src/cardetails/entities/cardetail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({name : 'brand'})
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  brandName: string;
  @Column()
  brandImage: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // @OneToMany(() => Cardetail, (carDetail) => carDetail.brand)
  // carDetails: Cardetail[];
}
