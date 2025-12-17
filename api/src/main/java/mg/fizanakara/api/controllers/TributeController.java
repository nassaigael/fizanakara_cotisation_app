package mg.fizanakara.api.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mg.fizanakara.api.services.DistrictService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admins/tributes")
@RequiredArgsConstructor
@Slf4j
public class TributeController {
    private final DistrictService districtService;

    //  🔒 ALL ROUTES IS PROTECTED BY ADMIN TOKEN

}
