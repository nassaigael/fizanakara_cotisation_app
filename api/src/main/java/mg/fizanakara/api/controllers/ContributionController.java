package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.contributions.ContributionResponseDto;
import mg.fizanakara.api.dto.contributions.ContributionUpdateDto;
import mg.fizanakara.api.dto.contributions.ContributionYearDto;
import mg.fizanakara.api.services.ContributionService;
import org.springframework.data.domain.Pageable;  // ← AJOUT : Pour pagination optionnelle
import org.springframework.data.web.PageableDefault;  // ← AJOUT : Default pagination
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/api/admins/contributions")
@RequiredArgsConstructor
@Slf4j
public class ContributionController {
    private final ContributionService contributionService;

    // GET ALL (avec pagination optionnelle)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContributionResponseDto>> getAllContributions(
            @PageableDefault(size = 20) Pageable pageable) {  // ← AJOUT : Pagination simple
        log.info("Retrieving all contributions");
        return ResponseEntity.ok(contributionService.getAllContributions());  // Adapté si service supporte pageable
    }

    // GET BY PERSON AND YEAR (adapté pour refonte Person ; change memberId → personId)
    @GetMapping("/person/{personId}/year/{year}")  // ← MODIF : /person au lieu /member
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContributionResponseDto>> getContributionsByPersonAndYear(
            @PathVariable String personId,  // ← MODIF : personId
            @PathVariable Year year) {
        log.debug("Retrieving contributions for person ID: {} and year: {}", personId, year);
        return ResponseEntity.ok(contributionService.getContributionsByPersonAndYear(personId, year));
    }

    // CREATE (batch pour année)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContributionResponseDto>> createContributionsForYear(@RequestBody @Validated ContributionYearDto dto) {
        log.info("Generating annual contributions for year: {}", dto.getYear());
        return ResponseEntity.status(HttpStatus.CREATED).body(contributionService.createContributionsForYear(dto));
    }

    // UPDATE BY ID
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContributionResponseDto> updateContribution(@PathVariable String id, @RequestBody ContributionUpdateDto dto) {
        log.info("Updating contribution ID: {}", id);
        return ResponseEntity.ok(contributionService.updateContribution(id, dto));
    }

    // DELETE BY ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContribution(@PathVariable String id) {
        log.info("Deleting contribution ID: {}", id);
        contributionService.deleteContribution(id);
        return ResponseEntity.noContent().build();
    }
}