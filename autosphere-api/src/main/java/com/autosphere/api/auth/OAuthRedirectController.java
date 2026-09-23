package com.autosphere.api.auth;

import com.autosphere.api.auth.dto.OAuthProfile;
import com.autosphere.api.config.AppProperties;
import com.autosphere.api.security.JwtService;
import com.autosphere.api.user.User;
import com.autosphere.api.user.dto.UserResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * GitHub / Facebook "authorization code" callbacks. These are plain browser
 * redirects (not axios/JSON calls) - the provider sends the browser here
 * directly, so the response is always a 302 back to the React app, exactly
 * as the previous Node oauth-server did at /auth/github|facebook/callback.
 */
@RestController
public class OAuthRedirectController {

    private final GithubOAuthService githubOAuthService;
    private final FacebookOAuthService facebookOAuthService;
    private final OAuthUserService oAuthUserService;
    private final JwtService jwtService;
    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public OAuthRedirectController(GithubOAuthService githubOAuthService, FacebookOAuthService facebookOAuthService,
                                    OAuthUserService oAuthUserService, JwtService jwtService,
                                    AppProperties appProperties, ObjectMapper objectMapper) {
        this.githubOAuthService = githubOAuthService;
        this.facebookOAuthService = facebookOAuthService;
        this.oAuthUserService = oAuthUserService;
        this.jwtService = jwtService;
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/auth/github/callback")
    public void githubCallback(@RequestParam(required = false) String code,
                                @RequestParam(required = false) String state,
                                @RequestParam(required = false) String error,
                                @RequestParam(name = "error_description", required = false) String errorDescription,
                                HttpServletResponse response) throws IOException {
        if (error != null) {
            redirectWithError(response, "github", errorDescription != null ? errorDescription : "You cancelled the GitHub sign-in.");
            return;
        }
        if (code == null) {
            redirectWithError(response, "github", "GitHub did not return an authorization code.");
            return;
        }
        try {
            OAuthProfile profile = githubOAuthService.exchange(code);
            User user = oAuthUserService.findOrCreate(profile, "github");
            redirectWithSession(response, user, state);
        } catch (Exception ex) {
            redirectWithError(response, "github", "GitHub sign-in failed. Please try again.");
        }
    }

    @GetMapping("/auth/facebook/callback")
    public void facebookCallback(@RequestParam(required = false) String code,
                                  @RequestParam(required = false) String state,
                                  @RequestParam(required = false) String error,
                                  @RequestParam(name = "error_reason", required = false) String errorReason,
                                  HttpServletResponse response) throws IOException {
        if (error != null || errorReason != null) {
            redirectWithError(response, "facebook", "You cancelled the Facebook sign-in.");
            return;
        }
        if (code == null) {
            redirectWithError(response, "facebook", "Facebook did not return an authorization code.");
            return;
        }
        try {
            OAuthProfile profile = facebookOAuthService.exchange(code);
            User user = oAuthUserService.findOrCreate(profile, "facebook");
            redirectWithSession(response, user, state);
        } catch (Exception ex) {
            redirectWithError(response, "facebook", "Facebook sign-in failed. Please try again.");
        }
    }

    private void redirectWithSession(HttpServletResponse response, User user, String state) throws IOException {
        String token = jwtService.generateToken(user.getId());
        String encodedUser;
        try {
            byte[] json = objectMapper.writeValueAsBytes(UserResponse.from(user));
            encodedUser = Base64.getEncoder().encodeToString(json);
        } catch (Exception ex) {
            redirectWithError(response, "oauth", "Could not finish signing you in.");
            return;
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(appProperties.getClientUrl() + "/oauth/callback")
                .queryParam("token", encode(token))
                .queryParam("user", encode(encodedUser));
        if (state != null) {
            builder.queryParam("state", encode(state));
        }
        response.sendRedirect(builder.build(true).toUriString());
    }

    private void redirectWithError(HttpServletResponse response, String provider, String message) throws IOException {
        String url = UriComponentsBuilder.fromHttpUrl(appProperties.getClientUrl() + "/oauth/callback")
                .queryParam("error", encode(message))
                .queryParam("provider", encode(provider))
                .build(true).toUriString();
        response.sendRedirect(url);
    }

    private String encode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
