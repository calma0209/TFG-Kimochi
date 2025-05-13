package com.example.proyectoAppi.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "preguntas_juegos")
public class PreguntaJuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_pregunta;

    @ManyToOne
    @JoinColumn(name = "id_juego", nullable = false)
    // @JsonIgnore
    private Juego juego;

    @Column(columnDefinition = "TEXT")
    private String pregunta;

    @OneToMany(mappedBy = "preguntaJuego", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OpcionesJuegos> opcionesJuegosList;

}
