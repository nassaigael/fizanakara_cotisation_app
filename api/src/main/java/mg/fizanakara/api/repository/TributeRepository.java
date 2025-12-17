package mg.fizanakara.api.repository;

import mg.fizanakara.api.models.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface TributeRepository extends JpaRepository<Tribute, Long> {
    Optional<Tribute> findByName(String name);
    boolean existsByName(String name);
    Optional<Tribute> findById(Long id);
}
