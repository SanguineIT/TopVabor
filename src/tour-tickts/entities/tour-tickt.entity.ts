import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'tour_tickts' })
export class TourTickt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tourName:string;

    @Column()
    title:string;

    @Column()
    picturePath:string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price:number;

    @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
