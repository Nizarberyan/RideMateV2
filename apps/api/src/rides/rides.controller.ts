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
  Query,
} from "@nestjs/common";
import { RidesService } from "./rides.service";
import { CreateRideDto } from "./dto/create-ride.dto";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@Controller("rides")
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createRideDto: CreateRideDto,
  ) {
    return this.ridesService.create(req.user.id, createRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mine")
  findAllByUser(@Request() req: AuthenticatedRequest) {
    return this.ridesService.findAllByUser(req.user.id);
  }

  @Get()
  findAll(
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("date") date?: string,
    @Query("city") city?: string,
    @Query("lat") lat?: string,
    @Query("lng") lng?: string,
    @Query("radius") radius?: string,
  ) {
    return this.ridesService.findAll({
      from,
      to,
      date,
      city,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radius: radius ? parseFloat(radius) : undefined,
    });
  }

  @Get(":id/route")
  getRoute(@Param("id") id: string) {
    return this.ridesService.getRoute(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ridesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateRideDto: UpdateRideDto,
  ) {
    return this.ridesService.update(id, req.user.id, updateRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.ridesService.remove(id, req.user.id);
  }
}
