package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.ChildrenCreateDto;
import mg.fizanakara.api.dto.ChildrenUpdateDto;
import mg.fizanakara.api.models.Children;
import mg.fizanakara.api.services.ChildrenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admins/children")
@RequiredArgsConstructor
@Slf4j
public class ChildrenController {
    private final ChildrenService childrenService;

    // GET ALL
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Children>> getAllChildren() {
        log.info("Retrieving all children");
        return ResponseEntity.ok(childrenService.getAllChildren());
    }

    // GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Children> getChildById(@PathVariable String id) {
        log.debug("Retrieving child by ID: {}", id);
        return ResponseEntity.ok(childrenService.getChildById(id));
    }

    // GET BY MEMBER ID
    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Children>> getChildrenByMemberId(@PathVariable String memberId) {
        log.debug("Retrieving children for member ID: {}", memberId);
        return ResponseEntity.ok(childrenService.getChildrenByMemberId(memberId));
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ChildrenResponseDto> createChild(@RequestBody @Validated ChildrenCreateDto dto) {  // ← MODIFIÉ : DTO
        log.info("Creating child: {} {}", dto.getFirstName(), dto.getLastName());
        return ResponseEntity.status(HttpStatus.CREATED).body(childrenService.createChild(dto));
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Children> updateChild(@PathVariable String id, @RequestBody ChildrenUpdateDto dto) {
        log.info("Partial update for child - ID: {}, provided fields: firstName={}, lastName={}, birthDate={}, gender={}",
                id, dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getGender());
        Children updated = childrenService.updateChild(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteChild(@PathVariable String id) {
        log.info("Deleting child with ID: {}", id);
        childrenService.deleteChild(id);
        return ResponseEntity.ok(Map.of("message", "Child deleted successfully", "success", true));
    }
}