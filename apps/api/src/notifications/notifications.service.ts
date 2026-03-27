import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private expo = new Expo();
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });
  }

  async sendNotification(userId: string, title: string, message: string, data?: any) {
    // 1. Save to DB for in-app history
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        data: data || {},
      },
    });

    // 2. Send Push Notification if user has a token
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pushToken: true },
    });

    if (user?.pushToken && Expo.isExpoPushToken(user.pushToken)) {
      const messages: ExpoPushMessage[] = [
        {
          to: user.pushToken,
          sound: 'default',
          title,
          body: message,
          data: { ...data, notificationId: notification.id },
        },
      ];

      try {
        const chunks = this.expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
          await this.expo.sendPushNotificationsAsync(chunk);
        }
      } catch (error) {
        this.logger.error('Error sending push notification', error);
      }
    }

    return notification;
  }
}
