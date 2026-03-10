import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  rideId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  seatsBooked!: number;

  @IsOptional()
  @IsString()
  passengerNotes?: string;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  dropoffLocation?: string;
}
