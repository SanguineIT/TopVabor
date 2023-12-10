import { Injectable } from '@nestjs/common';
import { CreateCarcolorDto } from './dto/create-carcolor.dto';
import { UpdateCarcolorDto } from './dto/update-carcolor.dto';
import { Carcolor } from './entities/carcolor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WriteResponse } from 'src/shared/response';

@Injectable()
export class CarcolorsService {
  constructor( 
    @InjectRepository(Carcolor)
  private readonly carColorRepository: Repository<Carcolor>,){}
  async create(createCarcolorDto: CreateCarcolorDto) {
      try{
          if(createCarcolorDto.id == 0){
            let createCarcolors = await this.carColorRepository.create(createCarcolorDto);
            let carColors = await this.carColorRepository.save(createCarcolors);
            if(carColors){
              return WriteResponse(200,carColors,"carcolor Created Successfully");
            }else{
              return WriteResponse(400,false,"Recored Not Created");
            }
          }else{
            let updateCarColors = await this.carColorRepository.update({id : createCarcolorDto.id},createCarcolorDto);
            if (updateCarColors.affected > 0) {
              return WriteResponse(200, true, 'CarColors Updated Successfully');
            } else {
              return WriteResponse(400, false, 'CarColor Not Updated');
            }
          }
      }catch(e){
        return WriteResponse(400,false,e.message)
      }
  }

  async findAll() {
    let allColorsCar = await this.carColorRepository.find({where : {isDeleted : false}});
    if(allColorsCar.length > 0){
      return WriteResponse(200,allColorsCar,"Record Found Successfully");
    }else{
      return WriteResponse(400,false,"Record Not Found");
    }
  }

  async findOne(id: number) {
    let carColor = await this.carColorRepository.findOne({where : {id : id, isDeleted : false}});
    if(carColor){
      return WriteResponse(200,carColor,"Record Found Successfully");
    }else{
      return WriteResponse(400,false,"Record Not Found");
    }
  }

  // update(id: number, updateCarcolorDto: UpdateCarcolorDto) {
  //   return `This action updates a #${id} carcolor`;
  // }
  async getByCarId(id:number){
    let carColorsOfCar = await this.carColorRepository.find({where : {carId : id,isDeleted :false}});
    if(carColorsOfCar.length > 0){
      return WriteResponse(200,carColorsOfCar,"Records Found Successfully");
    }else{
      return WriteResponse(400,false,"Records Not Found");
    }
  }
 async remove(id: number) {
    try {
      let updateCarColors = await this.carColorRepository.update(id, {
        isDeleted: true,
      });
      if (updateCarColors.affected == 0) {
        return WriteResponse(400, false, 'Record Not Found');
      }
      return WriteResponse(200, true, 'Record Deleted Successfully');
    } catch (e) {
      return WriteResponse(400, false, e.message);
    }
  }
}
