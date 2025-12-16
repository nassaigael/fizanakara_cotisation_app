package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.repository.DistrictRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DistrictService {
    private final DistrictRepository districtRepository;

    // GET ALL
    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }

    // GET BY ID
    public District getDistrictById(Long id) {
        return districtRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("District not found with id " + id));
    }

    // CREATE
    @Transactional
    public District createDistrict(DistrictDto dto) {
        if (districtRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("District avec nom '" + dto.getName() + "' existe déjà");
        }
        log.info("Création du district : {}", dto.getName());
        District district = District.builder()
                .name(dto.getName())
                .build();
        return districtRepository.save(district);
    }

}
