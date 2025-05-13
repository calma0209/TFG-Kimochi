package com.example.proyectoAppi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoAppi.model.Emocion;
import com.example.proyectoAppi.model.OpcionesJuegos;
import com.example.proyectoAppi.model.PreguntaJuego;

public interface OpcionesJuegosRepository extends JpaRepository<OpcionesJuegos, Integer> {
    List<OpcionesJuegos> findByPreguntaJuego(PreguntaJuego preguntaJuego);

    List<OpcionesJuegos> findByEmocion(Emocion emocion);
}
