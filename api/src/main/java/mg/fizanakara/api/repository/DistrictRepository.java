package mg.fizanakara.api.repository;

import mg.fizanakara.api.models.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District, Integer> {
    Optional<District> findByName(String name);
    boolean existsByName(String name);
}
