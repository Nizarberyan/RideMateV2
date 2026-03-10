import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  Role,
  RideStatus,
  BookingStatus,
} from "../src/generated/prisma/enums.js";
import * as bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      password,
      name: "John Doe",
      role: Role.USER,
      carbonSavedKg: 12.5,
      bio: "Loves carpooling!",
      vehicleModel: "Tesla Model 3",
      vehicleColor: "Silver",
      vehiclePlate: "RD-MT-2026",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      password,
      name: "Jane Smith",
      role: Role.USER,
      carbonSavedKg: 8.2,
      bio: "Daily commuter from SF to SJ.",
      vehicleModel: "Hyundai Ioniq 5",
      vehicleColor: "Matte Gray",
      vehiclePlate: "ECO-FRND",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@ridemate.com",
      password,
      name: "Admin User",
      role: Role.ADMIN,
    },
  });

  // Create Rides
  const ride1 = await prisma.ride.create({
    data: {
      driverId: user1.id,
      startLocation: "San Francisco",
      endLocation: "San Jose",
      departureDatetime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      availableSeats: 3,
      status: RideStatus.ACTIVE,
      description: "Leaving at 8 AM, sharp.",
      distanceKm: 75,
    },
  });

  const ride2 = await prisma.ride.create({
    data: {
      driverId: user2.id,
      startLocation: "Oakland",
      endLocation: "San Francisco",
      departureDatetime: new Date(Date.now() + 48 * 60 * 60 * 1000), // day after tomorrow
      availableSeats: 4,
      status: RideStatus.ACTIVE,
      description: "Morning commute, have space for 4.",
      distanceKm: 15,
    },
  });

  // Create Bookings
  await prisma.booking.create({
    data: {
      userId: user2.id,
      rideId: ride1.id,
      seatsBooked: 1,
      status: BookingStatus.CONFIRMED,
      pickupLocation: "Market St",
      dropoffLocation: "Downtown San Jose",
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
