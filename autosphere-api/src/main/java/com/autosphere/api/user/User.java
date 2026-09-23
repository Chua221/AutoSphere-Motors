package com.autosphere.api.user;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    // Null for accounts created purely via OAuth (Google/GitHub/Facebook).
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(length = 30)
    private String phone;

    @Column(length = 180)
    private String address;

    @Column(length = 500)
    private String picture;

    // "local", "google", "github" or "facebook"
    @Column(length = 20)
    private String provider;

    @Column(name = "provider_id", length = 120)
    private String providerId;

    @Column(nullable = false)
    private LocalDate joined;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public LocalDate getJoined() { return joined; }
    public void setJoined(LocalDate joined) { this.joined = joined; }
}
