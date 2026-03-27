import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsEnum,
  IsOptional,
} from "class-validator";

export enum ReviewRole {
  DRIVER = "DRIVER",
  PASSENGER = "PASSENGER",
}

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  bookingId!: string;

  @IsNotEmpty()
  @IsString()
  targetId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsNotEmpty()
  @IsEnum(ReviewRole)
  role!: ReviewRole;
}
