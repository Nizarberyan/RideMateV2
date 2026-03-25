import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateComplaintDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { ride: true },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    const isPassenger = booking.userId === reporterId;
    const isDriver = booking.ride.driverId === reporterId;

    if (!isPassenger && !isDriver) {
      throw new ForbiddenException("You are not a participant in this booking");
    }

    return this.prisma.complaint.create({
      data: {
        reporterId,
        targetId: dto.targetId,
        bookingId: dto.bookingId,
        reason: dto.reason,
      },
    });
  }

  async findMine(reporterId: string) {
    return this.prisma.complaint.findMany({
      where: { reporterId },
      orderBy: { createdAt: "desc" },
      include: {
        target: { select: { id: true, name: true, photo: true } },
        booking: { include: { ride: true } },
      },
    });
  }
}
