package com.autosphere.api.car.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

/** Used for both POST (create) and PUT (full update) - Task 1.3 validation. */
public class CarRequest {

    @NotBlank(message = "Make is required.")
    @Size(max = 60, message = "Make is too long.")
    private String make;

    @NotBlank(message = "Model is required.")
    @Size(max = 60, message = "Model is too long.")
    private String model;

    @NotNull(message = "Year of registration is required.")
    @Min(value = 1980, message = "Year must be 1980 or later.")
    @Max(value = 2100, message = "Year cannot be in the far future.")
    private Integer year;

    @NotNull(message = "Price is required.")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative.")
    private BigDecimal price;

    @NotNull(message = "Mileage is required.")
    @Min(value = 0, message = "Mileage cannot be negative.")
    private Integer mileage;

    @NotBlank(message = "Transmission is required.")
    private String transmission;

    @NotBlank(message = "Fuel type is required.")
    private String fuelType;

    @NotBlank(message = "Body type is required.")
    private String bodyType;

    @NotBlank(message = "Colour is required.")
    @Size(max = 60)
    private String color;

    @NotBlank(message = "Location is required.")
    @Size(max = 120)
    private String location;

    @Size(max = 20, message = "Registration number is too long.")
    private String registrationNumber;

    @NotBlank(message = "Description is required.")
    @Size(max = 4000, message = "Description is too long.")
    private String description;

    private String image;

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
