import { Cardetail } from "src/cardetails/entities/cardetail.entity";
import { TourTickt } from "src/tour-tickts/entities/tour-tickt.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum PaymentStatus {
    Approve = 'Approve',
    Pending = 'Pending',
    Reject = 'Reject'
  }

export enum BookingFor {
    Car = 'Car',
    Trip = 'Trip',
    CityTrip = 'CityTrip',
}  

@Entity('carbooking')
export class CarBooking {
    @PrimaryGeneratedColumn()
    id : 0 
    
    @Column()
    Place : string 

    @Column()
    startDate : Date 
   
    @Column()
    endDate : Date 

    @Column()
    UserId : number 

    @Column()
    CarId : number 

    @CreateDateColumn()
    CreatedAt : Date

    @UpdateDateColumn()
    UpdatedAt : Date 

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: 'Reject'
      })
      PaymnetStatus : PaymentStatus 

    @Column({
        type : 'enum',
        enum : BookingFor })
    BookingType : BookingFor

    @Column()
    DrivingLicence : string

    @Column()
    totalAmount : number

    @Column()
    deductedAmount : number

    @Column()
    remainingAmount : number

    @Column()
    TourId : number

    @Column()
    TickedQty : number
 
    @ManyToOne(()=> TourTickt , { nullable : false})
    @JoinColumn({ name : 'TourId'})
    TourDetails : TourTickt;

    @ManyToOne(() => Cardetail, { nullable: false })
    @JoinColumn({ name: 'CarId' })
    cardetail: Cardetail;
    
    @ManyToOne(()=> User , { nullable: false})
    @JoinColumn({ name : 'UserId'})
    user : User
  
}
