package com.example.proyectoAppi.model;

import java.sql.Timestamp;

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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "recompensas_usuarios")
public class RecompensasUsuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_recompensa_usuario;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_recompensa", nullable = false)
    private Recompensa recompensa;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer cantidad_monedas;

    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", updatable = false, insertable = false)
    private Timestamp fecha_obtenida;

}
