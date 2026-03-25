import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { CreateRideDto } from "./dto/create-ride.dto";
import { UpdateRideDto } from "./dto/update-ride.dto";
import { PrismaService } from "../prisma/prisma.service";

export interface RouteResult {
  distanceKm: number;
  encodedPolyline: string;
}

interface GoogleRoutesResponse {
  routes?: Array<{
    distanceMeters?: number;
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
}

@Injectable()
export class RidesService {
  private readonly logger = new Logger(RidesService.name);

  constructor(private prisma: PrismaService) {}

  private async computeRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ): Promise<RouteResult | null> {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        "GOOGLE_MAPS_API_KEY is not set — skipping route computation",
      );
      return null;
    }

    try {
      const response = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "routes.distanceMeters,routes.polyline.encodedPolyline",
          },
          body: JSON.stringify({
            origin: {
              location: { latLng: { latitude: startLat, longitude: startLng } },
            },
            destination: {
              location: { latLng: { latitude: endLat, longitude: endLng } },
            },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE",
          }),
        },
      );

      const data = (await response.json()) as GoogleRoutesResponse;
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = (route.distanceMeters || 0) / 1000;
        const encodedPolyline = route.polyline?.encodedPolyline || "";
        this.logger.log(
          `Successfully computed route. Distance: ${distanceKm.toFixed(1)}km`,
        );
        return { distanceKm, encodedPolyline };
      }

      this.logger.error("Google Routes API returned no routes:", data);
    } catch (error) {
      this.logger.error("Error calling Google Routes API:", error);
    }

    return null;
  }

  async create(driverId: string, createRideDto: CreateRideDto) {
    const ride = await this.prisma.ride.create({
      data: {
        ...createRideDto,
        departureDatetime: new Date(createRideDto.departureDatetime),
        driverId,
      },
    });

    // Auto-compute distance if coordinates were provided
    if (
      createRideDto.startLat &&
      createRideDto.startLng &&
      createRideDto.endLat &&
      createRideDto.endLng
    ) {
      this.logger.log(`Computing route for new ride ${ride.id}`);
      const routeResult = await this.computeRoute(
        createRideDto.startLat,
        createRideDto.startLng,
        createRideDto.endLat,
        createRideDto.endLng,
      );

      if (routeResult) {
        this.logger.log(`Route computed and saved for ride ${ride.id}`);
        return this.prisma.ride.update({
          where: { id: ride.id },
          data: { distanceKm: routeResult.distanceKm },
        });
      }
    }

    return ride;
  }

  async getRoute(id: string): Promise<RouteResult | null> {
    const ride = await this.prisma.ride.findUnique({
      where: { id },
      select: { startLat: true, startLng: true, endLat: true, endLng: true },
    });

    if (!ride) throw new NotFoundException("Ride not found");

    if (!ride.startLat || !ride.startLng || !ride.endLat || !ride.endLng) {
      return null;
    }

    return this.computeRoute(
      ride.startLat,
      ride.startLng,
      ride.endLat,
      ride.endLng,
    );
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

  async findAll(filters?: {
    from?: string;
    to?: string;
    date?: string;
    city?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    userId?: string;
  }) {
    if (filters?.lat && filters?.lng && filters?.radius) {
      // Radius search using Haversine formula directly in SQL since PostGIS was not available in migration
      const radius = filters.radius; // in km
      const lat = filters.lat;
      const lng = filters.lng;

      // SQL query to find rides within radius
      if (filters.userId) {
        return this.prisma.$queryRaw`
          SELECT r.*, 
            u.name as "driverName", u.photo as "driverPhoto", 
            u."vehicleModel", u."vehicleColor", u."vehiclePlate",
            (6371 * acos(cos(radians(${lat})) * cos(radians("startLat")) * cos(radians("startLng") - radians(${lng})) + sin(radians(${lat})) * sin(radians("startLat")))) AS "searchDistance"
          FROM "Ride" r
          JOIN "User" u ON r."driverId" = u.id
          WHERE r.status = 'ACTIVE'
          AND r."driverId" != ${filters.userId}
          AND (6371 * acos(cos(radians(${lat})) * cos(radians("startLat")) * cos(radians("startLng") - radians(${lng})) + sin(radians(${lat})) * sin(radians("startLat")))) <= ${radius}
          ORDER BY "searchDistance" ASC
          LIMIT 20
        `;
      } else {
        return this.prisma.$queryRaw`
          SELECT r.*, 
            u.name as "driverName", u.photo as "driverPhoto", 
            u."vehicleModel", u."vehicleColor", u."vehiclePlate",
            (6371 * acos(cos(radians(${lat})) * cos(radians("startLat")) * cos(radians("startLng") - radians(${lng})) + sin(radians(${lat})) * sin(radians("startLat")))) AS "searchDistance"
          FROM "Ride" r
          JOIN "User" u ON r."driverId" = u.id
          WHERE r.status = 'ACTIVE'
          AND (6371 * acos(cos(radians(${lat})) * cos(radians("startLat")) * cos(radians("startLng") - radians(${lng})) + sin(radians(${lat})) * sin(radians("startLat")))) <= ${radius}
          ORDER BY "searchDistance" ASC
          LIMIT 20
        `;
      }
    }

    const where: any = {
      status: "ACTIVE",
    };

    if (filters?.userId) {
      where.driverId = { not: filters.userId };
    }

    if (filters?.from) {
      where.startLocation = { contains: filters.from, mode: "insensitive" };
    }
    if (filters?.to) {
      where.endLocation = { contains: filters.to, mode: "insensitive" };
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
      where.startLocation = { contains: filters.city, mode: "insensitive" };
    }

    return this.prisma.ride.findMany({
      where,
      take: 20,
      orderBy: { departureDatetime: "asc" },
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
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
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

    const coordsChanged =
      (updateRideDto.startLat !== undefined &&
        updateRideDto.startLat !== ride.startLat) ||
      (updateRideDto.startLng !== undefined &&
        updateRideDto.startLng !== ride.startLng) ||
      (updateRideDto.endLat !== undefined &&
        updateRideDto.endLat !== ride.endLat) ||
      (updateRideDto.endLng !== undefined &&
        updateRideDto.endLng !== ride.endLng);

    if (coordsChanged) {
      const finalStartLat = updateRideDto.startLat ?? ride.startLat;
      const finalStartLng = updateRideDto.startLng ?? ride.startLng;
      const finalEndLat = updateRideDto.endLat ?? ride.endLat;
      const finalEndLng = updateRideDto.endLng ?? ride.endLng;

      if (finalStartLat && finalStartLng && finalEndLat && finalEndLng) {
        const routeResult = await this.computeRoute(
          finalStartLat,
          finalStartLng,
          finalEndLat,
          finalEndLng,
        );
        if (routeResult) {
          data.distanceKm = routeResult.distanceKm;
          data.routePolyline = routeResult.encodedPolyline;
        }
      }
    }

    return this.prisma.ride.update({
      where: { id },
      data,
    });
  }

  async cancelRide(id: string, driverId: string) {
    const ride = await this.findOne(id);
    if (ride.driverId !== driverId) {
      throw new NotFoundException("Not authorized to cancel this ride");
    }

    return this.prisma.$transaction([
      this.prisma.booking.updateMany({
        where: { rideId: id },
        data: { status: "CANCELLED" },
      }),
      this.prisma.ride.update({
        where: { id },
        data: { status: "CANCELLED" },
      }),
    ]);
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
