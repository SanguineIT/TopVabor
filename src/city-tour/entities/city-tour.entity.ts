import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'city_tour'})
export class CityTour {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    citytourName: string;

    @Column()
    cityName: string;

    @Column()
    country:string;

    @Column()
    picturePath:string;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;
}
