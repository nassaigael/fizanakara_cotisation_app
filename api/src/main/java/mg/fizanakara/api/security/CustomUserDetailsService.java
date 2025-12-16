package mg.fizanakara.api.security;

import mg.fizanakara.api.models.Admins;
import mg.fizanakara.api.repository.AdminsRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminsRepository adminsRepository;

    public CustomUserDetailsService(AdminsRepository adminsRepository) {
        this.adminsRepository = adminsRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admins admin = adminsRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found "+email));
        return new User(admin.getEmail(), admin.getPassword(), Collections.singleton(new SimpleGrantedAuthority("ADMIN")));
    }
}
