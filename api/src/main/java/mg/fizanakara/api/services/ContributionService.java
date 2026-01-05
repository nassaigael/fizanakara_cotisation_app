package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.contributions.ContributionResponseDto;
import mg.fizanakara.api.dto.contributions.ContributionUpdateDto;
import mg.fizanakara.api.dto.contributions.ContributionYearDto;
import mg.fizanakara.api.dto.payments.PaymentResponseDto;
import mg.fizanakara.api.exceptions.ContributionNotFoundException;
import mg.fizanakara.api.models.Children;
import mg.fizanakara.api.models.Contribution;
import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.enums.ContributionStatus;
import mg.fizanakara.api.models.enums.MemberStatus;
import mg.fizanakara.api.repository.ChildrenRepository;
import mg.fizanakara.api.repository.ContributionRepository;
import mg.fizanakara.api.repository.MemberRepository;
import mg.fizanakara.api.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContributionService {
    private final ContributionRepository contributionRepository;
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final ChildrenRepository childrenRepository;

    private final AtomicInteger sequenceCounter = new AtomicInteger(1);

    // GET ALL
    @Transactional(readOnly = true)
    public List<ContributionResponseDto> getAllContributions() {
        log.info("Retrieving all contributions");
        return contributionRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // GET BY MEMBER AND YEAR
    @Transactional(readOnly = true)
    public List<ContributionResponseDto> getContributionsByMemberAndYear(String memberId, Year year) {
        log.info("Retrieving contributions for member ID: {} and year: {}", memberId, year);
        return contributionRepository.findByMemberIdAndYear(memberId, year).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ContributionResponseDto> createContributionsForYear(ContributionYearDto dto) {
        Year year = dto.getYear();
        int yearValue = year.getValue();
        log.info("Generating annual contributions for year: {}", year);

        List<Members> eligibleMembers = memberRepository.findEligibleMembersForContribution(yearValue);
        List<Children> eligibleChildren = childrenRepository.findEligibleChildrenForContribution(yearValue);

        List<ContributionResponseDto> created = new ArrayList<>();

        sequenceCounter.set(1);

        for (Members member : eligibleMembers) {
            if (contributionRepository.hasDuplicateByMemberAndYear(member.getId(), year, null)) {
                log.warn("Contribution for member {} and year {} already exists – skipping", member.getId(), year);
                continue;
            }
            BigDecimal amount = calculateAmountForUser(member, year);
            Contribution contribution = createSingleContribution(year, amount, ContributionStatus.PENDING, member.getId(), null);
            created.add(mapToResponseDto(contribution));
        }

        // Génération pour enfants (childId = child ID)
        for (Children child : eligibleChildren) {
            String parentMemberId = child.getMember().getId();
            String childId = child.getId();
            if (contributionRepository.hasDuplicateByMemberAndYear(parentMemberId, year, childId)) {
                log.warn("Contribution for child {} (parent {}) and year {} already exists – skipping", childId, parentMemberId, year);
                continue;
            }
            BigDecimal amount = calculateAmountForUser(child, year);
            Contribution contribution = createSingleContribution(year, amount, ContributionStatus.PENDING, parentMemberId, childId);
            created.add(mapToResponseDto(contribution));
        }

        log.info("Generated {} new contributions for year: {}", created.size(), year);
        return created;
    }

    // ← FIX : Création single pour membre (auto-génération)
    @Transactional
    public ContributionResponseDto createSingleContributionForMember(Year year, String memberId) {
        if (contributionRepository.hasDuplicateByMemberAndYear(memberId, year, null)) {
            throw new IllegalArgumentException("Contribution for this member and year already exists");
        }

        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID: " + memberId));

        BigDecimal amount = calculateAmountForUser(member, year);

        Contribution contribution = Contribution.builder()
                .year(year)
                .amount(amount)
                .status(ContributionStatus.PENDING)
                .dueDate(LocalDate.of(year.getValue(), 12, 31))
                .member(member)
                .childId(null)
                .build();

        // ← FIX : Set suffix unique
        String suffix = String.format("%03d", sequenceCounter.getAndIncrement());
        contribution.setSequenceSuffix(suffix);
        contribution.setId(contribution.generatedCustomId());  // "COT2026-001"

        Contribution saved = contributionRepository.save(contribution);
        return mapToResponseDto(saved);
    }

    // ← FIX : Création single pour enfant (auto-génération)
    @Transactional
    public ContributionResponseDto createSingleContributionForChild(Year year, String parentMemberId, String childId) {
        if (contributionRepository.hasDuplicateByMemberAndYear(parentMemberId, year, childId)) {
            throw new IllegalArgumentException("Contribution for this child and year already exists");
        }

        Members member = memberRepository.findById(parentMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Parent Member ID: " + parentMemberId));

        Children child = childrenRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Child ID: " + childId));

        BigDecimal amount = calculateAmountForUser(child, year);

        Contribution contribution = Contribution.builder()
                .year(year)
                .amount(amount)
                .status(ContributionStatus.PENDING)
                .dueDate(LocalDate.of(year.getValue(), 12, 31))
                .member(member)
                .childId(childId)
                .build();

        // ← FIX : Set suffix unique
        String suffix = String.format("%03d", sequenceCounter.getAndIncrement());
        contribution.setSequenceSuffix(suffix);
        contribution.setId(contribution.generatedCustomId());  // "COT2026-002"

        Contribution saved = contributionRepository.save(contribution);
        return mapToResponseDto(saved);
    }

    // UPDATE
    @Transactional
    public ContributionResponseDto updateContribution(String id, ContributionUpdateDto dto) {
        Contribution contribution = contributionRepository.findById(id)
                .orElseThrow(() -> new ContributionNotFoundException("Contribution not found with ID: " + id));

        if (dto.getAmount() != null) contribution.setAmount(dto.getAmount());
        if (dto.getStatus() != null) contribution.setStatus(dto.getStatus());
        if (dto.getMemberId() != null) {
            Members member = memberRepository.findById(dto.getMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));
            contribution.setMember(member);
        }

        log.info("Updating contribution ID: {}", id);
        Contribution updated = contributionRepository.save(contribution);
        return mapToResponseDto(updated);
    }

    // DELETE
    @Transactional
    public void deleteContribution(String id) {
        Contribution contribution = contributionRepository.findById(id)
                .orElseThrow(() -> new ContributionNotFoundException("Contribution not found with ID: " + id));
        log.info("Deleting contribution ID: {}", id);
        contributionRepository.delete(contribution);
    }

    // Mise à jour status après paiement
    @Transactional
    public void updateContributionStatusAfterPayment(String contributionId) {
        Contribution contribution = contributionRepository.findById(contributionId)
                .orElseThrow(() -> new ContributionNotFoundException("Contribution not found with ID: " + contributionId));

        BigDecimal totalPaid = paymentRepository.getTotalPaidByContributionId(contributionId);
        if (totalPaid == null) totalPaid = BigDecimal.ZERO;

        log.info("Updating status for contribution ID: {} totalPaid: {} amount: {}", contributionId, totalPaid, contribution.getAmount());

        if (totalPaid.compareTo(contribution.getAmount()) >= 0) {
            contribution.setStatus(ContributionStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            contribution.setStatus(ContributionStatus.PARTIAL);
        } else if (LocalDate.now().isAfter(contribution.getDueDate())) {
            contribution.setStatus(ContributionStatus.OVERDUE);
        } else {
            contribution.setStatus(ContributionStatus.PENDING);
        }

        contributionRepository.save(contribution);
    }

    // Mapper vers DTO
    private ContributionResponseDto mapToResponseDto(Contribution contribution) {
        ContributionResponseDto dto = new ContributionResponseDto();
        dto.setId(contribution.getId());
        dto.setYear(contribution.getYear());
        dto.setAmount(contribution.getAmount());
        dto.setStatus(contribution.getStatus());
        dto.setDueDate(contribution.getDueDate());
        dto.setMemberId(contribution.getMember().getId());
        dto.setMemberName(contribution.getMember().getFirstName() + " " + contribution.getMember().getLastName());

        if (contribution.getChildId() != null) {
            dto.setChildId(contribution.getChildId());
        }

        BigDecimal totalPaid = paymentRepository.getTotalPaidByContributionId(contribution.getId());
        dto.setTotalPaid(totalPaid != null ? totalPaid : BigDecimal.ZERO);
        dto.setRemaining(contribution.getAmount().subtract(dto.getTotalPaid()));

        dto.setPayments(paymentRepository.findByContributionId(contribution.getId()).stream()
                .map(payment -> {
                    PaymentResponseDto pDto = new PaymentResponseDto();
                    pDto.setId(payment.getId());
                    pDto.setAmountPaid(payment.getAmountPaid());
                    pDto.setPaymentDate(LocalDate.from(payment.getPaymentDate()));
                    pDto.setStatus(payment.getStatus());
                    pDto.setContributionId(payment.getContribution().getId());
                    return pDto;
                })
                .collect(Collectors.toList()));

        return dto;
    }

    // ← FIX : createSingleContribution avec suffix unique
    private Contribution createSingleContribution(Year year, BigDecimal amount, ContributionStatus status, String memberId, String childId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID: " + memberId));

        Contribution contribution = Contribution.builder()
                .year(year)
                .amount(amount)
                .status(status)
                .dueDate(LocalDate.of(year.getValue(), 12, 31))
                .member(member)
                .childId(childId)
                .build();

        // ← FIX : Set suffix unique
        String suffix = String.format("%03d", sequenceCounter.getAndIncrement());
        contribution.setSequenceSuffix(suffix);
        contribution.setId(contribution.generatedCustomId());  // "COT2026-001"

        return contributionRepository.save(contribution);
    }

    // Calcul générique
    private BigDecimal calculateAmountForUser(Object user, Year year) {
        LocalDate birthDate = (user instanceof Members) ? ((Members) user).getBirthDate() : ((Children) user).getBirthDate();
        MemberStatus status = (user instanceof Members) ? ((Members) user).getStatus() : ((Children) user).getStatus();
        int age = calculateAgeAtYear(birthDate, year);
        if (age >= 18 && age <= 21 && status == MemberStatus.STUDENT) {
            return BigDecimal.valueOf(30000);
        }
        return BigDecimal.valueOf(40000);
    }

    private int calculateAgeAtYear(LocalDate birthDate, Year year) {
        LocalDate endOfYear = LocalDate.of(year.getValue(), 12, 31);
        return endOfYear.getYear() - birthDate.getYear() - (endOfYear.isBefore(birthDate.withDayOfYear(birthDate.getDayOfYear())) ? 1 : 0);
    }
}