import { Cardetail } from "src/cardetails/entities/cardetail.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoryName: string;

    @Column({nullable:false})
    picturePath: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToMany(() => Cardetail, (carDetail) => carDetail.category)
    carDetails: Cardetail[];
}
