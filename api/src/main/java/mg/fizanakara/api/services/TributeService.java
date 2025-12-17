package mg.fizanakara.api.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.TributeRepository;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TributeService {
    private final TributeRepository tributeRepository;

    // GET ALL
    public List<Tribute> getAllTributes(){
        return tributeRepository.findAll();
    }

    // GET BY ID
    public Tribute getByID(Long id){
        return tributeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tribute not found"));
    }

    
}
