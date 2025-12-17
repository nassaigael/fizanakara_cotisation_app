package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.TributeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TributeService {
    private final TributeRepository tributeRepository;

    // GET ALL
    public List<Tribute> getAllTributes(){
        return tributeRepository.findAll();
    }
}
