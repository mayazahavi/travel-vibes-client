/**
 * Service to handle authentication API calls.
 * Currently mocks the server response.
 * Replace the logic inside these functions with real fetch/axios calls when connecting to the server.
 */

export const login = async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate basic validation (Server side logic simulation)
    if (password === "error") {
        throw new Error("Invalid credentials");
    }

    // Mock response
    const mockUser = {
        id: "1",
        name: "Test User",
        email: email,
    };
    const mockToken = "mock-jwt-token";

    return { user: mockUser, token: mockToken };
};

export const register = async (userData) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
    };
    const mockToken = "mock-jwt-token";

    return { user: mockUser, token: mockToken };
};

export const logout = () => {
    // If the server needed a logout call (e.g. invalidate token), it would go here.
    // For JWT, usually just client side, but sometimes we notify server.
    // For now, nothing to await.
    return Promise.resolve();
};
