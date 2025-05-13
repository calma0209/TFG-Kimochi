package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Juego;
import com.example.proyectoAppi.model.PreguntaJuego;
import com.example.proyectoAppi.repository.PreguntaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreguntaJuegoService {

    private final PreguntaRepository preguntaRepository;
    private final JuegoService juegoService;

    public List<PreguntaJuego> obtenerPreguntasPorJuego(Integer idJuego) {
        Juego juego = juegoService.getJuegoById(idJuego)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego no encontrado"));

        return preguntaRepository.findByJuego(juego);
    }

    public Optional<PreguntaJuego> getPreguntaById(Integer id) {
        return preguntaRepository.findById(id);
    }

    public PreguntaJuego crearPregunta(Integer idJuego, PreguntaJuego pregunta) {
        Juego juego = juegoService.getJuegoById(idJuego)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego no encontrado"));

        pregunta.setJuego(juego);
        return preguntaRepository.save(pregunta);
    }

    public List<PreguntaJuego> obtenerTodasLasPreguntas() {

        return preguntaRepository.findAll();
    }

    // ?pasar id juego?
    public PreguntaJuego updatePregunta(Integer idPregunta, PreguntaJuego newPregunta) {
        return preguntaRepository.findById(idPregunta)
                .map(question -> {
                    question.setPregunta(newPregunta.getPregunta());
                    return preguntaRepository.save(question);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego no encontrado"));

    }

    public void deletePregunta(Integer id) {
        preguntaRepository.deleteById(id);
    }
}
