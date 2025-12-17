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
        log.info("Récupération du membre avec ID : {}", id);
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member non trouvé avec ID : " + id));
    }

    // CREATE
    @Transactional
    public Members createMember(MemberDto dto) {
        if (memberRepository.hasDuplicateByKeyFields(dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getPhoneNumber(), dto.getDistrictId(), dto.getTributeId(), dto.getStatus(), null)) {  // null pour create
            throw new IllegalArgumentException("A member with the same name already exists");
        }

        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new IllegalArgumentException("District ID invalide : " + dto.getDistrictId()));
        Tribute tribute = tributeRepository.findById(dto.getTributeId())
                .orElseThrow(() -> new IllegalArgumentException("Tribute ID invalide : " + dto.getTributeId()));

        log.info("Creation of member : {} {}", dto.getFirstName(), dto.getLastName());
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

        Long nextSeq = sequenceService.getNextSequence("users_sequence");
        member.setCreatedAt(LocalDate.now());
        member.setSequenceNumber(nextSeq);
        member.setId(member.generatedCustomId());
        return memberRepository.save(member);
    }

    // UPDATE BY ID
    @Transactional
    public Members updateMember(String id, MemberDto dto) {
        log.info("Update service - ID : {}, DTO on require : firstName={}, lastName={}, birthDate={}, gender={}",
                id, dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getGender());
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID does not empty or NULL");
        }

        Members member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not find with ID : " + id));

        if (dto.getFirstName() != null) member.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) member.setLastName(dto.getLastName());
        if (dto.getBirthDate() != null) member.setBirthDate(dto.getBirthDate());
        if (dto.getGender() != null) member.setGender(dto.getGender());
        if (dto.getImageUrl() != null) member.setImageUrl(dto.getImageUrl());
        if (dto.getPhoneNumber() != null) {
            if (!member.getPhoneNumber().equals(dto.getPhoneNumber()) && memberRepository.existsByPhoneNumber(dto.getPhoneNumber())) {
                throw new IllegalArgumentException("Phone '" + dto.getPhoneNumber() + "' existe déjà");
            }
            member.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getStatus() != null) member.setStatus(dto.getStatus());
        if (dto.getDistrictId() != null) {
            District district = districtRepository.findById(dto.getDistrictId())
                    .orElseThrow(() -> new IllegalArgumentException("District ID invalide"));
            member.setDistrict(district);
        }
        if (dto.getTributeId() != null) {
            Tribute tribute = tributeRepository.findById(dto.getTributeId())
                    .orElseThrow(() -> new IllegalArgumentException("Tribute ID invalide"));
            member.setTribute(tribute);
        }

        // ← FIX : Check doublon après partial update, exclut self
        if (memberRepository.hasDuplicateByKeyFields(member.getFirstName(), member.getLastName(), member.getBirthDate(), member.getPhoneNumber(), member.getDistrict().getId(), member.getTribute().getId(), member.getStatus(), id)) {
            throw new IllegalArgumentException("Membre avec ces informations existe déjà");
        }

        Members updated = memberRepository.save(member);
        log.info("Mise à jour partielle du membre ID {} réussie", id);
        return updated;
    }

    // DELETE
    @Transactional
    public void deleteMember(String id) {
        Members member = getMemberById(id);
        log.info("Suppression du membre ID : {}", id);
        memberRepository.delete(member);
    }

    // DELETE ALL
    @Transactional
    public void deleteAllMembers() {
        memberRepository.deleteAll();
    }
}