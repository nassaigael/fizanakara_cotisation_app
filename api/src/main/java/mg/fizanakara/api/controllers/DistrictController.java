package mg.fizanakara.api.controllers;

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
}
