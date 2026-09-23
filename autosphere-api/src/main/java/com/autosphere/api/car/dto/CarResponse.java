package com.autosphere.api.car.dto;

import com.autosphere.api.car.Car;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CarResponse {
    private Long id;
    private Long sellerId;
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;
    private String transmission;
    private String fuelType;
    private String bodyType;
    private String color;
    private String location;
    private String registrationNumber;
    private String description;
    private String image;
    private LocalDate listedOn;

    public static CarResponse from(Car c) {
        CarResponse r = new CarResponse();
        r.id = c.getId();
        r.sellerId = c.getSellerId();
        r.make = c.getMake();
        r.model = c.getModel();
        r.year = c.getYear();
        r.price = c.getPrice();
        r.mileage = c.getMileage();
        r.transmission = c.getTransmission();
        r.fuelType = c.getFuelType();
        r.bodyType = c.getBodyType();
        r.color = c.getColor();
        r.location = c.getLocation();
        r.registrationNumber = c.getRegistrationNumber();
        r.description = c.getDescription();
        r.image = c.getImage();
        r.listedOn = c.getListedOn();
        return r;
    }

    public Long getId() { return id; }
    public Long getSellerId() { return sellerId; }
    public String getMake() { return make; }
    public String getModel() { return model; }
    public Integer getYear() { return year; }
    public BigDecimal getPrice() { return price; }
    public Integer getMileage() { return mileage; }
    public String getTransmission() { return transmission; }
    public String getFuelType() { return fuelType; }
    public String getBodyType() { return bodyType; }
    public String getColor() { return color; }
    public String getLocation() { return location; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getDescription() { return description; }
    public String getImage() { return image; }
    public LocalDate getListedOn() { return listedOn; }
}
