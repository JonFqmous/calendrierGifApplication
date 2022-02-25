package fr.jonathan.calendrier_gif;

import fr.jonathan.calendrier_gif.CalendrierGifApplicationApp;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = CalendrierGifApplicationApp.class)
public @interface IntegrationTest {
}
