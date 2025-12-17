package mg.fizanakara.api.dto;

import lombok.Data;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.models.enums.MemberStatus;

import java.time.LocalDate;

@Data
public class MemberDto {
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private Gender gender;
    private String imageUrl;
    private String phoneNumber;
    private MemberStatus status;
    private Long districtId;
    private Long tributeId;
}
