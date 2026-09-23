package com.autosphere.api.user.dto;

import com.autosphere.api.user.User;

import java.time.LocalDate;

/** Never includes the password hash - this is what the frontend receives. */
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String picture;
    private String provider;
    private LocalDate joined;

    public static UserResponse from(User u) {
        UserResponse r = new UserResponse();
        r.id = u.getId();
        r.name = u.getName();
        r.email = u.getEmail();
        r.phone = u.getPhone();
        r.address = u.getAddress();
        r.picture = u.getPicture();
        r.provider = u.getProvider();
        r.joined = u.getJoined();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getPicture() { return picture; }
    public String getProvider() { return provider; }
    public LocalDate getJoined() { return joined; }
}
