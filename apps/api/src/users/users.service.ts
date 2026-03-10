import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, Prisma } from "../generated/prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        ridesAsDriver: true,
        bookings: { include: { ride: true } },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(`Updating user ${id} with:`, updateUserDto);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
