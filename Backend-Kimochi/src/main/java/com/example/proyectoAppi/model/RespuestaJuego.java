package com.example.proyectoAppi.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"}) 
@Table(name = "respuestas_juego")
public class RespuestaJuego {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_respuesta;

     @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private usuario usuario;

     @Column(nullable = false, length = 32)
    private String juego;  

    @Column(nullable = false)
    private boolean correcta;

    private String marcada;        

    private LocalDateTime fecha;

}
