package com.example.proyectoAppi.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.proyectoAppi.model.RespuestaJuego;
import com.example.proyectoAppi.repository.RespuestaJuegoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RespuestaJuegoService {
        private final RespuestaJuegoRepository repo;

          public void guardar(RespuestaJuego r) {
        r.setFecha(LocalDateTime.now());  // completamos el timestamp
        repo.save(r);
    }
}
