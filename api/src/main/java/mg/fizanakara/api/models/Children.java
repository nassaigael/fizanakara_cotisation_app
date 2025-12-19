package mg.fizanakara.api.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import mg.fizanakara.api.models.enums.MemberStatus;

@Entity
@Table(name = "childrens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Children extends Users {

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull(message = "Status is required")
    private MemberStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    @NotNull(message = "District is required")
    @JsonIgnore
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tribute_id", nullable = false)
    @NotNull(message = "Tribute is required")
    @JsonIgnore
    private Tribute tribute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @NotNull(message = "Member is required")
    @JsonIgnore
    private Members member;

    @Override
    public String generatedCustomId() {
        return "MBR" + String.format("%08d", this.getSequenceNumber());
    }
}