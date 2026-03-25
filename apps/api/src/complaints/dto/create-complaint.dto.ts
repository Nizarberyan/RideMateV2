import { IsNotEmpty, IsString } from "class-validator";

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  bookingId!: string;

  @IsNotEmpty()
  @IsString()
  targetId!: string;

  @IsNotEmpty()
  @IsString()
  reason!: string;
}
