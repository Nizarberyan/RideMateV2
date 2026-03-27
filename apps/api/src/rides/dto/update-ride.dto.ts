import { PartialType, ApiProperty } from "@nestjs/swagger";
import { CreateRideDto } from "./create-ride.dto";
import { IsEnum, IsOptional } from "class-validator";
import { RideStatus } from "../../generated/prisma/client";

export class UpdateRideDto extends PartialType(CreateRideDto) {
  @ApiProperty({
    enum: RideStatus,
    required: false,
    example: RideStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(RideStatus)
  status?: RideStatus;
}
