package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Recompensa;
import com.example.proyectoAppi.service.RecompensaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recompensas")
@RequiredArgsConstructor
public class RecompensaController {

    private final RecompensaService recompensaService;

    @PostMapping
    @Operation(summary = "Crear una nueva recompensa", description = "Registra una nueva recompensa en la base de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Recompensa creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    public ResponseEntity<Recompensa> crearRecompensa(@RequestBody Recompensa recompensa) {
        try {
            Recompensa nuevaRecompensa = recompensaService.crearRecompensa(recompensa);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRecompensa);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al crear la recompensa");
        }
    }

    @GetMapping
    @Operation(summary = "Obtener todas las recompensas", description = "Devuelve una lista de todas las recompensas registradas")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de recompensas obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay recompensas registradas")
    })
    public ResponseEntity<List<Recompensa>> obtenerTodasRecompensas() {
        List<Recompensa> recompensas = recompensaService.obtenerTodasRecompensas();
        return recompensas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(recompensas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener recompensa por ID", description = "Devuelve una recompensa específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recompensa encontrada"),
            @ApiResponse(responseCode = "404", description = "Recompensa no encontrada")
    })
    public ResponseEntity<Recompensa> obtenerRecompensaPorId(@PathVariable Integer id) {
        return recompensaService.obtenerRecompensaById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Recompensa con ID " + id + " no encontrada"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar recompensa", description = "Actualiza los datos de una recompensa por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recompensa actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Recompensa no encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<Recompensa> actualizarRecompensa(@PathVariable Integer id,
            @RequestBody Recompensa recompensa) {
        Optional<Recompensa> recompensaExiste = recompensaService.obtenerRecompensaById(id);

        if (recompensaExiste.isPresent()) {
            Recompensa actualizada = recompensaService.updateRecompensa(id, recompensa);
            return ResponseEntity.ok(actualizada);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa con ID " + id + " no encontrada");
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar recompensa", description = "Elimina una recompensa por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Recompensa eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "Recompensa no encontrada")
    })
    public ResponseEntity<Void> borrarRecompensa(@PathVariable Integer id) {
        if (!recompensaService.obtenerRecompensaById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa con ID " + id + " no encontrada");
        }
        recompensaService.borrarRecompensa(id);
        return ResponseEntity.noContent().build();
    }
}
