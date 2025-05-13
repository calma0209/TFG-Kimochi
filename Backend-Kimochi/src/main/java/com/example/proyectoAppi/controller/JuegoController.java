package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Juego;
import com.example.proyectoAppi.service.JuegoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/juegos")
@RequiredArgsConstructor
public class JuegoController {

    private final JuegoService juegoService;

    @PostMapping
    @Operation(summary = "Crear un nuevo juego", description = "Registra un nuevo juego en la base de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Juego creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    public ResponseEntity<Juego> crearJuego(@RequestBody Juego juego) {
        try {
            Juego nuevoJuego = juegoService.crearJuego(juego);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoJuego);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear el juego");
        }
    }

    @GetMapping
    @Operation(summary = "Obtener todos los juegos", description = "Devuelve una lista de todos los juegos registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de juegos obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay juegos registrados")
    })
    public ResponseEntity<List<Juego>> obtenerTodosLosJuegos() {
        List<Juego> juegos = juegoService.getAllJuegos();
        return juegos.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(juegos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener juego por ID", description = "Devuelve un juego específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Juego encontrado"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado")
    })
    public ResponseEntity<Juego> obtenerJuego(@PathVariable Integer id) {
        return juegoService.getJuegoById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Juego con ID " + id + " no encontrado"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar juego", description = "Actualiza los datos de un juego por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Juego actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<Juego> actualizarJuego(@PathVariable Integer id, @RequestBody Juego juego) {
        Optional<Juego> juegoExiste = juegoService.getJuegoById(id);

        if (juegoExiste.isPresent()) {
            Juego actualizado = juegoService.updateJuego(id, juego);
            return ResponseEntity.ok(actualizado);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego con ID " + id + " no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar juego", description = "Elimina un juego por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Juego eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Juego no encontrado")
    })
    public ResponseEntity<Void> eliminarJuego(@PathVariable Integer id) {
        if (!juegoService.getJuegoById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Juego con ID " + id + " no encontrado");
        }
        juegoService.deleteJuego(id);
        return ResponseEntity.noContent().build();
    }
}
