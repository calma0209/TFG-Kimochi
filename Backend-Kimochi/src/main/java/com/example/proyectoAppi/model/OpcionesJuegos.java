package com.example.proyectoAppi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "opciones_juegos")
public class OpcionesJuegos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_opcion;

    @ManyToOne
    @JoinColumn(name = "id_pregunta", nullable = false)
    private PreguntaJuego preguntaJuego;

    @ManyToOne
    @JoinColumn(name = "id_emocion")
    private Emocion emocion;

    @Column(nullable = false)
    private String opcion_texto;

    @Column(nullable = false)
    private boolean es_correcto;

}
