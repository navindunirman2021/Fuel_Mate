package com.uokmit.fuelmate.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class TwilioConfig {
    private static final Logger logger = LoggerFactory.getLogger(TwilioConfig.class);

    @Value("${twilio.account-sid}")
    private String accountSid;
    
    @Value("${twilio.auth-token}")
    private String authToken;
    
    @Value("${twilio.verify-service-sid}")
    private String verifyServiceSid;

    @PostConstruct
    public void initTwilio() {
        logger.info("Initializing Twilio with Account SID: {}", accountSid);
        Twilio.init(accountSid, authToken);
    }

    public String getVerifyServiceSid() {
        return verifyServiceSid;
    }
    
    public String getAccountSid() {
        return accountSid;
    }
    
    public String getAuthToken() {
        return authToken;
    }
}