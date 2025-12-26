package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.MemberDto;
import mg.fizanakara.api.exceptions.MemberNotFoundException;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.DistrictRepository;
import mg.fizanakara.api.repository.MemberRepository;
import mg.fizanakara.api.repository.TributeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    private final MemberRepository memberRepository;
    private final DistrictRepository districtRepository;
    private final TributeRepository tributeRepository;
    private final SequenceService sequenceService;

    // GET ALL
    public List<Members> getAllMembers() {
        log.info("Recuperate all members");
        return memberRepository.findAll();
    }

    // GET BY ID
    public Members getMemberById(String id) {
        log.info("Recuperate member with ID : {}", id);
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with ID : " + id));
    }

    // CREATE
    @Transactional
    public Members createMember(MemberDto dto) {
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
        return memberRepository.save(member);
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