package mg.fizanakara.api.repository;

import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Members, String> {

    Optional<Members> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);

    List<Members> findByFirstNameAndLastName(String firstName, String lastName);

    @Query("SELECT (SELECT COUNT(m) FROM Members m WHERE m.firstName = :firstName AND m.lastName = :lastName AND m.birthDate = :birthDate AND m.phoneNumber = :phoneNumber AND m.district.id = :districtId AND m.tribute.id = :tributeId AND m.status = :status AND (:currentId IS NULL OR m.id != :currentId)) + " +
            "(SELECT COUNT(c) FROM Children c WHERE c.firstName = :firstName AND c.lastName = :lastName AND c.birthDate = :birthDate AND c.phoneNumber = :phoneNumber AND c.district.id = :districtId AND c.tribute.id = :tributeId AND c.status = :status AND (:currentId IS NULL OR c.id != :currentId)) > 0")
    boolean hasDuplicateByKeyFields(@Param("firstName") String firstName,
                                    @Param("lastName") String lastName,
                                    @Param("birthDate") LocalDate birthDate,
                                    @Param("phoneNumber") String phoneNumber,
                                    @Param("districtId") Long districtId,
                                    @Param("tributeId") Long tributeId,
                                    @Param("status") MemberStatus status,
                                    @Param("currentId") String currentId);

    @Query("SELECT m FROM Members m WHERE :yearValue - YEAR(m.birthDate) > 18 OR (:yearValue = YEAR(m.birthDate) AND MONTH(m.birthDate) < 12 AND DAY(m.birthDate) <= 31)")
    List<Members> findEligibleMembersForContribution(@Param("yearValue") int yearValue);

    @Query("SELECT m FROM Members m WHERE m.district.id = :districtId")
    List<Members> findByDistrictId(@Param("districtId") Long districtId);

    @Query("SELECT m FROM Members m WHERE m.tribute.id = :tributeId")
    List<Members> findByTributeId(@Param("tributeId") Long tributeId);

    List<Members> findByStatus(MemberStatus status);
}