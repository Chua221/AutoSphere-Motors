package com.autosphere.api.car;

import com.autosphere.api.car.dto.CarRequest;
import com.autosphere.api.car.dto.CarResponse;
import com.autosphere.api.common.BadRequestException;
import com.autosphere.api.common.ForbiddenException;
import com.autosphere.api.common.ResourceNotFoundException;
import com.autosphere.api.security.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private static final List<String> SORTABLE_FIELDS = List.of("listedOn", "price", "year", "mileage");

    private final CarRepository carRepository;

    public CarController(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    // Task 1.2 / 1.3 - Car Listings Page + Search & Filter Functionality.
    // GET /api/cars?make=&model=&year=&minPrice=&maxPrice=&registrationNumber=&sellerId=&sort=&order=
    @GetMapping
    public List<CarResponse> searchCars(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String registrationNumber,
            @RequestParam(required = false) Long sellerId,
            @RequestParam(required = false, defaultValue = "listedOn") String sort,
            @RequestParam(required = false, defaultValue = "desc") String order
    ) {
        Specification<Car> spec = Specification.where(null);
        if (make != null && !make.isBlank()) spec = spec.and(CarSpecifications.makeEquals(make));
        if (model != null && !model.isBlank()) spec = spec.and(CarSpecifications.modelContains(model));
        if (year != null) spec = spec.and(CarSpecifications.yearEquals(year));
        if (minPrice != null) spec = spec.and(CarSpecifications.priceGte(minPrice));
        if (maxPrice != null) spec = spec.and(CarSpecifications.priceLte(maxPrice));
        if (registrationNumber != null && !registrationNumber.isBlank()) {
            spec = spec.and(CarSpecifications.registrationContains(registrationNumber));
        }
        if (sellerId != null) spec = spec.and(CarSpecifications.sellerIdEquals(sellerId));

        String sortField = SORTABLE_FIELDS.contains(sort) ? sort : "listedOn";
        Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;

        return carRepository.findAll(spec, Sort.by(direction, sortField)).stream()
                .map(CarResponse::from)
                .collect(Collectors.toList());
    }

    // Populates the "Make" dropdown in the search filter bar.
    @GetMapping("/makes")
    public List<String> distinctMakes() {
        return carRepository.findAll().stream()
                .map(Car::getMake)
                .filter(m -> m != null && !m.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CarResponse getCar(@PathVariable Long id) {
        return CarResponse.from(findOrThrow(id));
    }

    @PostMapping
    public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CarRequest request, HttpServletRequest httpRequest) {
        Long sellerId = AuthUtil.requireUserId(httpRequest);

        Car car = new Car();
        applyRequest(car, request);
        car.setSellerId(sellerId);
        car.setListedOn(LocalDate.now());

        carRepository.save(car);
        return ResponseEntity.status(HttpStatus.CREATED).body(CarResponse.from(car));
    }

    @PutMapping("/{id}")
    public CarResponse updateCar(@PathVariable Long id, @Valid @RequestBody CarRequest request,
                                  HttpServletRequest httpRequest) {
        Long userId = AuthUtil.requireUserId(httpRequest);
        Car car = findOrThrow(id);
        requireOwnership(car, userId);

        applyRequest(car, request);
        carRepository.save(car);
        return CarResponse.from(car);
    }

    // Partial update - only the fields present in the JSON body are changed.
    @PatchMapping("/{id}")
    public CarResponse patchCar(@PathVariable Long id, @RequestBody Map<String, Object> updates,
                                 HttpServletRequest httpRequest) {
        Long userId = AuthUtil.requireUserId(httpRequest);
        Car car = findOrThrow(id);
        requireOwnership(car, userId);

        applyPatch(car, updates);
        carRepository.save(car);
        return CarResponse.from(car);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id, HttpServletRequest httpRequest) {
        Long userId = AuthUtil.requireUserId(httpRequest);
        Car car = findOrThrow(id);
        requireOwnership(car, userId);

        carRepository.delete(car);
        return ResponseEntity.noContent().build();
    }

    private Car findOrThrow(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car listing not found."));
    }

    private void requireOwnership(Car car, Long userId) {
        if (!car.getSellerId().equals(userId)) {
            throw new ForbiddenException("You can only manage your own listings.");
        }
    }

    private void applyRequest(Car car, CarRequest r) {
        car.setMake(r.getMake());
        car.setModel(r.getModel());
        car.setYear(r.getYear());
        car.setPrice(r.getPrice());
        car.setMileage(r.getMileage());
        car.setTransmission(r.getTransmission());
        car.setFuelType(r.getFuelType());
        car.setBodyType(r.getBodyType());
        car.setColor(r.getColor());
        car.setLocation(r.getLocation());
        car.setRegistrationNumber(r.getRegistrationNumber());
        car.setDescription(r.getDescription());
        car.setImage(r.getImage());
    }

    @SuppressWarnings("unchecked")
    private void applyPatch(Car car, Map<String, Object> updates) {
        try {
            if (updates.containsKey("make")) car.setMake((String) updates.get("make"));
            if (updates.containsKey("model")) car.setModel((String) updates.get("model"));
            if (updates.containsKey("year")) car.setYear(((Number) updates.get("year")).intValue());
            if (updates.containsKey("price")) car.setPrice(new BigDecimal(updates.get("price").toString()));
            if (updates.containsKey("mileage")) car.setMileage(((Number) updates.get("mileage")).intValue());
            if (updates.containsKey("transmission")) car.setTransmission((String) updates.get("transmission"));
            if (updates.containsKey("fuelType")) car.setFuelType((String) updates.get("fuelType"));
            if (updates.containsKey("bodyType")) car.setBodyType((String) updates.get("bodyType"));
            if (updates.containsKey("color")) car.setColor((String) updates.get("color"));
            if (updates.containsKey("location")) car.setLocation((String) updates.get("location"));
            if (updates.containsKey("registrationNumber")) car.setRegistrationNumber((String) updates.get("registrationNumber"));
            if (updates.containsKey("description")) car.setDescription((String) updates.get("description"));
            if (updates.containsKey("image")) car.setImage((String) updates.get("image"));
        } catch (ClassCastException | NumberFormatException ex) {
            throw new BadRequestException("One or more fields have an invalid value.");
        }

        if (car.getPrice() != null && car.getPrice().signum() < 0) {
            throw new BadRequestException("Price cannot be negative.");
        }
        if (car.getMileage() != null && car.getMileage() < 0) {
            throw new BadRequestException("Mileage cannot be negative.");
        }
    }
}
