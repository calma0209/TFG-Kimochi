package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.OpcionesJuegos;
import com.example.proyectoAppi.service.OpcionesJuegosService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/opciones")
@RequiredArgsConstructor
public class OpcionesJuegosController {

    private final OpcionesJuegosService opcionesJuegosService;

    // CREAR OPCIÓN SIN EMOCIÓN
    @PostMapping("/pregunta/{idPregunta}")
    @Operation(summary = "Crear una opción sin emoción", description = "Registra una opción de respuesta sin asociar a una emoción")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Opción creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud"),
            @ApiResponse(responseCode = "404", description = "Pregunta no encontrada")
    })
    public ResponseEntity<OpcionesJuegos> crearOpcionSinEmocion(@PathVariable Integer idPregunta,
            @RequestBody OpcionesJuegos opcion) {
        try {
            OpcionesJuegos nuevaOpcion = opcionesJuegosService.crearOpcionSinEmocion(idPregunta, opcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOpcion);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear la opción");
        }
    }

    // CREAR OPCIÓN ASOCIADA A UNA EMOCIÓN
    @PostMapping("/pregunta/{idPregunta}/emocion/{idEmocion}")
    @Operation(summary = "Crear una opción asociada a una emoción", description = "Registra una opción de respuesta vinculada a una emoción específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Opción creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud"),
            @ApiResponse(responseCode = "404", description = "Pregunta o emoción no encontrada")
    })
    public ResponseEntity<OpcionesJuegos> crearOpcionConEmocion(
            @PathVariable Integer idPregunta,
            @PathVariable Integer idEmocion,
            @RequestBody OpcionesJuegos opcion) {
        try {
            OpcionesJuegos nuevaOpcion = opcionesJuegosService.crearOpcionConEmocion(idPregunta, idEmocion, opcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOpcion);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear la opción");
        }
    }

    // OBTENER TODAS LAS OPCIONES
    @GetMapping
    @Operation(summary = "Obtener todas las opciones", description = "Devuelve una lista de todas las opciones registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de opciones obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay opciones registradas")
    })
    public ResponseEntity<List<OpcionesJuegos>> obtenerTodasLasOpciones() {
        List<OpcionesJuegos> opciones = opcionesJuegosService.obtenerTodasLasOpciones();
        return opciones.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(opciones);
    }

    // OBTENER OPCIONES POR ID DE PREGUNTA
    @GetMapping("/pregunta/{idPregunta}")
    @Operation(summary = "Obtener opciones por pregunta", description = "Devuelve todas las opciones de respuesta asociadas a una pregunta específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Opciones obtenidas correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontraron opciones para esta pregunta")
    })
    public ResponseEntity<List<OpcionesJuegos>> obtenerOpcionesPorPregunta(@PathVariable Integer idPregunta) {
        List<OpcionesJuegos> opciones = opcionesJuegosService.obtenerOpcionesPorPregunta(idPregunta);
        return opciones.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build() : ResponseEntity.ok(opciones);
    }

    // ACTUALIZAR OPCIÓN POR ID
    @PutMapping("/{idOpcion}")
    @Operation(summary = "Actualizar opción de juego", description = "Actualiza los datos de una opción de juego por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Opción actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Opción no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<OpcionesJuegos> actualizarOpcion(@PathVariable Integer idOpcion,
            @RequestBody OpcionesJuegos opcion) {
        Optional<OpcionesJuegos> opcionExiste = opcionesJuegosService.getOpcioneById(idOpcion);

        if (opcionExiste.isPresent()) {
            OpcionesJuegos actualizada = opcionesJuegosService.updateOpciones(idOpcion, opcion);
            return ResponseEntity.ok(actualizada);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Opción con ID " + idOpcion + " no encontrada");
        }
    }

    // ELIMINAR OPCIÓN POR ID
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar opción", description = "Elimina una opción por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Opción eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Opción no encontrada")
    })
    public ResponseEntity<Void> eliminarOpcion(@PathVariable Integer id) {
        if (!opcionesJuegosService.getOpcioneById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Opción con ID " + id + " no encontrada");
        }
        opcionesJuegosService.deleteOpcion(id);
        return ResponseEntity.noContent().build();
    }
}
