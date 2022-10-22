import { PartialType } from '@nestjs/swagger';
import { CreateRentDto } from './create-rent.dto';

export class UpdateRentDto extends PartialType(CreateRentDto) {}
