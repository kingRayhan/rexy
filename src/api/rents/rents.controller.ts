import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RentsService } from './rents.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentsService) {}

  @Post()
  create(@Body() createRentDto: CreateRentDto) {
    return this.rentsService.create(createRentDto);
  }

  @Get()
  findAll() {
    return this.rentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentsService.update(+id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentsService.remove(+id);
  }
}
