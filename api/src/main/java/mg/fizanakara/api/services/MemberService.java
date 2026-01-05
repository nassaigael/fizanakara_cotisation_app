package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.contributions.ContributionResponseDto;
import mg.fizanakara.api.dto.members.MemberDto;
import mg.fizanakara.api.dto.members.MemberResponseDto;
import mg.fizanakara.api.exceptions.MemberNotFoundException;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.DistrictRepository;
import mg.fizanakara.api.repository.MemberRepository;
import mg.fizanakara.api.repository.TributeRepository;
import mg.fizanakara.api.services.ContributionService;  // ← FIX : Pour auto single
import mg.fizanakara.api.services.SequenceService;  // Existant
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    private final MemberRepository memberRepository;
    private final DistrictRepository districtRepository;
    private final TributeRepository tributeRepository;
    private final SequenceService sequenceService;
    private final ContributionService contributionService;  // ← FIX : Pour auto single

    // GET ALL
    @Transactional(readOnly = true)
    public List<MemberResponseDto> getAllMembers() {
        log.info("Recuperate all members");
        List<Members> members = memberRepository.findAll();
        return members.stream()
                .map(this::mapToResponseDto).toList();
    }

    // GET BY ID
    @Transactional(readOnly = true)
    public MemberResponseDto getMemberById(String id) {
        log.info("Recuperate member with ID : {}", id);
        Members member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with ID : " + id));
        return mapToResponseDto(member);
    }

    // CREATE
    @Transactional
    public MemberResponseDto createMember(MemberDto dto) {
        log.info("Checking duplicate for firstName='{}', lastName='{}', birthDate='{}', phone='{}', districtId={}, tributeId={}, status={}",
                dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhoneNumber(), dto.getDistrictId(), dto.getTributeId(), dto.getStatus());

        boolean hasDuplicate = memberRepository.hasDuplicateByKeyFields(
                dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhoneNumber(),
                dto.getDistrictId(), dto.getTributeId(), dto.getStatus(), null);
        log.info("Cross-table duplicate check result: {}", hasDuplicate);

        if (hasDuplicate) {
            throw new IllegalArgumentException("A member with these details already exists (in members or children)");
        }

        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid District ID: " + dto.getDistrictId()));
        Tribute tribute = tributeRepository.findById(dto.getTributeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Tribute ID: " + dto.getTributeId()));

        log.info("Creating member: {} {}", dto.getFirstName(), dto.getLastName());
        Members member = Members.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(dto.getBirthDate())
                .gender(dto.getGender())
                .imageUrl(dto.getImageUrl())
                .phoneNumber(dto.getPhoneNumber())
                .status(dto.getStatus())
                .district(district)
                .tribute(tribute)
                .build();

        Long nextSeq = sequenceService.getNextSequence("mbr_seq");
        member.setCreatedAt(LocalDate.now());
        member.setSequenceNumber(nextSeq);
        member.setId(member.generatedCustomId());

        Members saved = memberRepository.save(member);

        // ← FIX : Auto-génération single cotisation pour année courante si éligible (pas batch, childId null)
        Year currentYear = Year.now();  // 2026
        LocalDate dueDate = LocalDate.of(currentYear.getValue(), 12, 31);
        if (saved.getCreatedAt().isBefore(dueDate) && isEligibleForContribution(saved, currentYear)) {
            try {
                ContributionResponseDto newContribution = contributionService.createSingleContributionForMember(currentYear, saved.getId());  // ← FIX : Méthode single sans DTO
                log.info("Auto-generated contribution for new member {} in year {}", saved.getId(), currentYear);
            } catch (Exception e) {
                log.warn("Failed to auto-generate contribution for new member {}: {}", saved.getId(), e.getMessage());
                // Non-bloquant
            }
        }

        return mapToResponseDto(saved);
    }

    // UPDATE BY ID
    @Transactional
    public MemberResponseDto updateMember(String id, MemberDto dto) {
        log.info("Update service - ID : {}, DTO on require : firstName={}, lastName={}, birthDate={}, gender={}",
                id, dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getGender());
        if (id == null || id.trim().isEmpty())
            throw new IllegalArgumentException("ID does not empty or NULL");

        Members member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not find with ID : " + id));

        if (dto.getFirstName() != null) member.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) member.setLastName(dto.getLastName());
        if (dto.getBirthDate() != null) member.setBirthDate(dto.getBirthDate());
        if (dto.getGender() != null) member.setGender(dto.getGender());
        if (dto.getImageUrl() != null) member.setImageUrl(dto.getImageUrl());
        if (dto.getPhoneNumber() != null) {
            if (!member.getPhoneNumber().equals(dto.getPhoneNumber()) && memberRepository.existsByPhoneNumber(dto.getPhoneNumber()))
                throw new IllegalArgumentException("Phone '" + dto.getPhoneNumber() + "' is exist");
            member.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getStatus() != null) member.setStatus(dto.getStatus());
        if (dto.getDistrictId() != null) {
            District district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new IllegalArgumentException("District ID invalid"));
            member.setDistrict(district);
        }
        if (dto.getTributeId() != null) {
            Tribute tribute = tributeRepository.findById(dto.getTributeId())
                    .orElseThrow(() -> new IllegalArgumentException("Tribute ID invalid"));
            member.setTribute(tribute);
        }

        // CHECK DOUBLE AFTER PARTIAL UPDATE
        if (memberRepository.hasDuplicateByKeyFields(member.getFirstName(),
                member.getLastName(),
                member.getBirthDate(),
                member.getPhoneNumber(),
                member.getDistrict().getId(),
                member.getTribute().getId(),
                member.getStatus(),
                id))
            throw new IllegalArgumentException("Member with this information's exist");

        Members updated = memberRepository.save(member);
        log.info("Update partial of member ID {} success", id);
        return mapToResponseDto(updated);
    }

    private Members findEntityById(String id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with ID : " + id));
    }

    // DELETE BY ID
    @Transactional
    public void deleteMember(String id) {
        Members member = findEntityById(id);
        log.info("Deleted of member ID : {}", id);
        memberRepository.delete(member);
    }

    // DELETE ALL
    @Transactional
    public void deleteAllMembers() {
        memberRepository.deleteAll();
    }

    // ← FIX : Méthode privée pour check éligibilité (>18 ans)
    private boolean isEligibleForContribution(Members member, Year year) {
        int age = calculateAgeAtYear(member.getBirthDate(), year);
        return age >= 18;
    }

    private int calculateAgeAtYear(LocalDate birthDate, Year year) {
        LocalDate endOfYear = LocalDate.of(year.getValue(), 12, 31);
        return endOfYear.getYear() - birthDate.getYear() - (endOfYear.isBefore(birthDate.withDayOfYear(birthDate.getDayOfYear())) ? 1 : 0);
    }

    // PRIVATE METHODE FOR MAPPING DTO
    private MemberResponseDto mapToResponseDto(Members member) {
        MemberResponseDto dto = new MemberResponseDto();
        dto.setId(member.getId());
        dto.setFirstName(member.getFirstName());
        dto.setLastName(member.getLastName());
        dto.setBirthDate(member.getBirthDate());
        dto.setGender(member.getGender());
        dto.setImageUrl(member.getImageUrl());
        dto.setPhoneNumber(member.getPhoneNumber());
        dto.setCreatedAt(member.getCreatedAt());
        dto.setSequenceNumber(member.getSequenceNumber());
        dto.setStatus(member.getStatus());

        dto.setDistrictId(member.getDistrict().getId());
        dto.setDistrictName(member.getDistrict().getName());
        dto.setTributeId(member.getTribute().getId());
        dto.setTributeName(member.getTribute().getName());

        return dto;
    }
}