import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  IsBoolean,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRideDto {
  @ApiProperty({ example: 'San Francisco, CA', description: 'Start location address' })
  @IsNotEmpty()
  @IsString()
  startLocation!: string;

  @ApiProperty({ example: 37.7749, required: false })
  @IsOptional()
  @IsNumber()
  startLat?: number;

  @ApiProperty({ example: -122.4194, required: false })
  @IsOptional()
  @IsNumber()
  startLng?: number;

  @ApiProperty({ example: 'Los Angeles, CA', description: 'End location address' })
  @IsNotEmpty()
  @IsString()
  endLocation!: string;

  @ApiProperty({ example: 34.0522, required: false })
  @IsOptional()
  @IsNumber()
  endLat?: number;

  @ApiProperty({ example: -118.2437, required: false })
  @IsOptional()
  @IsNumber()
  endLng?: number;

  @ApiProperty({ example: '2026-04-01T10:00:00Z', description: 'Departure date and time' })
  @IsNotEmpty()
  @IsDateString()
  departureDatetime!: string;

  @ApiProperty({ example: 3, description: 'Number of available seats', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  availableSeats!: number;

  @ApiProperty({ example: 'Driving down for the weekend, 2 bags max.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  requirePhoto?: boolean;

  @ApiProperty({ example: 4.5, required: false, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minRating?: number;
}
