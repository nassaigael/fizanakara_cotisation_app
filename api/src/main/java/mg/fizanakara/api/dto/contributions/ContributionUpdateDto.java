package mg.fizanakara.api.dto.contributions;

import lombok.Data;
import mg.fizanakara.api.models.enums.ContributionStatus;

import java.math.BigDecimal;

@Data
public class ContributionUpdateDto {
    private BigDecimal amount;  // Optionnel : ajuster montant

    private ContributionStatus status;  // Optionnel : changer status

    private String memberId;
}
