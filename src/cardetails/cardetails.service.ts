import { Injectable } from '@nestjs/common';
import { CreateCardetailDto } from './dto/create-cardetail.dto';
import { UpdateCardetailDto } from './dto/update-cardetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cardetail } from './entities/cardetail.entity';
import { Repository } from 'typeorm';
import { WriteResponse, paginateResponse } from 'src/shared/response';
import { Category } from 'src/category/entities/category.entity';
import { join } from 'path';
import { serverUrl } from 'src/constent';

@Injectable()
export class CardetailsService {
  constructor(
    @InjectRepository(Cardetail)
    private readonly carDetailsRepo: Repository<Cardetail>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async create(createCardetailDto: CreateCardetailDto): Promise<any> {
    try {
      const maxPricePerDay = 999999.99;
      if(createCardetailDto.pricePerDay > maxPricePerDay ){
        return WriteResponse(400,false,'Price Per Day less then 999999.99')
      }
      const maxSeats = 10;
      if(createCardetailDto.seats > maxSeats ){
        return WriteResponse(400,false,'seats must not be greater than 10')
      }
      if (createCardetailDto.id == 0) { 
       
        const newCardetail = this.carDetailsRepo.create(createCardetailDto);
      const data = await this.carDetailsRepo.save(newCardetail);
      return WriteResponse(200, data,'Car Create successfully');
    }
    return await this.update(createCardetailDto.id, createCardetailDto);
    } catch (error) {
      console.log(error)
      return WriteResponse(500, false);
    }
  }

  async update(id: number, createCardetailDto: CreateCardetailDto): Promise<any> {
    const existingCardetail = await this.carDetailsRepo.findOne({
      where: { id:id,isDeleted:false },
    });
    if (!existingCardetail) {
      return WriteResponse(400, false, 'Record not found.');
    }
    try {
      await this.carDetailsRepo.update(id, createCardetailDto);
      return WriteResponse(200, true, 'Car Details updated successfully.');
    } catch (error) {
      // console.log(error);
      return WriteResponse(500, false,error.message);
    }
  }
  // Create
  // async create(createCardetailDto: CreateCardetailDto): Promise<any> {
  //   try {
  //     if (createCardetailDto.id == 0) {
  //       const car = await this.findByModel(createCardetailDto.model);
  //       if (car) {
  //         return WriteResponse(400, false, 'Car Model is Already Exists.')
  //       } else {
  //         const isSave = await this.carDetailsRepo.create(createCardetailDto);
  //         const data = await this.carDetailsRepo.save(isSave);
  //         return WriteResponse(200, data, 'Car Create Sucessfully.');
  //       }
  //     } else {
  //       return await this.update(createCardetailDto.id, createCardetailDto)
  //     }

  //   } catch (error) {
  //     return WriteResponse(500, false, 'Somthing went wrong.');
  //   }
  // }

  // Update
  // async update(id: number, updateCardetailDto: UpdateCardetailDto) {
  //   try {
  //     const car = await this.carDetailsRepo.findOne({
  //       where: { id: id, isDeleted: false }
  //     });
  //     if (!car) {
  //       return WriteResponse(400, false, 'Record Not Found');
  //     }
  //     const model = updateCardetailDto.model;
  //     const existingCar = await this.findByModel(model);
  //     if (existingCar && existingCar.id != car.id) {
  //       return WriteResponse(400, false, 'Car Model is Already Exists.');
  //     }
  //     const isUpdate = await this.carDetailsRepo.update(id, updateCardetailDto);
  //     return WriteResponse(200, true, 'Car Update Seccessfully')
  //   } catch (error) {
  //     return WriteResponse(500, false, 'Something went wrong.');
  //   }

  // }
  // function for search for a car in database based on its model.
  async findByModel(model: string) {
    return await this.carDetailsRepo.findOne({
      where: {
        model: model,
      },
    });
  }

  // GetAll
  async findAll() {
    const isExisting = await this.carDetailsRepo
    .createQueryBuilder('car')
    .leftJoinAndSelect('car.category', 'category')
    // .leftJoinAndSelect('car.brand', 'brand')
    .where('car.isDeleted = false and car.isActive = true ')
    .where('car.isActive=true')
    .getMany();
  
    if (isExisting.length == 0) {
      return WriteResponse(400, false, 'Record Not Found.');
    }
    isExisting.map((i : any ) => {
      i['CarpicturePathUrl'] = `${serverUrl}cardetail/${i.carPicturePath}`;
      i['categoryPicture'] = `${serverUrl}category/${i['category'].picturePath}`;
     });
    return WriteResponse(200, isExisting, 'Seccess')
  }

  // GetOne
  async findOne(id: number) {
    const isExisting = await this.carDetailsRepo.findOne({
      where: { id: id, isDeleted: false,isActive:true },
      relations:['category']
    });
    if (!isExisting) {
      return WriteResponse(400, false, 'Record Not Found.')
    }
   
    let imagePathArray = []
    isExisting.ImageList =  JSON.parse(isExisting?.ImageList)
    if(isExisting['ImageList']?.length > 0){
      for(let j=0;j<isExisting['ImageList'].length;j++){
       console.log(isExisting.id)
       console.log('image lsit ', isExisting['ImageList'])
       console.log(imagePathArray , 'imagePathArray')
       imagePathArray.push(`${serverUrl}cardetail/${isExisting['ImageList'][j]}`)
      }
   } 
   isExisting['ImagesPitcher'] = imagePathArray
   isExisting['CarpicturePathUrl'] = `${serverUrl}cardetail/${isExisting.carPicturePath}`;
   isExisting['categoryPicture'] = `${serverUrl}category/${isExisting['category'].picturePath}`;
  
    return WriteResponse(200, isExisting, 'Seccess')
  }

  //Car Status
  async updateStatus({ status, carId }): Promise<any> {
    const car = await this.carDetailsRepo.findOne({
      where: { id: carId, isDeleted: false },
    });
    if (!car) {
      return WriteResponse(400, false, 'Car not found.');
    }
    const update = await this.carDetailsRepo.update(
      { id: carId },
      { isActive: status },
    );
    // console.log(status);
    return WriteResponse(200, true, 'Car status updated successfully.');
  }
  // Delete
  async remove(id: number) {
    const isExisting = await this.carDetailsRepo.findOne({
      where: { id: id, isDeleted: false },
    });
    if (!isExisting) {
      return WriteResponse(400, false, 'Record Not Found.');
    }
    try {
      await this.carDetailsRepo.update(id, { isDeleted: true });
      return WriteResponse(200, true, 'Record Deleted Successfully')
    } catch (error) {
      return WriteResponse(500, error.message)
    }
  }
  // Pagination
  async pagination(pagination) {
    try {
      const { curPage, perPage,direction,sortBy:ob } = pagination;
      console.log(ob)
      const orderBy:any = direction ? direction == "asc" ? "ASC" : "DESC" : "ASC" ;
      const model = pagination.whereClause.find(
        (p: any) => p.key === 'model' && p.value,
      );
      const year = pagination.whereClause.find(
        (p: any) => p.key === 'year' && p.value,
      )
      const vin = pagination.whereClause.find(
        (p: any) => p.key === 'vin' && p.value,
      )
      const mileage = pagination.whereClause.find(
        (p: any) => p.key === 'mileage' && p.value,
      )
      const pricePerDay = pagination.whereClause.find(
        (p: any) => p.key === 'pricePerDay' && p.value,
      )
      const pricePerWeek = pagination.whereClause.find(
        (p: any) => p.key === 'pricePerWeek' && p.value,
      )
      const pricePerMonth = pagination.whereClause.find(
        (p: any) => p.key === 'pricePerMonth' && p.value,
      )
      const power = pagination.whereClause.find(
        (p: any) => p.key === 'power' && p.value,
      )
      const seats = pagination.whereClause.find(
        (p: any) => p.key === 'seats' && p.value,
      )
      const maxSpeed = pagination.whereClause.find(
        (p: any) => p.key === 'maxSpeed' && p.value,
      )

      const country = pagination.whereClause.find(
        (p: any) => p.key === 'country' && p.value,
      )
      const categoryId = pagination.whereClause.find(
        (p: any) => p.key === 'categoryId' && p.value,
      )

      const categoryName = pagination.whereClause.find(
        (p:any) => p.key === 'categoryName' && p.value,
      );

      const all = pagination.whereClause.find(
        (p: any) => p.key === 'all' && p.value,
      )

      const builder = this.carDetailsRepo.createQueryBuilder('f');
      let lwhereClause = 'f.isDeleted = 0 and f.isActive = 1';

      if (model) {
        lwhereClause += ` and f.model like  '${model.value}'`;
      }
      if (year) {
        lwhereClause += ` and f.year like '${year.value}'`;
      }
      if (vin) {
        lwhereClause += ` and f.vin like '${vin.value}'`;
      }
      if (mileage) {
        lwhereClause += ` and f.mileage like '${mileage.value}'`;
      }
      if (pricePerDay) {
        lwhereClause += ` and f.pricePerDay like '${pricePerDay.value}'`;
      }

      if (pricePerWeek) {
        lwhereClause += ` and f.pricePerWeek like '${pricePerWeek.value}'`;
      }
      if (pricePerMonth) {
        lwhereClause += ` and f.pricePerMonth like '${pricePerMonth.value}'`;
      }
      if (power) {
        lwhereClause += ` and f.power like '${power.value}'`;
      }
      if (seats) {
        lwhereClause += ` and f.seats like '${seats.value}'`;
      }
      if (maxSpeed) {
        lwhereClause += ` and f.maxSpeed like '${maxSpeed.value}'`;
      }

      if (country) {
        lwhereClause += ` and f.country like  '${country.value}'`;
      }

      if (categoryId) {
        lwhereClause += ` and f.categoryId = ${categoryId.value}`;
      }
      if(categoryName){
        lwhereClause += ` and c.categoryName like '${categoryName.value}'`;      
      }


      if (all) {
        lwhereClause += ` AND (f.model like '%${all.value}%' OR f.country like '%${all.value}%' OR f.pricePerDay like '%${all.value}%' OR f.seats like '%${all.value}%' OR f.categoryId like '%${all.value}%' OR c.categoryName like '%${all.value}%')`;
      }

      let skip = (curPage - 1) * perPage;
      let query = await builder
      .leftJoinAndSelect('f.category', 'c', 'c.isDeleted=false')
      // .leftJoinAndSelect('f.brand','b', 'c.isDeleted=false')
        .where(lwhereClause)
        .skip(skip)
        .take(perPage);

        if(ob == "price" || ob == "pricePerDay"){
          console.log("enter")
         query = query.orderBy('f.pricePerDay',orderBy)
        }

      let [list, count] = await query
        .addOrderBy('f.createdAt', 'DESC')
        .getManyAndCount();
        list.map((i : any) => {
          let imagePathArray = []
          i.ImageList =  JSON.parse(i?.ImageList)
          i['CarpicturePathUrl'] = `${serverUrl}cardetail/${i.carPicturePath}`;
          i['categoryPicture'] = `${serverUrl}category/${i['category'].picturePath}`;
          if(i['ImageList']?.length > 0){
             for(let j=0;j<i['ImageList'].length;j++){
              // console.log(i.id)
              // console.log('image lsit ', i['ImageList'])
              // console.log(imagePathArray , 'imagePathArray')
              imagePathArray.push(`${serverUrl}cardetail/${i['ImageList'][j]}`)
             }
          } 
          
          i.imagePathArray = imagePathArray
        });
      return paginateResponse(list , count);
    } catch (error) {
      throw error;
    }
  }
// Admin Pagination
async Adminpagination(pagination) {
  try {
    const { curPage, perPage,direction,sortBy:ob } = pagination;
    console.log(ob)
    const orderBy:any = direction ? direction == "asc" ? "ASC" : "DESC" : "ASC" ;
    const model = pagination.whereClause.find(
      (p: any) => p.key === 'model' && p.value,
    );
    const year = pagination.whereClause.find(
      (p: any) => p.key === 'year' && p.value,
    )
    const vin = pagination.whereClause.find(
      (p: any) => p.key === 'vin' && p.value,
    )
    const mileage = pagination.whereClause.find(
      (p: any) => p.key === 'mileage' && p.value,
    )
    const pricePerDay = pagination.whereClause.find(
      (p: any) => p.key === 'pricePerDay' && p.value,
    )
    const pricePerWeek = pagination.whereClause.find(
      (p: any) => p.key === 'pricePerWeek' && p.value,
    )
    const pricePerMonth = pagination.whereClause.find(
      (p: any) => p.key === 'pricePerMonth' && p.value,
    )
    const power = pagination.whereClause.find(
      (p: any) => p.key === 'power' && p.value,
    )
    const seats = pagination.whereClause.find(
      (p: any) => p.key === 'seats' && p.value,
    )
    const maxSpeed = pagination.whereClause.find(
      (p: any) => p.key === 'maxSpeed' && p.value,
    )

    const country = pagination.whereClause.find(
      (p: any) => p.key === 'country' && p.value,
    )
    const categoryId = pagination.whereClause.find(
      (p: any) => p.key === 'categoryId' && p.value,
    )

    const categoryName = pagination.whereClause.find(
      (p:any) => p.key === 'categoryName' && p.value,
    );

    const all = pagination.whereClause.find(
      (p: any) => p.key === 'all' && p.value,
    )

    const builder = this.carDetailsRepo.createQueryBuilder('f');
    let lwhereClause = 'f.isDeleted = 0';

    if (model) {
      lwhereClause += ` and f.model like  '${model.value}'`;
    }
    if (year) {
      lwhereClause += ` and f.year like '${year.value}'`;
    }
    if (vin) {
      lwhereClause += ` and f.vin like '${vin.value}'`;
    }
    if (mileage) {
      lwhereClause += ` and f.mileage like '${mileage.value}'`;
    }
    if (pricePerDay) {
      lwhereClause += ` and f.pricePerDay like '${pricePerDay.value}'`;
    }

    if (pricePerWeek) {
      lwhereClause += ` and f.pricePerWeek like '${pricePerWeek.value}'`;
    }
    if (pricePerMonth) {
      lwhereClause += ` and f.pricePerMonth like '${pricePerMonth.value}'`;
    }
    if (power) {
      lwhereClause += ` and f.power like '${power.value}'`;
    }
    if (seats) {
      lwhereClause += ` and f.seats like '${seats.value}'`;
    }
    if (maxSpeed) {
      lwhereClause += ` and f.maxSpeed like '${maxSpeed.value}'`;
    }

    if (country) {
      lwhereClause += ` and f.country like  '${country.value}'`;
    }

    if (categoryId) {
      lwhereClause += ` and f.categoryId = ${categoryId.value}`;
    }
    if(categoryName){
      lwhereClause += ` and c.categoryName like '${categoryName.value}'`;      
    }


    if (all) {
      lwhereClause += ` AND (f.model like '%${all.value}%' OR f.country like '%${all.value}%' OR f.pricePerDay like '%${all.value}%' OR f.seats like '%${all.value}%' OR f.categoryId like '%${all.value}%' OR c.categoryName like '%${all.value}%')`;
    }

    let skip = (curPage - 1) * perPage;
    let query = await builder
    .leftJoinAndSelect('f.category', 'c', 'c.isDeleted=false')
    // .leftJoinAndSelect('f.brand','b', 'c.isDeleted=false')
      .where(lwhereClause)
      .skip(skip)
      .take(perPage);

      if(ob == "price" || ob == "pricePerDay"){
        console.log("enter")
       query = query.orderBy('f.pricePerDay',orderBy)
      }

    let [list, count] = await query
      .addOrderBy('f.createdAt', 'DESC')
      .getManyAndCount();
      list.map((i : any) => {
        let imagePathArray = []
        i.ImageList =  JSON.parse(i?.ImageList)
        i['CarpicturePathUrl'] = `${serverUrl}cardetail/${i.carPicturePath}`;
        i['categoryPicture'] = `${serverUrl}category/${i['category'].picturePath}`;
        if(i['ImageList']?.length > 0){
           for(let j=0;j<i['ImageList'].length;j++){
            // console.log(i.id)
            // console.log('image lsit ', i['ImageList'])
            // console.log(imagePathArray , 'imagePathArray')
            imagePathArray.push(`${serverUrl}cardetail/${i['ImageList'][j]}`)
           }
        } 
        
        i.imagePathArray = imagePathArray
      });
    return paginateResponse(list , count);
  } catch (error) {
    throw error;
  }
}

}
