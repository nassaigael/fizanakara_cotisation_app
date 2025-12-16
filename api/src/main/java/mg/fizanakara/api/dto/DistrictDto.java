package mg.fizanakara.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DistrictDto {
    @NotBlank
    private String name;
}
