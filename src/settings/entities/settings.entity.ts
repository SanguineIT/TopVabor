import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  settingName:string;

  @Column()
  settingValue: string;

  @Column({ default: false })
  isDeleted: boolean;
}
