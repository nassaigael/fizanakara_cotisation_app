package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.TributeDto;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.services.DistrictService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins/tributes")
@RequiredArgsConstructor
@Slf4j
public class TributeController {
    private final TributeService tributeService;

    //  🔒 ALL ROUTES IS PROTECTED BY ADMIN TOKEN
    // GET ALL
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Tribute>> getAllTributes(){
        log.info("Recuperate all districts");
        return ResponseEntity.ok(tributeService.getAllTributes());
    }

    // GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tribute> getTributeByID(@PathVariable Long id){
        log.info("Recupere district by ID {}", id);
        return ResponseEntity.ok(tributeService.getTributeByID(id));
    }
}
