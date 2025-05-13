package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Juego;
import com.example.proyectoAppi.repository.JuegoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JuegoService {

    private final JuegoRepository juegoRepository;

    public Juego crearJuego(Juego juego) {
        return juegoRepository.save(juego);
    }

    public List<Juego> getAllJuegos() {
        return juegoRepository.findAll();
    }

    public Optional<Juego> getJuegoById(Integer id) {
        return juegoRepository.findById(id);
    }

    public Juego updateJuego(Integer id, Juego newJuego) {
        return juegoRepository.findById(id)
                .map(juego -> {
                    juego.setTitulo(newJuego.getTitulo());
                    juego.setDescripcion(newJuego.getDescripcion());
                    return juegoRepository.save(juego);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego no encontrado"));
    }

    public void deleteJuego(Integer id) {
        juegoRepository.deleteById(id);

    }

}
