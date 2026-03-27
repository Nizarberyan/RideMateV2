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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@ApiTags("Rides")
@Controller("rides")
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new ride' })
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createRideDto: CreateRideDto,
  ) {
    return this.ridesService.create(req.user.id, createRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get rides created by the current user' })
  findAllByUser(@Request() req: AuthenticatedRequest) {
    return this.ridesService.findAllByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search and filter all available rides' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  findAll(
    @Request() req: AuthenticatedRequest,
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
      userId: req.user.id,
    });
  }

  @Get(":id/route")
  @ApiOperation({ summary: 'Get the route for a specific ride' })
  getRoute(@Param("id") id: string) {
    return this.ridesService.getRoute(id);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get details of a specific ride' })
  findOne(@Param("id") id: string) {
    return this.ridesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a ride' })
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateRideDto: UpdateRideDto,
  ) {
    return this.ridesService.update(id, req.user.id, updateRideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/cancel")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a ride' })
  cancelRide(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.ridesService.cancelRide(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/complete")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a ride as completed' })
  completeRide(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.ridesService.completeRide(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a ride' })
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.ridesService.remove(id, req.user.id);
  }
}
