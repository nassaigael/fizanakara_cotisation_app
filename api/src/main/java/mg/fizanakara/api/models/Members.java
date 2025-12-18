package mg.fizanakara.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.fizanakara.api.models.enums.MemberStatus;

@Entity
@Table(name = "members", indexes = {  // Indexes pour perf sur FK
        @Index(name = "idx_members_district_id", columnList = "district_id"),
        @Index(name = "idx_members_tribute_id", columnList = "tribute_id")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder  // Bien pour héritage (Users doit l'avoir aussi)
public class Members extends Users {

    @Enumerated(EnumType.STRING)  // ← AJOUT : Stocke enum comme string en DB (ex. "ACTIVE")
    @Column(name = "status", nullable = false)  // ← AJOUT : Nullable false pour statut obligatoire
    private MemberStatusEnum status;  // Statut membre (ex. ACTIVE, SUSPENDED)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @NotNull(message = "The district is required")  // ← FIX : Message anglais pour cohérence
    @JsonIgnore  // ← AJOUT : Évite lazy loading en JSON
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tribute_id", nullable = false)
    @NotNull(message = "The tribute is required")
    @JsonIgnore  // ← AJOUT : Évite lazy loading
    private Tribute tribute;

    /* @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Childs child;  // Gardé commenté – ajoute @JsonIgnore si activé */

    @Override
    public String generatedCustomId() {  // ← FIX : Remis protected (interne)
        return "MBR" + String.format("%08d", this.getSequenceNumber());
    }
}