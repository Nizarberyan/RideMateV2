import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import {
  Role,
  RideStatus,
  BookingStatus,
  ReviewRole,
  ComplaintStatus,
} from "../src/generated/prisma/enums.js";
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
  { model: "Tesla Model 3", color: "Midnight Silver" },
  { model: "Tesla Model Y", color: "Pearl White" },
  { model: "Hyundai Ioniq 5", color: "Cyber Gray" },
  { model: "Toyota Prius", color: "Sea Glass Pearl" },
  { model: "Honda Civic", color: "Crystal Black" },
  { model: "Ford Mustang Mach-E", color: "Rapid Red" },
  { model: "Chevrolet Bolt", color: "Bright Blue" },
  { model: "Volkswagen ID.4", color: "Pure White" },
  { model: "Nissan Leaf", color: "Gun Metallic" },
  { model: "BMW i4", color: "Portimao Blue" },
  { model: "Audi Q4 e-tron", color: "Pebble Gray" },
  { model: "Kia EV6", color: "Yacht Blue" },
  { model: "Rivian R1T", color: "Rivian Blue" },
  { model: "Lucid Air", color: "Zenith Red" },
];

const NAMES = [
  "Alex Rivera", "Jordan Smith", "Casey Johnson", "Taylor Brown", "Morgan Davis",
  "Riley Wilson", "Skyler Martinez", "Quinn Miller", "Peyton Taylor", "Avery Anderson",
  "Dakota Thomas", "Sage Jackson", "Charlie White", "Emerson Harris", "Parker Martin",
  "Finley Thompson", "Blake Garcia", "Hayden Robinson", "Rowan Clark", "Phoenix Lewis",
  "Luca Walker", "Amari Young", "Jamie Hall", "Eden Allen", "Arlo Wright",
  "Kai King", "Zion Scott", "Reese Green", "Sutton Adams", "Remi Baker"
];

const BIOS = [
  "Daily commuter looking to save on gas and help the environment. 🌿",
  "Tech enthusiast who loves meeting new people during my drives to Palo Alto.",
  "Student at UCB, driving back to SF on weekends. Let's carpool!",
  "Always punctual and I have the best road trip playlists. 🎶",
  "Quiet driver, perfect for those who like to nap or work during the ride.",
  "Eco-conscious traveler. Let's reduce our carbon footprint together! 🌍",
  "Professional driver with a spotless record and a very comfortable car.",
  "Love exploring new cafes. Ask me for recommendations in SF!",
  "On a mission to save 1000kg of CO2 this year. Join me!",
  "Friendly, safe, and always stocked with water and snacks. 🥤"
];

function getRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random coordinate within a radius (in KM) of a center point
function getRandomLocationNear(center: { lat: number, lng: number }, radiusKm: number) {
  const radiusInDegrees = radiusKm / 111; // 1 degree is roughly 111km
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  return {
    lat: center.lat + y,
    lng: center.lng + x / Math.cos(center.lat * Math.PI / 180)
  };
}

