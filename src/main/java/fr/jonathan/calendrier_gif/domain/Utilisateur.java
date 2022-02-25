package fr.jonathan.calendrier_gif.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Utilisateur.
 */
@Entity
@Table(name = "utilisateur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Utilisateur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "nb_point")
    private Integer nbPoint;

    @Column(name = "date_heure_inscription")
    private Instant dateHeureInscription;

    @Column(name = "email")
    private String email;

    @ManyToOne
    private Theme theme;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Utilisateur id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Utilisateur nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Utilisateur prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Integer getNbPoint() {
        return this.nbPoint;
    }

    public Utilisateur nbPoint(Integer nbPoint) {
        this.setNbPoint(nbPoint);
        return this;
    }

    public void setNbPoint(Integer nbPoint) {
        this.nbPoint = nbPoint;
    }

    public Instant getDateHeureInscription() {
        return this.dateHeureInscription;
    }

    public Utilisateur dateHeureInscription(Instant dateHeureInscription) {
        this.setDateHeureInscription(dateHeureInscription);
        return this;
    }

    public void setDateHeureInscription(Instant dateHeureInscription) {
        this.dateHeureInscription = dateHeureInscription;
    }

    public String getEmail() {
        return this.email;
    }

    public Utilisateur email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Theme getTheme() {
        return this.theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public Utilisateur theme(Theme theme) {
        this.setTheme(theme);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Utilisateur)) {
            return false;
        }
        return id != null && id.equals(((Utilisateur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Utilisateur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", nbPoint=" + getNbPoint() +
            ", dateHeureInscription='" + getDateHeureInscription() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }
}
