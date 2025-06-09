package com.example.proyectoAppi.repository;

import com.example.proyectoAppi.model.RespuestaJuego;
import com.example.proyectoAppi.model.usuario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RespuestaJuegoRepository extends JpaRepository<RespuestaJuego, Integer> {
//  List<RespuestaJuego> findByUsuario(Optional<usuario> u);

 List<RespuestaJuego> findByUsuario(Optional<usuario> u);
    
}
