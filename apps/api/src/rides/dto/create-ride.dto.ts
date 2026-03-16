import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateRideDto {
  @IsNotEmpty()
  @IsString()
  startLocation!: string;

  @IsOptional()
  @IsNumber()
  startLat?: number;

  @IsOptional()
  @IsNumber()
  startLng?: number;

  @IsNotEmpty()
  @IsString()
  endLocation!: string;

  @IsOptional()
  @IsNumber()
  endLat?: number;

  @IsOptional()
  @IsNumber()
  endLng?: number;

  @IsNotEmpty()
  @IsDateString()
  departureDatetime!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  availableSeats!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;
}
