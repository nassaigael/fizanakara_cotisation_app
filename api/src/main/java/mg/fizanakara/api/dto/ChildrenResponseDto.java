package mg.fizanakara.api.dto;

import lombok.Data;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.models.enums.MemberStatus;

import java.time.LocalDate;

@Data
public class ChildrenResponseDto {
    private String id;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private Gender gender;
    private String imageUrl;
    private String phoneNumber;
    private LocalDate createdAt;
    private Long sequenceNumber;
    private MemberStatus status;

    private Long districtId;
    private String districtName;

    private Long tributeId;
    private String tributeName;

    private String memberId;
    private String memberFirstName;
    private String memberLastName;
}