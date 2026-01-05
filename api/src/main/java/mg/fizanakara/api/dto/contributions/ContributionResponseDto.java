package mg.fizanakara.api.dto.contributions;

import lombok.Data;
import mg.fizanakara.api.dto.payments.PaymentResponseDto;
import mg.fizanakara.api.models.enums.ContributionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;

@Data
public class ContributionResponseDto {
    private String id;
    private Year year;
    private BigDecimal amount;
    private ContributionStatus status;
    private LocalDate dueDate;
    private BigDecimal totalPaid;  // Somme paiements
    private BigDecimal remaining;  // Solde restant
    private String memberId;
    private String memberName;  // Nested nom parent
    private String childId;  // Optionnel : ID enfant si cotisation enfant
    private List<PaymentResponseDto> payments;  // Liste paiements
}