package com.autosphere.api.user.dto;

import jakarta.validation.constraints.Size;

/**
 * Task 1.1 - Profile Management.
 * Deliberately has NO name/email fields: those come from the API and must
 * stay read-only, so even if a client sends them they are simply never
 * applied (see UserController#updateProfile).
 */
public class ProfileUpdateRequest {

    @Size(max = 30, message = "Phone number is too long.")
    private String phone;

    @Size(max = 180, message = "Address is too long.")
    private String address;

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
