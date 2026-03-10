import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { RidesService } from "./rides.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("rides")
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createRideDto: CreateRideDto) {
    return this.ridesService.create(req.user.id, createRideDto);
  }

  @Get()
  findAll() {
    return this.ridesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ridesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() updateRideDto: UpdateRideDto,
  ) {
    return this.ridesService.update(+id, req.user.id, updateRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req: any, @Param("id") id: string) {
    return this.ridesService.remove(+id, req.user.id);
  }
}
