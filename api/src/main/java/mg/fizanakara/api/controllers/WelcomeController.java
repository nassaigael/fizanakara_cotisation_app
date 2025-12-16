package mg.fizanakara.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {
    @GetMapping("/api")
    public String welcome() throws Exception {
        return "Welcome to the server ☑️";
    }
}
