package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.children.ChildrenCreateDto;
import mg.fizanakara.api.dto.children.ChildrenResponseDto;
import mg.fizanakara.api.dto.children.ChildrenUpdateDto;
import mg.fizanakara.api.dto.contributions.ContributionResponseDto;
import mg.fizanakara.api.exceptions.ChildrenNotFoundException;
import mg.fizanakara.api.models.Children;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.ChildrenRepository;
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
public class ChildrenService {
    private final ChildrenRepository childrenRepository;
    private final DistrictRepository districtRepository;
    private final TributeRepository tributeRepository;
    private final MemberRepository memberRepository;
    private final SequenceService sequenceService;
    private final ContributionService contributionService;

    // GET ALL
    @Transactional(readOnly = true)
    public List<ChildrenResponseDto> getAllChildren() {
        log.info("Retrieving all children");
        List<Children> children = childrenRepository.findAll();
        return children
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // GET BY ID
    @Transactional(readOnly = true)
    public ChildrenResponseDto getChildById(String id) {
        log.info("Retrieving child with ID: {}", id);
        Children child  = childrenRepository.findById(id)
                .orElseThrow(() -> new ChildrenNotFoundException("Child not found with ID: " + id));
        return mapToResponseDto(child);
    }

    // GET BY MEMBER ID
    @Transactional(readOnly = true)
    public List<ChildrenResponseDto> getChildrenByMemberId(String memberId) {
        log.info("Retrieving children for member ID: {}", memberId);
        List<Children> children = childrenRepository.findByMemberId(memberId);
        return children
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // CREATE
    @Transactional
    public ChildrenResponseDto createChild(ChildrenCreateDto dto) {
        log.info("Checking duplicate for firstName='{}', lastName='{}', birthDate='{}', phone='{}', districtId={}, tributeId={}, status={}, memberId={}",
                dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhoneNumber(), dto.getDistrictId(), dto.getTributeId(), dto.getStatus(), dto.getMemberId());

        boolean hasDuplicate = childrenRepository.hasDuplicateByKeyFields(
                dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhoneNumber(),
                dto.getDistrictId(), dto.getTributeId(), dto.getStatus(), dto.getMemberId(), null);
        log.info("Cross-table duplicate check result: {}", hasDuplicate);

        if (hasDuplicate) {
            throw new IllegalArgumentException("Child with these details already exists (in members or children) for this member");
        }

        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid District ID: " + dto.getDistrictId()));
        Tribute tribute = tributeRepository.findById(dto.getTributeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Tribute ID: " + dto.getTributeId()));
        Members member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID: " + dto.getMemberId()));

        log.info("Creating child: {} {}", dto.getFirstName(), dto.getLastName());
        Children child = Children.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .birthDate(dto.getBirthDate())
                .gender(dto.getGender())
                .imageUrl(dto.getImageUrl())
                .phoneNumber(dto.getPhoneNumber())
                .status(dto.getStatus())
                .district(district)
                .tribute(tribute)
                .member(member)
                .build();

        Long nextSeq = sequenceService.getNextSequence("mbr_seq");
        child.setCreatedAt(LocalDate.now());
        child.setSequenceNumber(nextSeq);
        child.setId(child.generatedCustomId());

        Children saved = childrenRepository.save(child);

        Year currentYear = Year.now();
        LocalDate dueDate = LocalDate.of(currentYear.getValue(), 12, 31);
        if (saved.getCreatedAt().isBefore(dueDate) && isEligibleForContribution(saved, currentYear)) {
            try {
                ContributionResponseDto newContribution = contributionService.createSingleContributionForChild(currentYear, saved.getMember().getId(), saved.getId());  // ← FIX : Méthode single pour enfant
                log.info("Auto-generated contribution for new child {} in year {}", saved.getId(), currentYear);
            } catch (Exception e) {
                log.warn("Failed to auto-generate contribution for new child {}: {}", saved.getId(), e.getMessage());
                // Non-bloquant
            }
        }

        return  mapToResponseDto(saved);
    }

    // UPDATE partial (optional fields)
    @Transactional
    public ChildrenResponseDto updateChild(String id, ChildrenUpdateDto dto) {
        log.info("Partial update for child - ID: {}, provided fields: firstName={}, lastName={}, birthDate={}, gender={}",
                id, dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getGender());
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID cannot be null or empty");
        }

        Children child = childrenRepository.findById(id)
                .orElseThrow(() -> new ChildrenNotFoundException("Child not found with ID: " + id));

        if (dto.getFirstName() != null) child.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) child.setLastName(dto.getLastName());
        if (dto.getBirthDate() != null) child.setBirthDate(dto.getBirthDate());
        if (dto.getGender() != null) child.setGender(dto.getGender());
        if (dto.getImageUrl() != null) child.setImageUrl(dto.getImageUrl());
        if (dto.getPhoneNumber() != null) {
            if (!child.getPhoneNumber().equals(dto.getPhoneNumber()) && childrenRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
                throw new IllegalArgumentException("Phone number '" + dto.getPhoneNumber() + "' already exists");
            }
            child.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getStatus() != null) child.setStatus(dto.getStatus());
        if (dto.getDistrictId() != null) {
            District district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid District ID"));
            child.setDistrict(district);
        }
        if (dto.getTributeId() != null) {
            Tribute tribute = tributeRepository.findById(dto.getTributeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Tribute ID"));
            child.setTribute(tribute);
        }
        if (dto.getMemberId() != null) {
            Members member = memberRepository.findById(dto.getMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Member ID"));
            child.setMember(member);
        }

        if (childrenRepository.hasDuplicateByKeyFields(child.getFirstName(), child.getLastName(), child.getBirthDate(), child.getPhoneNumber(), child.getDistrict().getId(), child.getTribute().getId(), child.getStatus(), child.getMember().getId(), id)) {
            throw new IllegalArgumentException("Child with these details already exists for this member");
        }

        Children updated = childrenRepository.save(child);
        log.info("Partial update for child ID {} successful", id);
        return mapToResponseDto(updated);
    }

    // DELETE
    @Transactional
    public void deleteChild(String id) {
        Children child = findEntityById(id);
        log.info("Deleting child with ID: {}", id);
        childrenRepository.delete(child);
    }

    private Children findEntityById(String id) {
        return childrenRepository.findById(id)
                .orElseThrow(() -> new ChildrenNotFoundException("Child not found with ID: " + id));
    }

    // ← FIX : Méthode privée pour check éligibilité (>18 ans)
    private boolean isEligibleForContribution(Children child, Year year) {
        int age = calculateAgeAtYear(child.getBirthDate(), year);
        return age >= 18;
    }

    private int calculateAgeAtYear(LocalDate birthDate, Year year) {
        LocalDate endOfYear = LocalDate.of(year.getValue(), 12, 31);
        return endOfYear.getYear() - birthDate.getYear() - (endOfYear.isBefore(birthDate.withDayOfYear(birthDate.getDayOfYear())) ? 1 : 0);
    }

    // PRIVATE METHODE FOR MAPPING DTO
    private ChildrenResponseDto mapToResponseDto(Children child) {
        ChildrenResponseDto dto = new ChildrenResponseDto();
        dto.setId(child.getId());
        dto.setFirstName(child.getFirstName());
        dto.setLastName(child.getLastName());
        dto.setBirthDate(child.getBirthDate());
        dto.setGender(child.getGender());
        dto.setImageUrl(child.getImageUrl());
        dto.setPhoneNumber(child.getPhoneNumber());
        dto.setCreatedAt(child.getCreatedAt());
        dto.setSequenceNumber(child.getSequenceNumber());
        dto.setStatus(child.getStatus());

        dto.setDistrictId(child.getDistrict().getId());
        dto.setDistrictName(child.getDistrict().getName());
        dto.setTributeId(child.getTribute().getId());
        dto.setTributeName(child.getTribute().getName());
        dto.setMemberId(child.getMember().getId());
        dto.setMemberFirstName(child.getMember().getFirstName());
        dto.setMemberLastName(child.getMember().getLastName());

        return dto;
    }
}