import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: createBookingDto.rideId },
    });
    if (!ride) throw new NotFoundException("Ride not found");

    if (ride.availableSeats < createBookingDto.seatsBooked) {
      throw new BadRequestException("Not enough seats available");
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        ride: true,
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        ride: true,
        user: { select: { id: true, name: true, photo: true } },
      },
    });
    if (!booking) throw new NotFoundException("Booking not found");
    return booking;
  }

  async update(id: string, userId: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.findOne(id);
    // User can update their own booking or driver can update the status
    if (booking.userId !== userId && (booking.ride as any).driverId !== userId) {
      throw new NotFoundException("Not authorized");
    }

    // Simple implementation for MVP
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto as any,
    });
  }

  async remove(id: string, userId: string) {
    const booking = await this.findOne(id);
    if (booking.userId !== userId) {
      throw new NotFoundException("Not authorized to cancel this booking");
    }

    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
