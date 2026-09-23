package com.autosphere.api.config;

import com.autosphere.api.car.Car;
import com.autosphere.api.car.CarRepository;
import com.autosphere.api.user.User;
import com.autosphere.api.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Seeds two demo sellers and their listings on first run only (when the
 * users table is still empty), so the app is immediately demoable and the
 * screenshots/report can reuse the same demo accounts as Assignments 1-2.
 * OAuth accounts (Google/GitHub/Facebook) are NOT seeded - they are created
 * automatically the first time someone actually signs in with that provider.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, CarRepository carRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.carRepository = carRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already seeded / real data exists - never overwrite it
        }

        User farah = seedUser("Farah Wahidah", "farah@autosphere.my", "012-3456789",
                "Bukit Mertajam, Penang", "2025-11-02");
        User kaiming = seedUser("Kai Ming Tan", "kaiming@autosphere.my", "016-7788990",
                "George Town, Penang", "2026-01-14");

        seedCar(farah, "Toyota", "Vios", 2021, "62800", 34000, "Automatic", "Petrol", "Sedan",
                "Spicy Scarlet SE", "Bukit Mertajam, Penang", "PPV 1234",
                "Well-maintained single owner Vios, full service record at Toyota service centre. Non-smoker car, no accident history. Comes with reverse camera and leather seat upgrade.",
                "2026-06-12");
        seedCar(farah, "Honda", "City", 2020, "58900", 41200, "Automatic", "Petrol", "Sedan",
                "Ignite Red Metallic", "Butterworth, Penang", "PGH 2071",
                "Honda Sensing variant. Tyres changed 3 months ago. Very fuel efficient, ideal for daily commute. Trade-in and loan arrangement available.",
                "2026-07-01");
        seedCar(kaiming, "Perodua", "Myvi", 2022, "46500", 18500, "Automatic", "Petrol", "Hatchback",
                "Ivory White", "George Town, Penang", "PPU 5588",
                "Low mileage Myvi in excellent condition, still under warranty. One careful owner, garage kept.",
                "2026-07-20");
        seedCar(kaiming, "Perodua", "Axia", 2019, "29800", 52300, "Manual", "Petrol", "Hatchback",
                "Coral Blue", "Nibong Tebal, Penang", "PNP 9012",
                "Economical first car, manual transmission, cheap on fuel and easy to maintain.",
                "2026-05-18");
        seedCar(farah, "Honda", "Civic", 2023, "138000", 12000, "Automatic", "Petrol", "Sedan",
                "Ignite Red Metallic", "Bukit Mertajam, Penang", "PPV 8821",
                "Almost new Civic, still under manufacturer warranty. Full leather interior and sunroof.",
                "2026-08-02");
        seedCar(kaiming, "Toyota", "Hilux", 2018, "89000", 71000, "Automatic", "Diesel", "Pickup",
                "Avant-garde Bronze Metallic", "Simpang Ampat, Penang", "PSA 3345",
                "Well-used but reliable workhorse, canopy included, recently serviced.",
                "2026-06-28");
        seedCar(farah, "Proton", "X50", 2021, "82500", 29800, "Automatic", "Petrol", "SUV",
                "Armour Silver", "Bayan Lepas, Penang", "PBL 6612",
                "Popular compact SUV with ADAS features, well maintained with service records.",
                "2026-07-11");
        seedCar(kaiming, "Mazda", "CX-5", 2020, "118000", 38700, "Automatic", "Petrol", "SUV",
                "Machine Grey Pearl", "George Town, Penang", "PGT 4290",
                "Premium SUV, Bose sound system, leather seats, sunroof, very well kept.",
                "2026-04-30");
        seedCar(farah, "Perodua", "Bezza", 2020, "39800", 45200, "Automatic", "Petrol", "Sedan",
                "Ocean Blue", "Bukit Mertajam, Penang", "PPV 7734",
                "Reliable and fuel-efficient sedan, ideal for grab/e-hailing or daily use.",
                "2026-08-10");
        seedCar(kaiming, "Volkswagen", "Golf", 2019, "96000", 40500, "Automatic", "Petrol", "Hatchback",
                "Deep Ocean Blue", "Bukit Mertajam, Penang", "PPV 1190",
                "German engineering with a fun-to-drive character, DSG gearbox recently serviced.",
                "2026-03-22");
        seedCar(farah, "Toyota", "Camry", 2017, "92000", 68900, "Automatic", "Petrol", "Sedan",
                "Platinum White Pearl", "Butterworth, Penang", "PBW 2456",
                "Executive sedan, comfortable ride, well maintained by a single owner.",
                "2026-02-14");
        seedCar(kaiming, "Honda", "HR-V", 2022, "109500", 21000, "Automatic", "Petrol", "SUV",
                "Sand Khaki Pearl", "Bayan Lepas, Penang", "PBL 9903",
                "Low mileage HR-V, still under warranty, no accident history.",
                "2026-07-29");
    }

    private User seedUser(String name, String email, String phone, String address, String joined) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode("password123"));
        u.setPhone(phone);
        u.setAddress(address);
        u.setProvider("local");
        u.setJoined(LocalDate.parse(joined));
        return userRepository.save(u);
    }

    private void seedCar(User seller, String make, String model, int year, String price, int mileage,
                          String transmission, String fuelType, String bodyType, String color, String location,
                          String registrationNumber, String description, String listedOn) {
        Car c = new Car();
        c.setSellerId(seller.getId());
        c.setMake(make);
        c.setModel(model);
        c.setYear(year);
        c.setPrice(new BigDecimal(price));
        c.setMileage(mileage);
        c.setTransmission(transmission);
        c.setFuelType(fuelType);
        c.setBodyType(bodyType);
        c.setColor(color);
        c.setLocation(location);
        c.setRegistrationNumber(registrationNumber);
        c.setDescription(description);
        c.setImage(null);
        c.setListedOn(LocalDate.parse(listedOn));
        carRepository.save(c);
    }
}
