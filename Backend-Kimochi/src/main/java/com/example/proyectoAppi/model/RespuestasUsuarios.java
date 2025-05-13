package com.example.proyectoAppi.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "respuestas_usuarios")
public class RespuestasUsuarios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_respuesta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_pregunta", nullable = false)
    private PreguntaJuego preguntaJuego;

    @ManyToOne
    @JoinColumn(name = "id_opcion", nullable = false)
    private OpcionesJuegos opcionJuego;

    @Column(nullable = false)
    private boolean es_correcto;

}
