package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Emocion;
import com.example.proyectoAppi.service.EmocionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emociones")
@RequiredArgsConstructor
public class EmocionController {

    private final EmocionService emocionS;

    @PostMapping
    @Operation(summary = "Crear una nueva emoción", description = "Registra una nueva emoción en la base de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Emoción creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    public ResponseEntity<Emocion> crearEmocion(@RequestBody Emocion emocion) {
        try {
            Emocion nuevaEmocion = emocionS.crearEmocion(emocion);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaEmocion);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear la emoción");
        }
    }

    @GetMapping
    @Operation(summary = "Obtener todas las emociones", description = "Devuelve una lista de todas las emociones registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de emociones obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay emociones registradas")
    })
    public ResponseEntity<List<Emocion>> obtenerEmociones() {
        List<Emocion> emociones = emocionS.getAllEmociones();
        return emociones.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(emociones);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener emoción por ID", description = "Devuelve una emoción específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Emoción encontrada"),
            @ApiResponse(responseCode = "404", description = "Emoción no encontrada")
    })
    public ResponseEntity<Emocion> obtenerEmocion(@PathVariable Integer id) {
        return emocionS.getEmocionById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Emoción con ID " + id + " no encontrada"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar emoción", description = "Actualiza los datos de una emoción por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Emoción actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Emoción no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<Emocion> actualizarEmocion(@PathVariable Integer id, @RequestBody Emocion emocion) {
        Optional<Emocion> emocionExiste = emocionS.getEmocionById(id);

        if (emocionExiste.isPresent()) {
            Emocion actualizada = emocionS.updateEmocion(id, emocion);
            return ResponseEntity.ok(actualizada);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Emoción con ID " + id + " no encontrada");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar emoción", description = "Elimina una emoción por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Emoción eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Emoción no encontrada")
    })
    public ResponseEntity<Void> eliminarEmocion(@PathVariable Integer id) {
        if (!emocionS.getEmocionById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Emoción con ID " + id + " no encontrada");
        }
        emocionS.deleteEmocion(id);
        return ResponseEntity.noContent().build();
    }
}
