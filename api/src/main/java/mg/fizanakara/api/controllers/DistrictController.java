package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import mg.fizanakara.api.dto.DistrictDto;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.services.DistrictService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admins/districts")
@RequiredArgsConstructor
public class DistrictController {
    private final DistrictService districtService;

    // GET ALL
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<District>> getAllDistricts(@PathVariable Long id) {
        return ResponseEntity.ok(districtService.getAllDistricts());
    }

    // GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> getDistrictById(@PathVariable Long id) {
        return ResponseEntity.ok(districtService.getDistrictById(id));
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> createDistrict(@RequestBody DistrictDto dto){
        District created = districtService.createDistrict(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<District> updateDistrict(@PathVariable Long id, @RequestBody DistrictDto dto){
        District updated = districtService.updateDistrict(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteDistrict(@PathVariable Long id){
        districtService.deleteDistrict(id);
        return ResponseEntity.ok(Map.of("message", "District deleted", "success", true));
    }
}
