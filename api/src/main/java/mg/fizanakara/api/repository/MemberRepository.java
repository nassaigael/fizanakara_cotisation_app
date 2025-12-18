package mg.fizanakara.api.repository;

public interface MemberRepository {
}

    List<Members> findByStatus(MemberStatus status);
}