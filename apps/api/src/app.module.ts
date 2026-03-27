import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RidesModule } from "./rides/rides.module";
import { BookingsModule } from "./bookings/bookings.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        ...(process.env.NODE_ENV !== "production"
          ? {
              transport: {
                target: "pino-pretty",
                options: {
                  singleLine: true,
                  colorize: true,
                },
              },
            }
          : {}),
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RidesModule,
    BookingsModule,
    ReviewsModule,
    ComplaintsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
