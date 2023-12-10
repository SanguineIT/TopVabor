import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'carcolors'})
export class Carcolor {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    colorId: number;
    @Column()
    carId: number;
    @Column()
    picturePath: string;
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;
}
