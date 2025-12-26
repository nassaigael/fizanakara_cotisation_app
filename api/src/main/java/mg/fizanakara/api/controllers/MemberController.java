package mg.fizanakara.api.controllers;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.MemberDto;
import mg.fizanakara.api.dto.MemberResponseDto;
import mg.fizanakara.api.services.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admins/members")
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    private final MemberService memberService;

    // GET ALL
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Members>> getAllMembers() {
        log.info("Recupearte all members");
        return ResponseEntity.ok(memberService.getAllMembers());
    }

    // GET BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MemberResponseDto> getMemberById(@PathVariable @NotNull String id) {
        log.debug("Recuperate of member ID : {}", id);
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MemberResponseDto> createMember(@RequestBody @Validated MemberDto dto) {  // ← FIX : DTO
        log.info("Create member of : {} {}", dto.getFirstName(), dto.getLastName());
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.createMember(dto));
    }

    // UPDATE BY ID
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Members> updateMember(@PathVariable String id, @RequestBody MemberDto dto) {
        log.info("PUT partial - ID : {}, champs fournis : firstName={}, lastName={}, birthDate={}, gender={}",
                id, dto.getFirstName(), dto.getLastName(), dto.getBirthDate(), dto.getGender());
        Members updated = memberService.updateMember(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE BY ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteMember(@PathVariable String id) {
        log.info("Delete member of ID : {}", id);
        memberService.deleteMember(id);
        return ResponseEntity.ok(Map.of("message", "Member deleted successfully", "success", true));
    }

    // DELETE ALL
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteAllMembers() {
        log.info("Delete all ({} members)", memberService.getAllMembers().size());
        memberService.deleteAllMembers();
        return ResponseEntity.ok(Map.of("message", "All members deleted successfully"));
    }
}