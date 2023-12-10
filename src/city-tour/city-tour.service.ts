import { Injectable } from '@nestjs/common';
import { CreateCityTourDto } from './dto/create-city-tour.dto';
import { UpdateCityTourDto } from './dto/update-city-tour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CityTour } from './entities/city-tour.entity';
import { Repository } from 'typeorm';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { serverUrl } from 'src/constent';
import { IPagination } from 'src/shared/paginationEum';

@Injectable()
export class CityTourService {
  constructor(
    @InjectRepository(CityTour)
    private readonly cityTourRepo: Repository<CityTour>,

  ){}
// async create(createCityTourDto: createCityTourDto):Promise<any> {
// try{
//   if(createCityTourDto.id == 0){
//     const cityTour = await this.findByCityTourName(createCityTourDto.tourName);
//     if(cityTour){
//       return WriteResponse(400,false, 'This City Tour is Already exists');
//     }else{
//       const isSave = await this.cityTourRepo.create(createCityTourDto);
//       const data = await this.cityTourRepo.save(isSave);
//       return WriteResponse(200, data,'City Tour Create successfully')
//     }
//   }else{
//     return await this.update(createCityTourDto.id,createCityTourDto);
//   }
// }catch(err){
//   return WriteResponse(500, false,err.message);
// }
//   }
//   async findByCityTourName(tourName: string) {
//     return await this.cityTourRepo.findOne({
//       where: {
//         tourName: tourName,
//       },
//     });
//   }
// Update
// async update(id:number, updateCityTourDto:UpdateCityTourDto){
// try{
// const cityTour = await this.cityTourRepo.findOne({
//   where:{ id,isDeleted:false},
// });
// if(!cityTour){
//   return WriteResponse(400,false,'Record Not Found');
// }
// const tourName = updateCityTourDto.tourName;
// const existingCityName = await this.findByCityTourName(tourName);
// if(existingCityName && existingCityName.id !== cityTour.id){
//   return WriteResponse(400, false, 'This City Tour is Already exists')
// }
// const isUpdate = await this.cityTourRepo.update(id,updateCityTourDto);
// return WriteResponse(200, true, 'City Tour Update successfully')
// }catch(err){
//   return WriteResponse(500, false, err.message);
// }
// }


//Create-Update


async create(createCityTourDto: CreateCityTourDto): Promise<any> {
  try {
    if (!createCityTourDto.id || createCityTourDto.id == 0) {
      // Treat it as a create operation
      let isExitsTour = await this.findByCityTourName(createCityTourDto.citytourName);
      if (isExitsTour) {
        return WriteResponse(
          400,
          false,
          'Tour Already exists with city tour name',
        );
      }
      const newTour = this.cityTourRepo.create(createCityTourDto);
      const data = await this.cityTourRepo.save(newTour);
      return WriteResponse(200, data, 'Tour Create Successfully');
    }
    // If id is provided, treat it as an update operation
    return await this.update(createCityTourDto.id, createCityTourDto);
  } catch (error) {
    console.log(error);
    return WriteResponse(500, false);
  }
}

async update(id: number, updateCityTourDto: UpdateCityTourDto): Promise<any> {
  try {
    let isExitsTour = await this.findByCityTourName(updateCityTourDto.citytourName);
    const existingTour = await this.cityTourRepo.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!existingTour) {
      return WriteResponse(400, false, 'Record not found.');
    }
    if (isExitsTour) {
      if (isExitsTour.id != id) {
        return WriteResponse(
          400,
          false,
          'Tour Already exists with City name',
        );
      }
    }
    await this.cityTourRepo.update(id, updateCityTourDto);
    return WriteResponse(200, true, 'city tour updated successfully.');
  } catch (error) {
    console.log(error);

    return WriteResponse(500, false);
  }
}
async findByCityTourName(citytourName: string) {
      return await this.cityTourRepo.findOne({
        where: {
          citytourName: citytourName,
        },
      });
    }
async findAll() {
  const isExisting = await this.cityTourRepo
  .createQueryBuilder('citytourName')
      .orderBy('citytourName','ASC')
      .where('citytourName.isDeleted = false')
      .getMany();  
      if(isExisting.length == 0){
        return WriteResponse(400, false, 'Record Not Found');
      }
      isExisting.map((i) => {
        i['picturePathUrl'] = `${serverUrl}cityTour/${i.picturePath}`;
      });
      
      return WriteResponse(200, isExisting, 'Record Found Seccessfully')
    }

  // async findOne(id: number) {
  // const isExisting = await this.cityTourRepo.findOne({
  //   where: { id:id, isDeleted:false },
  // })
  // if(!isExisting){

  // }
  // }
  async findOne(id: number):Promise<any> {
    const isExisting = await this.cityTourRepo.findOne({ 
      where: { id:id, isDeleted: false } 
    })
    if(!isExisting){
      return WriteResponse(400, false,'Record Not found');
    }
    isExisting['picturePathUrl'] = `${serverUrl}cityTour/${isExisting.picturePath}`;
    return WriteResponse(200, isExisting, 'Record Found Seccessfully')
  }

  async remove(id: number) {
   const isExisting = await this .cityTourRepo.findOne({
    where: { id: id, isDeleted:false },
   })
   if(!isExisting){
    return WriteResponse(400, false, 'Record Not Found');
   }
   try{
await this.cityTourRepo.update(id,{isDeleted:true});
return WriteResponse(200, true,'Record Deleted Successfully')
   }catch(error){
    return WriteResponse(500, false, error.message)
   }
  }

  //Pagination
  async pagination(pagination: IPagination) {
    const { curPage, perPage } = pagination;
    const citytourName = pagination.whereClause.find(
      (p: any) => p.key === 'citytourName' && p.value,
    );
    const cityName = pagination.whereClause.find(
      (p: any) => p.key === 'cityName' && p.value,
    );
    const country = pagination.whereClause.find(
      (p: any) => p.key === 'country' && p.value,
    );
    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    );
    const builder = this.cityTourRepo.createQueryBuilder('f');
    let lwhereClause = 'f.isDeleted = 0';
    if (citytourName) {
      lwhereClause += ` and f. citytourName like '${citytourName.value}'`;
    }
    if (cityName) {
      lwhereClause += ` and f.cityName like '${cityName.value}'`;
    }
    if (country) {
      lwhereClause += ` and f.country like '${country.value}'`;
    }
    if (all) {
      lwhereClause += ` AND (f.citytourName like '%${all.value}%' OR f.cityName like '%${all.value}%' OR f.country like '%${all.value}%')`;
    }
    const skip = (curPage - 1) * perPage;
    let [list, count] = await builder
      .where(lwhereClause)
      .skip(skip)
      .take(perPage)
      .orderBy('f.createdAt', 'DESC')
      .getManyAndCount();

    list.map((i) => {
      i['picturePathUrl'] = `${serverUrl}cityTour/${i.picturePath}`;
    });

    return paginateResponse(list, count);
  }
}
