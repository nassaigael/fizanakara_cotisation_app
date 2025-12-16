package mg.fizanakara.api.dto;

public record AdminsResponseDTO(
    String id,
    String email,
    String firstName,
    String lastName,
    Boolean verified
)
    {}
