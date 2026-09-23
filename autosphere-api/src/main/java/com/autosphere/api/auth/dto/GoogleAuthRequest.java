package com.autosphere.api.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** access_token obtained by the frontend from Google Identity Services. */
public class GoogleAuthRequest {

    @NotBlank(message = "Google access token is required.")
    private String accessToken;

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
}
