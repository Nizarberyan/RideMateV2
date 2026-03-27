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
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags("Bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking for a ride' })
  create(@Request() req: any, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  findAll(@Request() req: any) {
    return this.bookingsService.findAllByUser(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get details of a specific booking' })
  findOne(@Param("id") id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: 'Update a booking' })
  update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, req.user.id, updateBookingDto);
  }

  @Post(":id/confirm")
  @ApiOperation({ summary: 'Confirm a booking (for ride owners)' })
  confirm(@Request() req: any, @Param("id") id: string) {
    return this.bookingsService.confirm(id, req.user.id);
  }

  @Post(":id/reject")
  @ApiOperation({ summary: 'Reject a booking (for ride owners)' })
  reject(@Request() req: any, @Param("id") id: string) {
    return this.bookingsService.reject(id, req.user.id);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete/Cancel a booking' })
  remove(@Request() req: any, @Param("id") id: string) {
    return this.bookingsService.remove(id, req.user.id);
  }
}
