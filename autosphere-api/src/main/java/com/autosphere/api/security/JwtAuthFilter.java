package com.autosphere.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Reads the "Authorization: Bearer <token>" header (if present) on every
 * /api/** request and, when valid, exposes the signed-in user's id as a
 * request attribute. Endpoints that require a session read this attribute
 * themselves via {@link AuthUtil} and reject the request (401/403) when it
 * is missing or does not match the resource being modified - this keeps
 * public endpoints (browsing cars, viewing a profile) and protected ones
 * (editing a profile, creating/editing/deleting a listing) in the same
 * simple filter without a full Spring Security configuration.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    public static final String USER_ID_ATTR = "authUserId";

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            Long userId = jwtService.parseUserId(token);
            if (userId != null) {
                request.setAttribute(USER_ID_ATTR, userId);
            }
        }
        chain.doFilter(request, response);
    }
}
