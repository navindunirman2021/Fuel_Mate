package com.uokmit.fuelmate.service;

import org.springframework.stereotype.Service;
import com.uokmit.fuelmate.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class TwilioService {
    private final TwilioConfig twilioConfig;
    private static final Logger logger = LoggerFactory.getLogger(TwilioService.class);

    public TwilioService(TwilioConfig twilioConfig) {
        this.twilioConfig = twilioConfig;
    }

    public boolean sendSmsNotification(String phoneNumber, String message) {
        try {
            logger.info("Attempting to send SMS to: {}", phoneNumber);
            
            // Create a message using Twilio's message creation API
            Message smsMessage = Message.creator(
                new PhoneNumber(phoneNumber),  // To phone number
                new PhoneNumber("+16066171851"),  // From phone number (using the US number from your screenshot)
                message  // SMS body
            ).create();
            
            logger.info("SMS sent with status: {}, SID: {}", smsMessage.getStatus(), smsMessage.getSid());
            return !smsMessage.getStatus().equals(Message.Status.FAILED);
        } catch (Exception e) {
            logger.error("Error sending SMS: {}", e.getMessage(), e);
            return false;
        }
    }
}