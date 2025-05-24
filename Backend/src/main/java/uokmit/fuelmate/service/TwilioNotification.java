package com.uokmit.fuelmate.service.notification;

import com.uokmit.fuelmate.service.TwilioService;
import org.springframework.stereotype.Service;

import static com.uokmit.fuelmate.util.PhoneNumberUtil.formatPhoneNumber;

@Service
public class TwilioNotification implements NotificationStrategy {
    private final TwilioService twilioService;

    public TwilioNotification(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    @Override
    public boolean sendNotification(String phoneNumber, String message) {
        return twilioService.sendSmsNotification(formatPhoneNumber(phoneNumber), message);
    }
}
