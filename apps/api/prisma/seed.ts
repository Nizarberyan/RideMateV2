import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  Role,
  RideStatus,
  BookingStatus,
  ReviewRole,
  ComplaintStatus,
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
  "San Francisco",
  "San Jose",
  "Oakland",
  "Berkeley",
  "Palo Alto",
  "Mountain View",
  "Sunnyvale",
  "Santa Clara",
  "Fremont",
  "Hayward",
  "San Mateo",
  "Redwood City",
  "Los Angeles",
  "San Diego",
  "Sacramento",
];

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  Oakland: { lat: 37.8044, lng: -122.2712 },
  Berkeley: { lat: 37.8715, lng: -122.273 },
  "Palo Alto": { lat: 37.4419, lng: -122.143 },
  "Mountain View": { lat: 37.3861, lng: -122.0839 },
  Sunnyvale: { lat: 37.3688, lng: -122.0363 },
  "Santa Clara": { lat: 37.3541, lng: -121.9552 },
  Fremont: { lat: 37.5485, lng: -121.9886 },
  Hayward: { lat: 37.6688, lng: -122.0808 },
  "San Mateo": { lat: 37.563, lng: -122.3255 },
  "Redwood City": { lat: 37.4852, lng: -122.2364 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  Sacramento: { lat: 38.5816, lng: -121.4944 },
};

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
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Brown",
  "Charlie Davis",
  "David Wilson",
  "Eve Martinez",
  "Frank Miller",
  "Grace Taylor",
  "Henry Anderson",
  "Ivy Thomas",
  "Jack Jackson",
  "Kelly White",
  "Liam Harris",
  "Mia Martin",
  "Noah Thompson",
  "Olivia Garcia",
  "Paul Robinson",
  "Quinn Clark",
  "Ryan Lewis",
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
  await prisma.complaint.deleteMany();
  await prisma.review.deleteMany();
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
    const userCity = getRandom(CITIES);
    const userCoords = CITY_COORDS[userCity];

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: i === 0 ? Role.ADMIN : Role.USER,
        carbonSavedKg: getRandomInt(0, 50),
        bio: `I am ${name} and I love sharing rides!`,
        city: userCity,
        latitude: userCoords.lat + (Math.random() - 0.5) * 0.05,
        longitude: userCoords.lng + (Math.random() - 0.5) * 0.05,
        vehicleModel: vehicle?.model,
        vehicleColor: vehicle?.color,
        vehiclePlate: hasVehicle ? `RM-${getRandomInt(1000, 9999)}` : null,
        photo: i % 3 === 0 ? `https://i.pravatar.cc/150?u=${email}` : null,
        rating: i % 4 === 0 ? getRandomInt(3, 5) : 0,
      },
    });
    users.push(user);
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
      latitude: CITY_COORDS["San Francisco"].lat,
      longitude: CITY_COORDS["San Francisco"].lng,
      vehicleModel: "Tesla Model S",
      vehicleColor: "Red",
      vehiclePlate: "TEST-123",
      photo: "https://i.pravatar.cc/150?u=jane@example.com",
      rating: 4.8,
    },
  });
  users.push(testUser);

  // 2. Create Rides (50 rides)
  console.log("🚗 Creating rides...");
  const rides: Ride[] = [];
  const drivers = users.filter((u) => u.vehicleModel);

  for (let i = 0; i < 50; i++) {
    const driver = getRandom(drivers);
    const startCity = getRandom(CITIES);

    // Create an Intra-City ride 50% of the time, so the radius filter can work
    const isIntraCity = Math.random() > 0.5;
    let endCity = startCity;

    if (!isIntraCity) {
      while (endCity === startCity) {
        endCity = getRandom(CITIES);
      }
    }

    const startCoord = CITY_COORDS[startCity];
    const endCoord = CITY_COORDS[endCity];

    // Add small fuzziness (approx a few kilometers) so they aren't on exact identical points
    const startLat = startCoord.lat + (Math.random() - 0.5) * 0.1;
    const startLng = startCoord.lng + (Math.random() - 0.5) * 0.1;
    const endLat = endCoord.lat + (Math.random() - 0.5) * 0.1;
    const endLng = endCoord.lng + (Math.random() - 0.5) * 0.1;

    // Departure dates spread over next 10 days
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + getRandomInt(1, 10));
    departureDate.setHours(getRandomInt(6, 22), getRandomInt(0, 59), 0, 0);

    const ride = await prisma.ride.create({
      data: {
        driverId: driver.id,
        startLocation: isIntraCity ? `${startCity} (Local)` : startCity,
        endLocation: isIntraCity ? `${endCity} (Dropoff)` : endCity,
        startLat,
        startLng,
        endLat,
        endLng,
        departureDatetime: departureDate,
        availableSeats: getRandomInt(1, 4),
        status: RideStatus.ACTIVE,
        description: isIntraCity
          ? `Running errands around ${startCity}. Hop in!`
          : `Driving cross-city from ${startCity} to ${endCity}.`,
        distanceKm: isIntraCity ? getRandomInt(2, 15) : getRandomInt(40, 400),
        requirePhoto: Math.random() > 0.7,
        minRating: Math.random() > 0.7 ? getRandomInt(3, 4) : null,
      },
    });
    rides.push(ride);
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
      where: { userId: passenger.id, rideId: ride.id },
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
    } catch {
      // Ignore if seats full or other constraints
    }
  }

  // 4. Create Reviews & Complaints
  console.log("⭐ Creating reviews and complaints...");
  const completedBookings = await prisma.booking.findMany({
    where: { status: BookingStatus.CONFIRMED },
    take: 10,
    include: { ride: true },
  });

  for (const booking of completedBookings) {
    // Passenger reviews Driver
    await prisma.review.create({
      data: {
        bookingId: booking.id,
        reviewerId: booking.userId,
        targetId: booking.ride.driverId,
        rating: getRandomInt(4, 5),
        comment: "Great driver, very punctual!",
        role: ReviewRole.DRIVER,
      },
    });

    // Mark as rated
    await prisma.booking.update({
      where: { id: booking.id },
      data: { isRated: true },
    });

    // Random complaint
    if (Math.random() > 0.8) {
      await prisma.complaint.create({
        data: {
          bookingId: booking.id,
          reporterId: booking.userId,
          targetId: booking.ride.driverId,
          reason: "The car was a bit messy.",
          status: ComplaintStatus.PENDING,
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully!");
  console.log(`- Created ${users.length} users`);
  console.log(`- Created ${rides.length} rides`);
  console.log("- Created many bookings, reviews, and complaints");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
