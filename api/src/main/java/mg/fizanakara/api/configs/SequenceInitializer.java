package mg.fizanakara.api.configs;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class SequenceInitializer {
    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void initializeSequences() {
        entityManager.createNativeQuery(
                "CREATE SEQUENCE IF NOT EXISTS admin_seq START WITH 1 INCREMENT BY 1"
        ).executeUpdate();

        entityManager.createNativeQuery(
                "CREATE SEQUENCE IF NOT EXISTS mbr_seq START WITH 1 INCREMENT BY 1"
        ).executeUpdate();
    }
}
