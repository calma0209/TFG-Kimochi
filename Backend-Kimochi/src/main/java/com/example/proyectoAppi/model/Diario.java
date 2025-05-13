package com.example.proyectoAppi.model;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "diario_emocional")

public class Diario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_registro;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({ "diarioEmocionalList" })
    private usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_emocion", nullable = false)
    private Emocion emocion;

    @Column(columnDefinition = "TEXT")
    private String nota;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", updatable = false, insertable = false)
    private Timestamp fecha_registro;
}
