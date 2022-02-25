package fr.jonathan.calendrier_gif.repository;

import fr.jonathan.calendrier_gif.domain.Theme;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Theme entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ThemeRepository extends JpaRepository<Theme, Long> {}
