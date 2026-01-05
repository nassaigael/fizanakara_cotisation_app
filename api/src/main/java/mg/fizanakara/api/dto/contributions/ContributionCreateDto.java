package mg.fizanakara.api.dto.contributions;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import mg.fizanakara.api.models.enums.ContributionStatus;

import java.math.BigDecimal;
import java.time.Year;

@Data
public class ContributionCreateDto {
    @NotNull(message = "Year is required")
    private Year year;
    private ContributionStatus status = ContributionStatus.PENDING;

}
