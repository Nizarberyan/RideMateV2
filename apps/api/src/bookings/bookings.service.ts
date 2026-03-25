import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { PrismaService } from "../prisma/prisma.service";

type BookingWithRide = {
  id: string;
  userId: string;
  rideId: string;
  seatsBooked: number;
  status: string;
  ride: { driverId: string; [key: string]: unknown };
  [key: string]: unknown;
};

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // Use a transaction to atomically check seats, create booking, and decrement seats
    return this.prisma.$transaction(async (tx) => {
      const ride = await tx.ride.findUnique({
        where: { id: createBookingDto.rideId },
      });

      if (!ride) throw new NotFoundException("Ride not found");

      // Prevent booking your own ride
      if (ride.driverId === userId) {
        throw new ForbiddenException("You cannot book your own ride");
      }

      // Fetch passenger details for restriction checks
      const passenger = await tx.user.findUnique({
        where: { id: userId },
        select: { photo: true, rating: true },
      });

      if (!passenger) throw new NotFoundException("Passenger not found");

      // Enforce restrictions
      if (ride.requirePhoto && !passenger.photo) {
        throw new ForbiddenException(
          "This driver requires a profile photo to book",
        );
      }

      if (ride.minRating && passenger.rating < ride.minRating) {
        throw new ForbiddenException(
          `This driver requires a minimum rating of ${ride.minRating} to book`,
        );
      }

      // Check for duplicate booking
      const existing = await tx.booking.findFirst({
        where: { userId, rideId: createBookingDto.rideId },
      });
      if (existing) {
        throw new BadRequestException("You have already booked this ride");
      }

      if (ride.availableSeats < createBookingDto.seatsBooked) {
        throw new BadRequestException("Not enough seats available");
      }

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          ...createBookingDto,
          userId,
          status: "PENDING",
        },
      });

      // Atomically decrement seats
      await tx.ride.update({
        where: { id: createBookingDto.rideId },
        data: { availableSeats: { decrement: createBookingDto.seatsBooked } },
      });

      return booking;
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                photo: true,
                vehicleModel: true,
                vehicleColor: true,
              },
            },
          },
        },
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
    const booking = (await this.findOne(id)) as BookingWithRide;
    if (booking.userId !== userId && booking.ride.driverId !== userId) {
      throw new ForbiddenException("Not authorized");
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  /** Passenger cancels their booking — soft-cancels and restores seats */
  async remove(id: string, userId: string) {
    const booking = await this.findOne(id);

    if (booking.userId !== userId) {
      throw new ForbiddenException("Not authorized to cancel this booking");
    }

    if (booking.status === "CANCELLED") {
      throw new BadRequestException("Booking is already cancelled");
    }

    return this.prisma.$transaction(async (tx) => {
      // Soft-cancel instead of hard delete
      const updated = await tx.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      // Restore the seats to the ride
      await tx.ride.update({
        where: { id: booking.rideId },
        data: { availableSeats: { increment: booking.seatsBooked } },
      });

      return updated;
    });
  }

  /** Driver confirms a pending booking */
  async confirm(id: string, driverId: string) {
    const booking = (await this.findOne(id)) as BookingWithRide;
    if (booking.ride.driverId !== driverId) {
      throw new ForbiddenException("Only the driver can confirm bookings");
    }
    if (booking.status !== "PENDING") {
      throw new BadRequestException(
        `Booking is already ${booking.status.toLowerCase()}`,
      );
    }
    return this.prisma.booking.update({
      where: { id },
      data: { status: "CONFIRMED" },
    });
  }

  /** Driver rejects / cancels a pending booking — restores seats */
  async reject(id: string, driverId: string) {
    const booking = (await this.findOne(id)) as BookingWithRide;
    if (booking.ride.driverId !== driverId) {
      throw new ForbiddenException("Only the driver can reject bookings");
    }
    if (booking.status === "CANCELLED") {
      throw new BadRequestException("Booking is already cancelled");
    }
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      await tx.ride.update({
        where: { id: booking.rideId },
        data: { availableSeats: { increment: booking.seatsBooked } },
      });
      return updated;
    });
  }
}
