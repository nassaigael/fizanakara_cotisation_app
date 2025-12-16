package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;  // ← AJOUT : Logs pour debug
import mg.fizanakara.api.dto.DistrictDto;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.services.DistrictService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;  // ← AJOUT : Pour DTO validation
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admins/districts")  // Admin namespace – bon
@RequiredArgsConstructor
@Slf4j  // ← AJOUT : Active logs
public class DistrictController {
    private final DistrictService districtService;

    // GET ALL (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<District>> getAllDistricts() {  // ← FIX : Retiré @PathVariable Long id (erreur path variable)
        log.info("Récupération de tous les districts");  // ← AJOUT : Log
        return ResponseEntity.ok(districtService.getAllDistricts());
    }

    // GET BY ID (admin only)
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> getDistrictById(@PathVariable Long id) {
        log.debug("Récupération du district ID : {}", id);  // ← AJOUT : Log debug
        return ResponseEntity.ok(districtService.getDistrictById(id));
    }

    // CREATE (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> createDistrict(@RequestBody @Validated DistrictDto dto) {  // ← AJOUT : @Validated pour DTO
        log.info("Création du district : {}", dto.getName());  // ← AJOUT : Log
        District created = districtService.createDistrict(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> updateDistrict(@PathVariable Long id, @RequestBody @Validated DistrictDto dto) {  // ← AJOUT : @Validated
        log.info("Mise à jour du district ID {} : {}", id, dto.getName());  // ← AJOUT : Log
        District updated = districtService.updateDistrict(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteDistrict(@PathVariable Long id) {
        log.info("Suppression du district ID : {}", id);
        districtService.deleteDistrict(id);
        return ResponseEntity.ok(Map.of("message", "District deleted", "success", true));
    }
}