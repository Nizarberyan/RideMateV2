import { Module } from "@nestjs/common";
import { RidesService } from "./rides.service";
import { RidesController } from "./rides.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [NotificationsModule],
  providers: [RidesService],
  controllers: [RidesController],
})
export class RidesModule {}
