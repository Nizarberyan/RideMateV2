import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-of-a-ride', description: 'ID of the ride to book' })
  @IsNotEmpty()
  @IsString()
  rideId!: string;

  @ApiProperty({ example: 1, description: 'Number of seats to book', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  seatsBooked!: number;

  @ApiProperty({ example: 'I will be at the corner with a red bag.', required: false })
  @IsOptional()
  @IsString()
  passengerNotes?: string;

  @ApiProperty({ example: 'SF Market St', required: false })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiProperty({ example: 'LA Union Station', required: false })
  @IsOptional()
  @IsString()
  dropoffLocation?: string;
}
