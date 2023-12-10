import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarBooking } from 'src/car-booking/entities/car-booking.entity';
import { Cardetail } from 'src/cardetails/entities/cardetail.entity';
import { Category } from 'src/category/entities/category.entity';
import { Settings } from 'src/settings/entities/Settings.entity';
import { WriteResponse } from 'src/shared/response';
import { TourTickt } from 'src/tour-tickts/entities/tour-tickt.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    
    @InjectRepository(Settings)
    private readonly SettingsRepository: Repository<Settings>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cardetail)
    private readonly carDetailsRepo: Repository<Cardetail>,
    @InjectRepository(TourTickt)
    private readonly TourTicktRepo: Repository<TourTickt>,
    @InjectRepository(CarBooking)
    private readonly CarBookingRepo: Repository<CarBooking>
  ) {}
  async findAllCount() {
    try{
      // const setting = await this.SettingsRepository.countBy({isDeleted:false});
      const Totalcategory = await this.categoryRepo.countBy({isDeleted:false});
      const Totaluser = await this.userRepository.count({
where:{
  role:"user",
  isDeleted:false
}
        
      })
      const Totalcar = await this.carDetailsRepo.countBy({isDeleted:false});
      const TotaltourTicket = await this.TourTicktRepo.countBy({isDeleted:false});
      const TotalcarBooking = await this.CarBookingRepo.countBy({})

      return WriteResponse(200,{Totalcategory,Totaluser,Totalcar,TotaltourTicket,TotalcarBooking});

    }catch(error){
      return WriteResponse(500, false, 'Somthing Went Wrong')
    }
  }
  // async getAllTerms(){
  //   try{
  
  //   }catch(err){
  //     return WriteResponse(200 , )
  //   }
  // }
}
