package mg.fizanakara.api.dto;

import lombok.Data;

@Data
public class TributeDto {
    @NotBlank
    private String name;
}
