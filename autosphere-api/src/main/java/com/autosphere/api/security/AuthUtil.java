package com.autosphere.api.security;

import com.autosphere.api.common.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;

public final class AuthUtil {

    private AuthUtil() {}

    /** Returns the authenticated user's id, or throws 401 when no valid token was sent. */
    public static Long requireUserId(HttpServletRequest request) {
        Object value = request.getAttribute(JwtAuthFilter.USER_ID_ATTR);
        if (value == null) {
            throw new UnauthorizedException("You must be logged in to do that.");
        }
        return (Long) value;
    }
}
