package mg.fizanakara.api.repository;

import mg.fizanakara.api.models.Children;
import mg.fizanakara.api.models.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChildrenRepository extends JpaRepository<Children, String> {

    Optional<Children> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);

    List<Children> findByFirstNameAndLastName(String firstName, String lastName);

    List<Children> findByMemberId(String memberId);

    @Query("SELECT (SELECT COUNT(c) FROM Children c WHERE c.firstName = :firstName AND c.lastName = :lastName AND c.birthDate = :birthDate AND c.phoneNumber = :phoneNumber AND c.district.id = :districtId AND c.tribute.id = :tributeId AND c.status = :status AND c.member.id = :memberId AND (:currentId IS NULL OR c.id != :currentId)) + " +
            "(SELECT COUNT(m) FROM Members m WHERE m.firstName = :firstName AND m.lastName = :lastName AND m.birthDate = :birthDate AND m.phoneNumber = :phoneNumber AND m.district.id = :districtId AND m.tribute.id = :tributeId AND m.status = :status AND (:currentId IS NULL OR m.id != :currentId)) > 0")
    boolean hasDuplicateByKeyFields(@Param("firstName") String firstName,
                                    @Param("lastName") String lastName,
                                    @Param("birthDate") LocalDate birthDate,
                                    @Param("phoneNumber") String phoneNumber,
                                    @Param("districtId") Long districtId,
                                    @Param("tributeId") Long tributeId,
                                    @Param("status") MemberStatus status,
                                    @Param("memberId") String memberId,
                                    @Param("currentId") String currentId);

    @Query("SELECT c FROM Children c WHERE :yearValue - YEAR(c.birthDate) > 18 OR (:yearValue = YEAR(c.birthDate) AND MONTH(c.birthDate) < 12 AND DAY(c.birthDate) <= 31)")
    List<Children> findEligibleChildrenForContribution(@Param("yearValue") int yearValue);

    @Query("SELECT c FROM Children c WHERE c.district.id = :districtId")
    List<Children> findByDistrictId(@Param("districtId") Long districtId);

    @Query("SELECT c FROM Children c WHERE c.tribute.id = :tributeId")
    List<Children> findByTributeId(@Param("tributeId") Long tributeId);

    List<Children> findByStatus(MemberStatus status);
}