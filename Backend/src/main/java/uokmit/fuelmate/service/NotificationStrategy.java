package com.uokmit.fuelmate.service.notification;

public interface NotificationStrategy {
    boolean sendNotification(String recipient, String message);
}
