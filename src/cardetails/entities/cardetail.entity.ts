import { IsNumber, IsString } from "class-validator";
import { Brand } from "src/brand/entities/brand.entity";
import { Category } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'car_details' })
export class Cardetail {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({nullable: false })
  @IsNumber()
  categoryId: number;

  // @Column()
  // @IsNumber()
  // brandId: number;

  @Column({ nullable: true })
  @IsString()
  model: string;


  @Column({ default: true, nullable: true })
  isActive: boolean;

  @Column()
  carPicturePath: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  vin: string;

  @Column({  nullable: true })
  mileage: number;

  @Column({  nullable: false })
  country : string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerDay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerWeek: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerMonth: number;

  @Column({ type: 'decimal', nullable: true })
  power: number;

  @Column({ nullable: true })
  seats: number;

  @Column({ nullable: true })
  maxSpeed: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column('text', { nullable: true })
  remark: string;

  @Column('json')
  ImageList : string


  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // @ManyToOne(() => Brand, { nullable: false })
  // @JoinColumn({ name: 'brandId' })
  // brand: Brand;


}
