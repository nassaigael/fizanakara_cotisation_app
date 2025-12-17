package mg.fizanakara.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TributeDto {
    @NotBlank
    private String name;
}
