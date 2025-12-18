package mg.fizanakara.api.controllers;

public class MemberController {
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