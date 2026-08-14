package com.chorepay.backend.auth;

import com.chorepay.backend.security.JwtService;
import com.chorepay.backend.user.User;
import com.chorepay.backend.user.UserRepository;
import com.chorepay.backend.user.UserType;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.util.Optional;
import java.util.UUID;


@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

@Test
void register_shouldCreateUserWithHashedPassword() {

    RegisterRequest request =
            new RegisterRequest(
                    "Sarah",
                    "SARAH@example.com",
                    "password123",
                    UserType.PARENT
            );

    when(passwordEncoder
            .encode("password123"))
            .thenReturn("hashed-password");

    when(userRepository
            .save(any(User.class)))
            .thenAnswer(invocation ->
                    invocation.getArgument(0)
            );

    User result =
            authService.register(request);

    assertEquals(
            "Sarah",
            result.getName()
    );

    assertEquals(
            "sarah@example.com",
            result.getEmail()
    );

    assertEquals(
            UserType.PARENT,
            result.getUserType()
    );

    ArgumentCaptor<User> userCaptor =
            ArgumentCaptor.forClass(User.class);

    verify(userRepository)
            .save(userCaptor.capture());

    User savedUser =
            userCaptor.getValue();

    assertEquals(
            "Sarah",
            savedUser.getName()
    );

    assertEquals(
            "sarah@example.com",
            savedUser.getEmail()
    );

    assertEquals(
            "hashed-password",
            savedUser.getPasswordHash()
    );

    assertEquals(
            UserType.PARENT,
            savedUser.getUserType()
    );

    verify(passwordEncoder)
            .encode("password123");
}

@Test
void register_shouldRejectDuplicateEmail() {

    RegisterRequest request =
            new RegisterRequest(
                    "Sarah",
                    "SARAH@example.com",
                    "password123",
                    UserType.PARENT
            );

    when(userRepository
            .existsByEmail("sarah@example.com"))
            .thenReturn(true);

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () -> authService.register(request)
            );

    assertEquals(
            "An account with this email already exists.",
            exception.getMessage()
    );

    verify(userRepository)
            .existsByEmail(
                    "sarah@example.com"
            );

    verify(
            userRepository,
            never()
    ).save(
            any(User.class)
    );

    verifyNoInteractions(passwordEncoder);
}


@Test
void login_shouldReturnLoginResponseWithToken() {

    User user =
            mock(User.class);

    when(user.getId())
            .thenReturn(
                    UUID.randomUUID()
            );

    when(user.getName())
            .thenReturn("Sarah");

    when(user.getEmail())
            .thenReturn(
                    "sarah@example.com"
            );

    when(user.getUserType())
            .thenReturn(
                    UserType.PARENT
            );

    when(user.getPasswordHash())
            .thenReturn(
                    "hashed-password"
            );

    when(userRepository
            .findByEmail("sarah@example.com"))
            .thenReturn(
                    Optional.of(user)
            );

    when(passwordEncoder
            .matches(
                    "password123",
                    "hashed-password"
            ))
            .thenReturn(true);

    when(jwtService
            .generateToken(user))
            .thenReturn(
                    "test-jwt-token"
            );

    LoginRequest request =
            new LoginRequest(
                    "SARAH@example.com",
                    "password123"
            );

    LoginResponse result =
            authService.login(request);

    assertEquals(
            user.getId(),
            result.id()
    );

    assertEquals(
            "Sarah",
            result.name()
    );

    assertEquals(
            "sarah@example.com",
            result.email()
    );

    assertEquals(
            UserType.PARENT,
            result.userType()
    );

    assertEquals(
            "test-jwt-token",
            result.token()
    );

    verify(userRepository)
            .findByEmail(
                    "sarah@example.com"
            );

    verify(passwordEncoder)
            .matches(
                    "password123",
                    "hashed-password"
            );

    verify(jwtService)
            .generateToken(user);
}

@Test
void login_shouldRejectWhenPasswordIsWrong() {

    User user =
            mock(User.class);

    when(user.getPasswordHash())
            .thenReturn("hashed-password");

    when(userRepository
            .findByEmail("sarah@example.com"))
            .thenReturn(
                    Optional.of(user)
            );

    when(passwordEncoder
            .matches(
                    "wrong-password",
                    "hashed-password"
            ))
            .thenReturn(false);

    LoginRequest request =
            new LoginRequest(
                    "SARAH@example.com",
                    "wrong-password"
            );

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () -> authService.login(request)
            );

    assertEquals(
            "Invalid email or password.",
            exception.getMessage()
    );

    verify(userRepository)
            .findByEmail(
                    "sarah@example.com"
            );

    verify(passwordEncoder)
            .matches(
                    "wrong-password",
                    "hashed-password"
            );

    verify(
            jwtService,
            never()
    ).generateToken(
            any(User.class)
    );
}

@Test
void login_shouldRejectWhenEmailDoesNotExist() {

    when(userRepository
            .findByEmail("missing@example.com"))
            .thenReturn(
                    Optional.empty()
            );

    LoginRequest request =
            new LoginRequest(
                    "MISSING@example.com",
                    "password123"
            );

    IllegalArgumentException exception =
            assertThrows(
                    IllegalArgumentException.class,
                    () -> authService.login(request)
            );

    assertEquals(
            "Invalid email or password.",
            exception.getMessage()
    );

    verify(userRepository)
            .findByEmail(
                    "missing@example.com"
            );

    verifyNoInteractions(passwordEncoder);

    verifyNoInteractions(jwtService);
}


}