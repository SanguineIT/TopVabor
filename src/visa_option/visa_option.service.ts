import { Injectable } from '@nestjs/common';
import { CreateVisaOptionDto } from './dto/create-visa_option.dto';
import { UpdateVisaOptionDto } from './dto/update-visa_option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VisaOption } from './entities/visa_option.entity';
import { Repository } from 'typeorm';
import { WriteResponse } from 'src/shared/response';

@Injectable()
export class VisaOptionService {
  constructor(
    @InjectRepository(VisaOption)
    private readonly visaOptionRepo: Repository<VisaOption>,
  ){}
  // Create
  async create(createVisaOptionDto: CreateVisaOptionDto):Promise<any> {
    try{
      if(!createVisaOptionDto.id || createVisaOptionDto.id == 0){
        const visaOpt = await this.findByVisaOptionName(createVisaOptionDto.visaOption);
        if(visaOpt){
          return WriteResponse(400,false,'This Visa Option is Already exists')
        }else{
          const isSave = await this.visaOptionRepo.create(createVisaOptionDto);
          const data = await this.visaOptionRepo.save(isSave);
          return WriteResponse(200, data, 'Visa Option create successfully.')
        }
      }else{
        return await this.update(createVisaOptionDto.id,createVisaOptionDto)
      }
    }catch(err){
      console.log(err);
      return WriteResponse(500,false,err.message);
    }
  }
  async findByVisaOptionName(visaOption: string) {
    return await this.visaOptionRepo.findOne({
      where: {
        visaOption: visaOption,
      },
    });
  }

// Update
async update(id: number, updateVisaOptionDto: UpdateVisaOptionDto){
try{
const visaOpt = await this.visaOptionRepo.findOne({where: {id, isDeleted:false}});
if(!visaOpt){
  return WriteResponse(400, false,'Visa Option Not Found');
}
const visaOption = updateVisaOptionDto.visaOption;
const existingVisaOption = await this.findByVisaOptionName(visaOption);
if(existingVisaOption && existingVisaOption.id !== visaOpt.id){
  return WriteResponse(400, false, 'This Visa Option is Already exists');
}
const isUpdate = await this.visaOptionRepo.update(id,updateVisaOptionDto);
return WriteResponse(200, false, 'This Visa Option update successfully')
}catch(err){
  return WriteResponse(500, false, err.message);
}
}

// getAll

 async findAll() {
const isExisting = await this.visaOptionRepo
.createQueryBuilder('visaOption')
    .orderBy('visaOption','ASC')
    .where('visaOption.isDeleted = false')
    .getMany();  
    if(isExisting.length == 0){
      return WriteResponse(400, false, 'Record Not Found');
    }
    return WriteResponse(200, isExisting, 'Seccess')
  }
// GetOne
  async findOne(id: number):Promise<any> {
    const isExisting = await this.visaOptionRepo.findOne({ 
      where: { id:id, isDeleted: false } 
    })
    if(!isExisting){
      return WriteResponse(400, false,'Record Not found');
    }
    return WriteResponse(200, isExisting, 'Seccess')
  }

  async remove(id: number) {
    const isExisting = await this.visaOptionRepo.findOne({
      where: { id:id, isDeleted: false },
    })
    if(!isExisting){
      return WriteResponse(400, false,'Record Not Found');
    }
    try{
await this.visaOptionRepo.update(id,{isDeleted: true });
return WriteResponse(200, false,'Visa Option Deleted Successfully')
    }catch(err){
      return WriteResponse(500, false, err.message);
    }
  }
}
