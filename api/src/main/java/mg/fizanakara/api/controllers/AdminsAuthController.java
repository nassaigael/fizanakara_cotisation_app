package mg.fizanakara.api.controllers;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mg.fizanakara.api.dto.AdminResponseDto;
import mg.fizanakara.api.exceptions.AdminsException;
import mg.fizanakara.api.models.Admins;
import mg.fizanakara.api.dto.UpdateAdminDto;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.security.JwtUtil;
import mg.fizanakara.api.services.AdminsService;
import mg.fizanakara.api.services.PasswordResetService;
import mg.fizanakara.api.services.RefreshTokenService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminsAuthController {
    private final AuthenticationManager authenticationManager;
    private final AdminsService adminsService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;

    // REGISTER (public)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated RegisterRequest req) throws AdminsException {
        Admins admin = Admins.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .birthDate(req.getBirthDate())
                .gender(Gender.valueOf(req.getGender()))
                .imageUrl(req.getImageUrl())
                .phoneNumber(req.getPhoneNumber())
                .email(req.getEmail())
                .password(req.getPassword())
                .build();

        Admins saved = adminsService.register(admin);
        log.info("New admin saved : {}", saved.getEmail());
        return ResponseEntity.ok(new AdminResponseDto(saved));
    }

    // LOGIN (public)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            String accessToken = jwtUtil.generateAccessToken(req.getEmail());
            Admins admin = adminsService.findByEmail(req.getEmail()).orElseThrow();
            var rt = refreshTokenService.createRefreshToken(admin);

            log.info("Login success of : {}", req.getEmail());
            return ResponseEntity.ok(Map.of(
                    "user", Map.of(
                            "id", admin.getId(),
                            "email", admin.getEmail(),
                            "firstname", admin.getFirstName(),
                            "lastname", admin.getLastName(),
                            "gender", admin.getGender()),
                    "accessToken", accessToken,
                    "refreshToken", rt.getToken()
            ));
        } catch (BadCredentialsException e) {
            log.warn("Login failed for {} : Credentials invalids", req.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email or password incorrect", "success", false));
        } catch (Exception e) {
            log.error("Error login for {} : {}", req.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Failed authentication", "success", false));
        }
    }

    // DELETE BY ID
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        try {
            Admins admin = adminsService.findById(id)
                    .orElseThrow(() -> new AdminsException("Admin not found with ID : " + id));
            adminsService.deleteAdmins(admin);
            log.info("Admin Deleted : {}", id);
            return ResponseEntity.ok(Map.of("message", "Admin deleted with success", "success", true));
        } catch (AdminsException e) {
            log.warn("Delete admin failed : ID {} not found", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage(), "success", false));
        } catch (Exception e) {
            log.error("Failed delete admin {} : {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Échec de la suppression de l'admin", "success", false));
        }
    }

    // Refresh token
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> body) {
        String token = body.get("refreshToken");
        var stored = refreshTokenService.findByToken(token);
        if (stored.getExpiryDate().isBefore(java.time.Instant.now())) {
            refreshTokenService.deleteByToken(token);
            return ResponseEntity.status(401).body("Refresh token expired");
        }

        String accessToken = jwtUtil.generateAccessToken(stored.getAdmin().getEmail());
        log.debug("Refresh token réussi pour : {}", stored.getAdmin().getEmail());
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    // Forgot password (public) - sends email if exists
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        log.info("Demande reset password pour : {}", email);
        // This will throw if no account; you may prefer to swallow exception and always return generic message
        passwordResetService.createAndSendPasswordResetToken(email);
        return ResponseEntity.ok("Password reset email sent if the account exists.");
    }

    // Reset password (public)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        passwordResetService.resetPassword(token, newPassword);
        log.info("Password reset réussi pour token : {}", token.substring(0, 8) + "...");
        return ResponseEntity.ok("Password reset successfully.");
    }

    // Protected route example: Get current user
    @GetMapping("/admins/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        String email = authentication.getName();
        Admins admin = adminsService.findByEmail(email).orElseThrow();
        log.debug("Profil récupéré pour : {}", email);
        //admin.setPassword(null);  // ← RETIRÉ : Plus besoin avec DTO
        return ResponseEntity.ok(new AdminResponseDto(admin));
    }

    // Update profil (protégé, self-update via JWT)
    @PatchMapping("/admins/me")
    public ResponseEntity<?> updateMe(@RequestBody @Validated UpdateAdminDto req, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Non authentifié", "success", false));
        }
        String email = authentication.getName();
        try {
            // ← FIX : Service retourne DTO, type changé pour matcher
            AdminResponseDto updated = adminsService.updateAdmin(email, req);  // Unifié nom DTO
            log.info("Update profil réussi pour : {}", email);
            return ResponseEntity.ok(Map.of(
                    "message", "Profil mis à jour avec succès",
                    "success", true,
                    "user", updated  // DTO direct
            ));
        } catch (AdminsException e) {
            log.warn("Update profil échoué pour {} : {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage(), "success", false));
        } catch (Exception e) {
            log.error("Erreur update profil pour {} : {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Échec de la mise à jour", "success", false));
        }
    }

    @Data
    static class RegisterRequest {
        @NotBlank private String firstName;
        @NotBlank private String lastName;
        @NotNull private java.time.LocalDate birthDate;
        @NotBlank private String gender; // adapt to your Gender enum serialization
        @NotBlank private String imageUrl;
        @NotBlank private String phoneNumber;
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data
    static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }
}