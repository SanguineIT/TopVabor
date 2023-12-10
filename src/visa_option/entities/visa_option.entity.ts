import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'visa_option' })
export class VisaOption {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    visaOption: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;


}
