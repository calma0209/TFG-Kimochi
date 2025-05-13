package com.example.proyectoAppi.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "emociones")
public class Emocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_emocion;

    @Column(nullable = false)
    private String nombre_emocion;

    @Column(nullable = false)
    private String imagen_url;

    @OneToMany(mappedBy = "emocion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OpcionesJuegos> opcionesJuegosList;
}
