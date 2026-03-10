import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRideDto } from "./dto/create-ride.dto";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RidesService {
  constructor(private prisma: PrismaService) {}

  async create(driverId: string, createRideDto: CreateRideDto) {
    return this.prisma.ride.create({
      data: {
        ...createRideDto,
        departureDatetime: new Date(createRideDto.departureDatetime),
        driverId,
      },
    });
  }

  async findAllByUser(driverId: string) {
    return this.prisma.ride.findMany({
      where: { driverId },
      include: {
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, photo: true },
            },
          },
        },
      },
    });
  }

  async findAll(filters?: { from?: string; to?: string; date?: string; city?: string }) {
    const where: any = {
      status: 'ACTIVE',
    };

    if (filters?.from) {
      where.startLocation = { contains: filters.from, mode: 'insensitive' };
    }
    if (filters?.to) {
      where.endLocation = { contains: filters.to, mode: 'insensitive' };
    }
    if (filters?.date) {
      const searchDate = new Date(filters.date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      where.departureDatetime = {
        gte: searchDate,
        lt: nextDay,
      };
    }
    
    // If no filters, and a city is provided, prioritize rides from that city
    if (!filters?.from && !filters?.to && !filters?.date && filters?.city) {
      where.startLocation = { contains: filters.city, mode: 'insensitive' };
    }

    return this.prisma.ride.findMany({
      where,
      take: 20,
      orderBy: { departureDatetime: 'asc' },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            photo: true,
            vehicleModel: true,
            vehicleColor: true,
            vehiclePlate: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            photo: true,
            bio: true,
            carbonSavedKg: true,
            vehicleModel: true,
            vehicleColor: true,
            vehiclePlate: true,
          },
        },
      },
    });
    if (!ride) throw new NotFoundException("Ride not found");
    return ride;
  }

  async update(id: string, driverId: string, updateRideDto: UpdateRideDto) {
    const ride = await this.findOne(id);
    if (ride.driverId !== driverId) {
      throw new NotFoundException("Not authorized to update this ride");
    }

    const data: any = { ...updateRideDto };
    if (updateRideDto.departureDatetime) {
      data.departureDatetime = new Date(updateRideDto.departureDatetime);
    }

    return this.prisma.ride.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, driverId: string) {
    const ride = await this.findOne(id);
    if (ride.driverId !== driverId) {
      throw new NotFoundException("Not authorized to delete this ride");
    }

    return this.prisma.ride.delete({
      where: { id },
    });
  }
}
