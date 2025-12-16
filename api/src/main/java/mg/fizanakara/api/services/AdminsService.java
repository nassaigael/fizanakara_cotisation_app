package mg.fizanakara.api.services;

import mg.fizanakara.api.dto.AdminResponseDto;
import mg.fizanakara.api.exceptions.AdminsException;
import mg.fizanakara.api.models.Admins;
import mg.fizanakara.api.dto.UpdateAdminDto;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.repository.AdminsRepository;
import mg.fizanakara.api.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminsService {
    private final AdminsRepository adminsRepository;
    private final PasswordEncoder passwordEncoder;
    private final SequenceService sequenceService;
    private final RefreshTokenRepository refreshTokenRepository;

    // CREATE A ADMINS
    public Admins register(Admins admin) throws AdminsException {
        if (adminsRepository.existsByEmail(admin.getEmail()))
            throw new AdminsException("Email Already Exists");

        // GENERATE SEQUENCE & ID BEFORE SAVE
        Long nextSeq = sequenceService.getNextSequence("admins_seq");
        admin.setSequenceNumber(nextSeq);
        admin.setId(admin.generatedCustomId());
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreatedAt(LocalDate.now());
        return adminsRepository.save(admin);
    }

    // LOGIN A ADMIN
    public boolean login(String email, String rawPassword) {
        return adminsRepository.findByEmail(email)
                .map(admins -> passwordEncoder.matches(rawPassword, admins.getPassword()))
                .orElse(false);
    }

    public Optional<Admins> findByEmail(String email) {
        return adminsRepository.findByEmail(email);
    }

    public Admins save(Admins admin) {
        return adminsRepository.save(admin);
    }

    // DELETE A ADMINS
    @Transactional
    public void deleteAdmins(Admins admin) {
        refreshTokenRepository.deleteByAdmin(admin);
        adminsRepository.delete(admin);
    }

    // FIND BY ID
    public Optional<Admins> findById(String id) {
        return adminsRepository.findById(id);
    }

    public Admins createAdmins(Admins admins) {
        return adminsRepository.save(admins);
    }

    @Transactional
    public AdminResponseDto updateAdmin(String email, UpdateAdminDto req) throws AdminsException {
        Admins admin = findByEmail(email)
                .orElseThrow(() -> new AdminsException("Admin non trouvé avec l'email : " + email));

        // Check email unique si changé
        if (req.getEmail() != null && !req.getEmail().equals(admin.getEmail()) && adminsRepository.existsByEmail(req.getEmail())) {
            throw new AdminsException("Email déjà utilisé par un autre admin");
        }

        int changes = 0;  // ← OPTION : Compteur pour log

        // Merge des champs (partial update)
        if (req.getFirstName() != null) {
            admin.setFirstName(req.getFirstName());
            changes++;
        }
        if (req.getLastName() != null) {
            admin.setLastName(req.getLastName());
            changes++;
        }
        if (req.getBirthDate() != null) {
            admin.setBirthDate(req.getBirthDate());
            changes++;
        }
        if (req.getGender() != null) {
            try {
                admin.setGender(Gender.valueOf(req.getGender().toUpperCase()));  // ← FIX : Uppercase + try-catch
                changes++;
            } catch (IllegalArgumentException e) {
                throw new AdminsException("Genre invalide : " + req.getGender() + ". Utilisez MALE ou FEMALE.");
            }
        }
        if (req.getImageUrl() != null) {
            admin.setImageUrl(req.getImageUrl());
            changes++;
        }
        if (req.getPhoneNumber() != null) {
            admin.setPhoneNumber(req.getPhoneNumber());
            changes++;
        }
        if (req.getEmail() != null) {
            admin.setEmail(req.getEmail());
            changes++;
        }
        if (req.getPassword() != null) {
            admin.setPassword(passwordEncoder.encode(req.getPassword()));  // Re-encode si changé
            changes++;
        }

        // Update verified si fourni (optionnel, pour admin only)
        if (req.getVerified() != null) {
            admin.setVerified(req.getVerified());
            changes++;
        }

        Admins updated = adminsRepository.save(admin);
        log.info("Admin {} mis à jour : {} champs changés", email, changes);  // ← AJOUT : Log pour debug

        return new AdminResponseDto(updated);  // ← FIX : Unifié nom DTO
    }
}