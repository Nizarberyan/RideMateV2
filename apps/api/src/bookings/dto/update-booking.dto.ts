import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateBookingDto } from "./create-booking.dto";
import { IsEnum, IsOptional } from "class-validator";
import { BookingStatus } from "../../generated/prisma/client";

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ enum: BookingStatus, required: false, example: BookingStatus.PENDING })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}
