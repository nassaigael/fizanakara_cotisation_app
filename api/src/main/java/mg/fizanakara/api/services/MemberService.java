package mg.fizanakara.api.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.dto.MemberDto;
import mg.fizanakara.api.exceptions.MemberNotFoundException;
import mg.fizanakara.api.models.District;
import mg.fizanakara.api.models.Members;
import mg.fizanakara.api.models.Tribute;
import mg.fizanakara.api.repository.DistrictRepository;
import mg.fizanakara.api.repository.MemberRepository;
import mg.fizanakara.api.repository.TributeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {
}
