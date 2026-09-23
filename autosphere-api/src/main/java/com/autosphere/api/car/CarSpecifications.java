package com.autosphere.api.car;

import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

/**
 * Task 1.3 - Search & Filter Functionality: Make, Model, Year, Registration
 * and Price Range, composed with JPA Specifications so any combination of
 * filters can be applied in a single query.
 */
public final class CarSpecifications {

    private CarSpecifications() {}

    public static Specification<Car> makeEquals(String make) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("make")), make.toLowerCase());
    }

    public static Specification<Car> modelContains(String model) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("model")), "%" + model.toLowerCase() + "%");
    }

    public static Specification<Car> yearEquals(Integer year) {
        return (root, query, cb) -> cb.equal(root.get("year"), year);
    }

    public static Specification<Car> registrationContains(String registrationNumber) {
        return (root, query, cb) -> cb.like(cb.lower(root.get("registrationNumber")),
                "%" + registrationNumber.toLowerCase() + "%");
    }

    public static Specification<Car> priceGte(BigDecimal minPrice) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice);
    }

    public static Specification<Car> priceLte(BigDecimal maxPrice) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice);
    }

    public static Specification<Car> sellerIdEquals(Long sellerId) {
        return (root, query, cb) -> cb.equal(root.get("sellerId"), sellerId);
    }
}
