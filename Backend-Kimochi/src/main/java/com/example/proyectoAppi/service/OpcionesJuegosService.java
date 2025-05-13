package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Emocion;
import com.example.proyectoAppi.model.OpcionesJuegos;
import com.example.proyectoAppi.model.PreguntaJuego;
import com.example.proyectoAppi.repository.OpcionesJuegosRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OpcionesJuegosService {
    private final OpcionesJuegosRepository opcionesJuegosRepository;
    private final PreguntaJuegoService preguntaJuegoService;
    private final EmocionService emocionService;

    public List<OpcionesJuegos> obtenerOpcionesPorPregunta(Integer idPregunta) {
        PreguntaJuego preguntaJuego = preguntaJuegoService.getPreguntaById(idPregunta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego no encontrado"));

        return opcionesJuegosRepository.findByPreguntaJuego(preguntaJuego);
    }

    public Optional<OpcionesJuegos> getOpcioneById(Integer id) {
        return opcionesJuegosRepository.findById(id);
    }

    public OpcionesJuegos crearOpcionSinEmocion(Integer idPregunta, OpcionesJuegos opcion) {
        PreguntaJuego pregunta = preguntaJuegoService.getPreguntaById(idPregunta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pregunta no encontrada"));

        opcion.setPreguntaJuego(pregunta);
        return opcionesJuegosRepository.save(opcion);
    }

    public OpcionesJuegos crearOpcionConEmocion(Integer idPregunta, Integer idEmocion, OpcionesJuegos opcion) {
        PreguntaJuego pregunta = preguntaJuegoService.getPreguntaById(idPregunta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pregunta no encontrada"));

        Emocion emocion = emocionService.getEmocionById(idEmocion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emocion no encontrada"));

        opcion.setPreguntaJuego(pregunta);
        opcion.setEmocion(emocion);

        return opcionesJuegosRepository.save(opcion);
    }

    public List<OpcionesJuegos> obtenerTodasLasOpciones() {

        return opcionesJuegosRepository.findAll();
    }

    public OpcionesJuegos updateOpciones(Integer idOpcion, OpcionesJuegos newOpcion) {
        return opcionesJuegosRepository.findById(idOpcion)
                .map(opcionExistente -> {
                    opcionExistente.setOpcion_texto(newOpcion.getOpcion_texto());
                    opcionExistente.setEs_correcto(newOpcion.isEs_correcto());

                    if (newOpcion.getPreguntaJuego() != null
                            && newOpcion.getPreguntaJuego().getId_pregunta() != null) {

                        PreguntaJuego pregunta = preguntaJuegoService
                                .getPreguntaById(newOpcion.getPreguntaJuego().getId_pregunta())
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND, "Pregunta no encontrada"));

                        opcionExistente.setPreguntaJuego(pregunta);
                    }

                    if (newOpcion.getEmocion() != null
                            && newOpcion.getEmocion().getId_emocion() != null) {

                        Emocion emocion = emocionService
                                .getEmocionById(newOpcion.getEmocion().getId_emocion())
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND, "Emocion no encontrada"));

                        opcionExistente.setEmocion(emocion);
                    } else {
                        opcionExistente.setEmocion(null);
                    }

                    return opcionesJuegosRepository.save(opcionExistente);
                })
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Opcion con ID " + idOpcion + " no encontrada"));
    }

    public void deleteOpcion(Integer id) {
        opcionesJuegosRepository.deleteById(id);
    }

}
