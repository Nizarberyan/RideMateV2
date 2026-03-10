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

  @IsNotEmpty()
  @IsString()
  endLocation!: string;

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
