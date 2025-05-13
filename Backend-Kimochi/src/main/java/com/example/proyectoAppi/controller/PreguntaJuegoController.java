package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.PreguntaJuego;
import com.example.proyectoAppi.service.PreguntaJuegoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/preguntas")
@RequiredArgsConstructor
public class PreguntaJuegoController {

    private final PreguntaJuegoService preguntaJuegoService;

    @PostMapping("/juego/{id}")
    @Operation(summary = "Crear una nueva pregunta", description = "Registra una nueva pregunta en un juego específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pregunta creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado")
    })
    public ResponseEntity<PreguntaJuego> crearPregunta(@PathVariable Integer id, @RequestBody PreguntaJuego pregunta) {
        try {
            PreguntaJuego nuevaPregunta = preguntaJuegoService.crearPregunta(id, pregunta);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPregunta);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear la pregunta");
        }
    }

    @GetMapping
    @Operation(summary = "Obtener todas las preguntas", description = "Devuelve una lista de todas las preguntas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de preguntas obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay preguntas registradas")
    })
    public ResponseEntity<List<PreguntaJuego>> obtenerTodasLasPreguntas() {
        List<PreguntaJuego> preguntas = preguntaJuegoService.obtenerTodasLasPreguntas();
        return preguntas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(preguntas);
    }

    @GetMapping("/juego/{id}")
    @Operation(summary = "Obtener preguntas por juego", description = "Devuelve todas las preguntas asociadas a un juego específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Preguntas obtenidas correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontraron preguntas para este juego")
    })
    public ResponseEntity<List<PreguntaJuego>> obtenerPreguntasPorJuego(@PathVariable Integer id) {
        List<PreguntaJuego> preguntas = preguntaJuegoService.obtenerPreguntasPorJuego(id);
        return preguntas.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build() : ResponseEntity.ok(preguntas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener pregunta por ID", description = "Devuelve una pregunta específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pregunta encontrada"),
            @ApiResponse(responseCode = "404", description = "Pregunta no encontrada")
    })
    public ResponseEntity<PreguntaJuego> obtenerPreguntaPorId(@PathVariable Integer id) {
        return preguntaJuegoService.getPreguntaById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Pregunta con ID " + id + " no encontrada"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar pregunta", description = "Actualiza el contenido de una pregunta por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pregunta actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Pregunta no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<PreguntaJuego> actualizarPregunta(@PathVariable Integer id,
            @RequestBody PreguntaJuego pregunta) {
        Optional<PreguntaJuego> preguntaExiste = preguntaJuegoService.getPreguntaById(id);

        if (preguntaExiste.isPresent()) {
            PreguntaJuego actualizada = preguntaJuegoService.updatePregunta(id, pregunta);
            return ResponseEntity.ok(actualizada);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pregunta con ID " + id + " no encontrada");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar pregunta", description = "Elimina una pregunta por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pregunta eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Pregunta no encontrada")
    })
    public ResponseEntity<Void> eliminarPregunta(@PathVariable Integer id) {
        if (!preguntaJuegoService.getPreguntaById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pregunta con ID " + id + " no encontrada");
        }
        preguntaJuegoService.deletePregunta(id);
        return ResponseEntity.noContent().build();
    }
}
