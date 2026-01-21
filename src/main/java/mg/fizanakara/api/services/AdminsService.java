package mg.fizanakara.api.services;

import mg.fizanakara.api.dto.admins.AdminResponseDto;
import mg.fizanakara.api.exceptions.AdminsException;
import mg.fizanakara.api.models.Admins;
import mg.fizanakara.api.dto.admins.UpdateAdminDto;
import mg.fizanakara.api.models.enums.Gender;
import mg.fizanakara.api.repository.AdminsRepository;
import mg.fizanakara.api.repository.RefreshTokenRepository;
import mg.fizanakara.api.repository.PasswordResetTokenRepository;
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
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public Admins register(Admins admin) throws AdminsException {
        if (adminsRepository.existsByEmail(admin.getEmail()))
            throw new AdminsException("Email Already Exists");
        Long nextSeq = sequenceService.getNextSequence("admin_seq");
        admin.setSequenceNumber(nextSeq);
        admin.setId(admin.generatedCustomId());
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setCreatedAt(LocalDate.now());
        return adminsRepository.save(admin);
    }

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

    // SUPPRESSION SÉCURISÉE (CORRIGÉE)
    @Transactional
    public void deleteAdmins(Admins admin) {
        // 1. Nettoyage des Refresh Tokens
        refreshTokenRepository.deleteByAdmin(admin);
        
        // 2. Nettoyage des Password Reset Tokens (Cause probable de ta 500)
        passwordResetTokenRepository.deleteByAdmin(admin);
        
        // 3. Suppression de l'admin (Les Members ne sont pas impactés car pas de lien Cascade ici)
        adminsRepository.delete(admin);
        log.info("Admin supprimé : {}. Les membres sont conservés.", admin.getId());
    }

    public Optional<Admins> findById(String id) {
        return adminsRepository.findById(id);
    }

    public Admins createAdmins(Admins admins) {
        return adminsRepository.save(admins);
    }

    @Transactional
    public AdminResponseDto updateAdmin(String email, UpdateAdminDto req) throws AdminsException {
        Admins admin = findByEmail(email)
                .orElseThrow(() -> new AdminsException("Admin not found with email : " + email));
        if (req.getEmail() != null && !req.getEmail().equals(admin.getEmail()) && adminsRepository.existsByEmail(req.getEmail()))
            throw new AdminsException("Email has exit use by other admin");

        int changes = 0;
        if (req.getFirstName() != null) { admin.setFirstName(req.getFirstName()); changes++; }
        if (req.getLastName() != null) { admin.setLastName(req.getLastName()); changes++; }
        if (req.getBirthDate() != null) { admin.setBirthDate(req.getBirthDate()); changes++; }
        if (req.getGender() != null) {
            try {
                admin.setGender(Gender.valueOf(req.getGender().toUpperCase()));
                changes++;
            } catch (IllegalArgumentException e) {
                throw new AdminsException("Gender invalid : " + req.getGender());
            }
        }
        if (req.getImageUrl() != null) { admin.setImageUrl(req.getImageUrl()); changes++; }
        if (req.getPhoneNumber() != null) { admin.setPhoneNumber(req.getPhoneNumber()); changes++; }
        if (req.getEmail() != null) { admin.setEmail(req.getEmail()); changes++; }
        if (req.getPassword() != null) { admin.setPassword(passwordEncoder.encode(req.getPassword())); changes++; }
        if (req.getVerified() != null) { admin.setVerified(req.getVerified()); changes++; }

        Admins updated = adminsRepository.save(admin);
        log.info("Admin {} mis à jour", email);
        return new AdminResponseDto(updated);
    }
}