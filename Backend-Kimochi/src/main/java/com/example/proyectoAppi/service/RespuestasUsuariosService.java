package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.OpcionesJuegos;
import com.example.proyectoAppi.model.PreguntaJuego;
import com.example.proyectoAppi.model.RespuestasUsuarios;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.RespuestasUsuarioRespository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RespuestasUsuariosService {

    private final RespuestasUsuarioRespository respuestasUsuarioRespository;
    private final usuarioService usuarioService;
    private final PreguntaJuegoService preguntaJuegoService;
    private final OpcionesJuegosService opcionesJuegosService;

    public List<RespuestasUsuarios> obtenerRespuestasPorUsuario(Integer idUsuario) {
        usuario user = usuarioService.getUsuarioById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return respuestasUsuarioRespository.findByUsuario(user);
    }

    public RespuestasUsuarios crearRespuesta(Integer idUsuario, Integer idPregunta, Integer idOpcion,
            RespuestasUsuarios respuesta) {
        usuario user = usuarioService.getUsuarioById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        PreguntaJuego pregunta = preguntaJuegoService.getPreguntaById(idPregunta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pregunta no encontrada"));

        OpcionesJuegos opcion = opcionesJuegosService.getOpcioneById(idOpcion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opcion no encontrada"));

        respuesta.setUsuario(user);
        respuesta.setPreguntaJuego(pregunta);
        respuesta.setOpcionJuego(opcion);
        // respuesta.setEs_correcto(opcion.isEs_correcto());

        return respuestasUsuarioRespository.save(respuesta);
    }

    public List<RespuestasUsuarios> obtenerTodasLasRespuestas() {
        return respuestasUsuarioRespository.findAll();
    }

    public Optional<RespuestasUsuarios> obtenerRespuestaById(Integer idRespuesta) {
        return respuestasUsuarioRespository.findById(idRespuesta);
    }

}
