package com.autosphere.api.auth.dto;

/** Normalised profile shape returned by whichever OAuth provider was used. */
public class OAuthProfile {
    public String email;
    public String name;
    public String picture;
    public String providerId;

    public OAuthProfile(String email, String name, String picture, String providerId) {
        this.email = email;
        this.name = name;
        this.picture = picture;
        this.providerId = providerId;
    }
}
