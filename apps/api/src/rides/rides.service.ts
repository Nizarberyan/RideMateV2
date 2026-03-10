import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRideDto } from "./dto/create-ride.dto";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RidesService {
  constructor(private prisma: PrismaService) {}

  async create(driverId: number, createRideDto: CreateRideDto) {
    return this.prisma.ride.create({
      data: {
        ...createRideDto,
        departureDatetime: new Date(createRideDto.departureDatetime),
        driverId,
      },
    });
  }

  async findAll() {
    return this.prisma.ride.findMany({
      include: {
        driver: {
          select: { id: true, name: true, photo: true },
        },
      },
    });
  }

  async findOne(id: number) {
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
          },
        },
      },
    });
    if (!ride) throw new NotFoundException("Ride not found");
    return ride;
  }

  async update(id: number, driverId: number, updateRideDto: UpdateRideDto) {
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

  async remove(id: number, driverId: number) {
    const ride = await this.findOne(id);
    if (ride.driverId !== driverId) {
      throw new NotFoundException("Not authorized to delete this ride");
    }

    return this.prisma.ride.delete({
      where: { id },
    });
  }
}
