package mg.fizanakara.api.dto;

import lombok.Data;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.models.enums.MemberStatus;

import java.time.LocalDate;

@Data
public class MemberResponseDto {
    private String id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String phoneNumber;
    private Tribute tribute;
    private District district;
    private Gender gender;
    private LocalDate createdAt;
    private MemberStatus status;
}
