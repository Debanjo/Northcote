import { getIO } from "../lib/socket.js";
import Notification from "../models/notification.js";

export const notifyUsers = async (
  managerId: string,
  supervisorId: string,
  title: string,
  message: string,
  link: string,
  type: "system" | "assignment" | "inspection" | "alert",
) => {
  await Notification.create({ user: managerId, title, message, type, link });
  await Notification.create({ user: supervisorId, title, message, type, link });

  getIO().emit(`new_notification_${managerId}`);
  getIO().emit(`new_notification_${supervisorId}`);
};