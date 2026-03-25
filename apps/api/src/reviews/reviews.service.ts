import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    // Verify the booking exists and the reviewer is a participant
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { ride: true },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    const isPassenger = booking.userId === reviewerId;
    const isDriver = booking.ride.driverId === reviewerId;

    if (!isPassenger && !isDriver) {
      throw new ForbiddenException("You are not a participant in this booking");
    }

    // Prevent self-review
    if (dto.targetId === reviewerId) {
      throw new BadRequestException("You cannot review yourself");
    }

    // Validate the target is the other party
    const validTarget =
      (isPassenger && booking.ride.driverId === dto.targetId) ||
      (isDriver && booking.userId === dto.targetId);

    if (!validTarget) {
      throw new BadRequestException(
        "Target must be the other party in the booking",
      );
    }

    // Create the review and atomically update the target's average rating
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          reviewerId,
          targetId: dto.targetId,
          bookingId: dto.bookingId,
          rating: dto.rating,
          comment: dto.comment,
          role: dto.role,
        },
      });

      // Recompute the target's average rating
      const agg = await tx.review.aggregate({
        where: { targetId: dto.targetId },
        _avg: { rating: true },
      });

      await tx.user.update({
        where: { id: dto.targetId },
        data: { rating: agg._avg.rating ?? 0 },
      });

      // Mark the booking as rated (from the passenger side)
      if (isPassenger) {
        await tx.booking.update({
          where: { id: dto.bookingId },
          data: { isRated: true },
        });
      }

      return review;
    });
  }

  async findForUser(targetId: string) {
    return this.prisma.review.findMany({
      where: { targetId },
      orderBy: { createdAt: "desc" },
      include: {
        reviewer: { select: { id: true, name: true, photo: true } },
      },
    });
  }
}
