package mg.fizanakara.api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMemberDto {
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String gender;
    private TributeDto tribute;
    private DistrictDto district;
    private String imageUrl;
    private String phoneNumber;
    private MemberDto status;
}
