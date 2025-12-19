package mg.fizanakara.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mg.fizanakara.api.models.enums.MemberStatus;

@Entity
@Table(name = "members", indexes = {
        @Index(name = "idx_members_district_id", columnList = "district_id"),
        @Index(name = "idx_members_tribute_id", columnList = "tribute_id")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Members extends Users {

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MemberStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @NotNull(message = "The district is required")
    @JsonIgnore
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tribute_id", nullable = false)
    @NotNull(message = "The tribute is required")
    @JsonIgnore
    private Tribute tribute;

    @OneToOne(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = true)
    private Children child;

    @Override
    public String generatedCustomId() {
        return "MBR" + String.format("%08d", this.getSequenceNumber());
    }
}