package com.example.proyectoAppi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoAppi.model.Juego;
import com.example.proyectoAppi.model.PreguntaJuego;

public interface PreguntaRepository extends JpaRepository<PreguntaJuego, Integer> {
    List<PreguntaJuego> findByJuego(Juego juego);
}
