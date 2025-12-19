package mg.fizanakara.api.repository;

import mg.fizanakara.api.models.Admins;
import mg.fizanakara.api.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);
    void deleteByAdmin(Admins admin);
}
