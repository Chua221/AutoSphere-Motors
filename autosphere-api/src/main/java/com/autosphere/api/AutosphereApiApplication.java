package com.autosphere.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AutosphereApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(AutosphereApiApplication.class, args);
    }
}
