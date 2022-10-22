import { Injectable } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Injectable()
export class RentsService {
  create(createRentDto: CreateRentDto) {
    return 'This action adds a new rent';
  }

  findAll() {
    return `This action returns all rents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rent`;
  }

  update(id: number, updateRentDto: UpdateRentDto) {
    return `This action updates a #${id} rent`;
  }

  remove(id: number) {
    return `This action removes a #${id} rent`;
  }
}
