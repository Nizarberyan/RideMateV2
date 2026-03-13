import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  Role,
  RideStatus,
  BookingStatus,
} from "../src/generated/prisma/enums.js";
// Import types from client.js
import type { User, Ride } from "../src/generated/prisma/client.js";
import * as bcrypt from "bcrypt";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CITIES = [
  "San Francisco", "San Jose", "Oakland", "Berkeley", "Palo Alto", 
  "Mountain View", "Sunnyvale", "Santa Clara", "Fremont", "Hayward",
  "San Mateo", "Redwood City", "Los Angeles", "San Diego", "Sacramento"
];

const VEHICLES = [
  { model: "Tesla Model 3", color: "Silver" },
  { model: "Tesla Model Y", color: "White" },
  { model: "Hyundai Ioniq 5", color: "Matte Gray" },
  { model: "Toyota Prius", color: "Blue" },
  { model: "Honda Civic", color: "Black" },
  { model: "Ford Mustang Mach-E", color: "Red" },
  { model: "Chevrolet Bolt", color: "Green" },
  { model: "Volkswagen ID.4", color: "White" },
  { model: "Nissan Leaf", color: "Gray" },
  { model: "BMW i4", color: "Dark Blue" },
];

const NAMES = [
  "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis",
  "David Wilson", "Eve Martinez", "Frank Miller", "Grace Taylor", "Henry Anderson",
  "Ivy Thomas", "Jack Jackson", "Kelly White", "Liam Harris", "Mia Martin",
  "Noah Thompson", "Olivia Garcia", "Paul Robinson", "Quinn Clark", "Ryan Lewis"
];

function getRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🚀 Starting seeding process...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // 1. Create Users (20 users)
  console.log("👤 Creating users...");
  const users: User[] = [];
  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i];
    const email = `${name.toLowerCase().replace(/\s/g, ".")}@example.com`;
    
    // Half of the users have vehicles
    const hasVehicle = i < NAMES.length / 2;
    const vehicle = hasVehicle ? getRandom(VEHICLES) : null;

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: i === 0 ? Role.ADMIN : Role.USER,
        carbonSavedKg: getRandomInt(0, 50),
        bio: `I am ${name} and I love sharing rides!`,
        city: getRandom(CITIES),
        vehicleModel: vehicle?.model,
        vehicleColor: vehicle?.color,
        vehiclePlate: hasVehicle ? `RM-${getRandomInt(1000, 9999)}` : null,
      },
    });
    users.push(user as User);
  }

  // Add a known test user
  const testUser = await prisma.user.create({
    data: {
      email: "jane@example.com",
      password,
      name: "Jane User",
      role: Role.USER,
      carbonSavedKg: 15.5,
      city: "San Francisco",
      vehicleModel: "Tesla Model S",
      vehicleColor: "Red",
      vehiclePlate: "TEST-123",
    }
  });
  users.push(testUser as User);

  // 2. Create Rides (50 rides)
  console.log("🚗 Creating rides...");
  const rides: Ride[] = [];
  const drivers = users.filter(u => u.vehicleModel);
  
  for (let i = 0; i < 50; i++) {
    const driver = getRandom(drivers);
    const startCity = getRandom(CITIES);
    let endCity = getRandom(CITIES);
    while (endCity === startCity) {
      endCity = getRandom(CITIES);
    }

    // Departure dates spread over next 10 days
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + getRandomInt(1, 10));
    departureDate.setHours(getRandomInt(6, 22), getRandomInt(0, 59), 0, 0);

    const ride = await prisma.ride.create({
      data: {
        driverId: driver.id,
        startLocation: startCity,
        endLocation: endCity,
        departureDatetime: departureDate,
        availableSeats: getRandomInt(1, 4),
        status: RideStatus.ACTIVE,
        description: `Driving from ${startCity} to ${endCity}. Join me!`,
        distanceKm: getRandomInt(10, 200),
      },
    });
    rides.push(ride as Ride);
  }

  // 3. Create Bookings (100 bookings)
  console.log("🎟️ Creating bookings...");
  for (let i = 0; i < 100; i++) {
    const passenger = getRandom(users);
    const ride = getRandom(rides);

    // Don't book own ride
    if (ride.driverId === passenger.id) continue;

    // Check if ride already has this passenger
    const existing = await prisma.booking.findFirst({
      where: { userId: passenger.id, rideId: ride.id }
    });
    if (existing) continue;

    try {
      await prisma.booking.create({
        data: {
          userId: passenger.id,
          rideId: ride.id,
          seatsBooked: 1,
          status: getRandom([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
          pickupLocation: "Main Station",
          dropoffLocation: "City Center",
        },
      });
    } catch (e) {
      // Ignore if seats full or other constraints
    }
  }

  console.log("✅ Seeding completed successfully!");
  console.log(`- Created ${users.length} users`);
  console.log(`- Created ${rides.length} rides`);
  console.log("- Created many bookings");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