async function main() {
  console.log("🚀 Starting advanced seeding process...");

  // Clear existing data in correct order
  await prisma.complaint.deleteMany();
  await prisma.review.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("password123", 10);

  // 1. Create Users
  console.log("👤 Creating 30 users with localized data...");
  const users: User[] = [];
  const rides: Ride[] = [];
  
  // Dedicated Test Account
  const testUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      password,
      name: "Test User",
      role: Role.USER,
      carbonSavedKg: 24.5,
      city: "San Francisco",
      latitude: CITY_COORDS["San Francisco"].lat,
      longitude: CITY_COORDS["San Francisco"].lng,
      vehicleModel: "Tesla Model 3",
      vehicleColor: "Red",
      vehiclePlate: "SAFE-001",
      bio: "Main test account for RideMate development.",
      photo: "https://i.pravatar.cc/150?u=test@example.com",
      rating: 4.9,
    },
  });
  users.push(testUser);

  // Create a few dedicated rides for the test user to ensure they are a driver sometimes
  console.log("🚗 Creating dedicated rides for test user...");
  for (let i = 0; i < 3; i++) {
    const startCity = "San Francisco";
    const endCity = getRandom(CITIES);
    const startLoc = getRandomLocationNear(CITY_COORDS[startCity], 5);
    const endLoc = getRandomLocationNear(CITY_COORDS[endCity], 5);
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 2 + i);

    const ride = await prisma.ride.create({
      data: {
        driverId: testUser.id,
        startLocation: startCity,
        endLocation: endCity,
        startLat: startLoc.lat,
        startLng: startLoc.lng,
        endLat: endLoc.lat,
        endLng: endLoc.lng,
        departureDatetime: departureDate,
        availableSeats: 3,
        status: RideStatus.ACTIVE,
        description: "Test ride from the main test account.",
        distanceKm: getRandomInt(50, 200),
      },
    });
    rides.push(ride);
  }

  for (let i = 0; i < NAMES.length; i++) {
    const name = NAMES[i];
    const email = `${name.toLowerCase().replace(/\s/g, ".")}@example.com`;
    const hasVehicle = i < 20; // First 20 are drivers
    const vehicle = hasVehicle ? getRandom(VEHICLES) : null;
    const userCity = getRandom(CITIES);
    const center = CITY_COORDS[userCity];
    const loc = getRandomLocationNear(center, 5); // Within 5km of city center

    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: i === 0 ? Role.ADMIN : Role.USER,
        carbonSavedKg: getRandomInt(5, 150),
        bio: getRandom(BIOS),
        city: userCity,
        latitude: loc.lat,
        longitude: loc.lng,
        vehicleModel: vehicle?.model,
        vehicleColor: vehicle?.color,
        vehiclePlate: hasVehicle ? `CA-${getRandomInt(100, 999)}-${getRandomInt(10, 99)}` : null,
        photo: `https://i.pravatar.cc/150?u=${email}`,
        rating: 0, // Will update later based on reviews
      },
    });
    users.push(user);
  }

  // 2. Create Rides (70 more rides)
  console.log("🚗 Creating 70 more rides (Clusters in SF for testing)...");
  const drivers = users.filter((u) => u.vehicleModel);
  const sfCenter = CITY_COORDS["San Francisco"];

  for (let i = 0; i < 70; i++) {
    const driver = getRandom(drivers);
    
    // Cluster 30% of rides in SF for easier radius testing
    const isSFTest = i < 25;
    const startCity = isSFTest ? "San Francisco" : getRandom(CITIES);
    const isIntraCity = Math.random() > 0.4 || isSFTest;
    
    let endCity = isIntraCity ? startCity : getRandom(CITIES);
    while (!isIntraCity && endCity === startCity) {
      endCity = getRandom(CITIES);
    }

    const startLoc = getRandomLocationNear(CITY_COORDS[startCity], isIntraCity ? 8 : 3);
    const endLoc = getRandomLocationNear(CITY_COORDS[endCity], isIntraCity ? 8 : 3);

    // Departure dates spread over next 14 days
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + getRandomInt(0, 14));
    departureDate.setHours(getRandomInt(6, 21), getRandomInt(0, 59), 0, 0);

    const ride = await prisma.ride.create({
      data: {
        driverId: driver.id,
        startLocation: isIntraCity ? `${startCity} Area` : startCity,
        endLocation: isIntraCity ? `${startCity} Suburb` : endCity,
        startLat: startLoc.lat,
        startLng: startLoc.lng,
        endLat: endLoc.lat,
        endLng: endLoc.lng,
        departureDatetime: departureDate,
        availableSeats: getRandomInt(1, 4),
        status: RideStatus.ACTIVE,
        description: isIntraCity 
          ? `Commuting locally within ${startCity}. Happy to share the ride!` 
          : `Driving from ${startCity} to ${endCity}. Plenty of trunk space!`,
        distanceKm: isIntraCity ? getRandomInt(3, 15) : getRandomInt(50, 450),
        requirePhoto: Math.random() > 0.8,
        minRating: Math.random() > 0.8 ? 4.0 : null,
      },
    });
    rides.push(ride);
  }

  // 3. Create Bookings & Reviews
  console.log("⭐ Creating historical bookings and calculating ratings...");
  
  // Create 150 bookings across the system
  for (let i = 0; i < 150; i++) {
    const passenger = getRandom(users);
    const ride = getRandom(rides);
    if (ride.driverId === passenger.id) continue;

    // A booking can only be completed if the ride is in the past
    const isPastRide = new Date(ride.departureDatetime) < new Date();
    const status = isPastRide && i < 100 ? BookingStatus.COMPLETED : getRandom([BookingStatus.CONFIRMED, BookingStatus.PENDING]);

    try {
      const booking = await prisma.booking.create({
        data: {
          userId: passenger.id,
          rideId: ride.id,
          seatsBooked: 1, // Only 1 seat per booking as per latest feedback
          status: status,
          pickupLocation: "Meet at corner",
          dropoffLocation: "Main entrance",
          createdAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
        },
      });

      // If completed, add reviews to build up ratings
      if (status === BookingStatus.COMPLETED) {
        // Passenger reviews Driver
        await prisma.review.create({
          data: {
            bookingId: booking.id,
            reviewerId: passenger.id,
            targetId: ride.driverId,
            rating: getRandomInt(4, 5),
            comment: getRandom(["Excellent ride!", "Safe driver", "Very clean car", "Highly recommended"]),
            role: ReviewRole.DRIVER,
          }
        });

        // Driver reviews Passenger
        await prisma.review.create({
          data: {
            bookingId: booking.id,
            reviewerId: ride.driverId,
            targetId: passenger.id,
            rating: getRandomInt(4, 5),
            comment: "Great passenger, arrived on time.",
            role: ReviewRole.PASSENGER,
          }
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { isRated: true }
        });
      }
    } catch (e) {
      // Ignore unique constraint violations
    }
  }

  // 4. Update Final Ratings
  console.log("📊 Finalizing user ratings...");
  const allUsers = await prisma.user.findMany({
    include: { reviewsReceived: true }
  });

  for (const user of allUsers) {
    if (user.reviewsReceived.length > 0) {
      const sum = user.reviewsReceived.reduce((acc, r) => acc + r.rating, 0);
      const avg = sum / user.reviewsReceived.length;
      await prisma.user.update({
        where: { id: user.id },
        data: { rating: parseFloat(avg.toFixed(1)) }
      });
    }
  }

  // 5. Create Notifications
  console.log("🔔 Seeding notifications...");
  const testUserFull = await prisma.user.findUnique({
    where: { id: testUser.id },
    include: { ridesAsDriver: true, bookings: true },
  });

  if (testUserFull) {
    // Some "New Ride Request" notifications (as a driver)
    const driverRides = testUserFull.ridesAsDriver;
    for (let i = 0; i < Math.min(3, driverRides.length); i++) {
      const ride = driverRides[i];
      const passenger = getRandom(users.filter(u => u.id !== testUser.id));
      await prisma.notification.create({
        data: {
          userId: testUser.id,
          title: "New Ride Request",
          message: `${passenger.name} wants to join your ride to ${ride.endLocation}`,
          read: i > 0, // One unread
          data: {
            type: "NEW_BOOKING",
            rideId: ride.id,
            passengerName: passenger.name,
          },
        },
      });
    }

    // Some "Booking Confirmed" notifications (as a passenger)
    const passengerBookings = await prisma.booking.findMany({
      where: { userId: testUser.id },
      include: { ride: { include: { driver: true } } },
    });

    for (let i = 0; i < Math.min(2, passengerBookings.length); i++) {
      const booking = passengerBookings[i];
      await prisma.notification.create({
        data: {
          userId: testUser.id,
          title: "Booking Confirmed!",
          message: `Your ride to ${booking.ride.endLocation} has been confirmed by ${booking.ride.driver.name}.`,
          read: true,
          data: {
            type: "BOOKING_CONFIRMED",
            rideId: booking.rideId,
            bookingId: booking.id,
          },
        },
      });
    }

    // A "Booking Cancelled" notification
    const cancelledBooking = passengerBookings[passengerBookings.length - 1];
    if (cancelledBooking) {
      await prisma.notification.create({
        data: {
          userId: testUser.id,
          title: "Booking Cancelled",
          message: `Your booking for the ride to ${cancelledBooking.ride.endLocation} was cancelled.`,
          read: false,
          data: {
            type: "BOOKING_CANCELLED",
            rideId: cancelledBooking.rideId,
          },
        },
      });
    }
  }

  console.log("✅ Seeding completed successfully!");
  console.log(`- Created ${users.length} users`);
  console.log(`- Created ${rides.length} rides`);
  console.log("- Created sample notifications for the test user.");
  console.log("- Calculated real average ratings for all users.");
  console.log("💡 LOG IN WITH: test@example.com / password123");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
