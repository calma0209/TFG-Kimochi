package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.RecompensasUsuarios;
import com.example.proyectoAppi.service.RecompensasUsuariosService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recompensas-usuarios")
@RequiredArgsConstructor
public class RecompensasUsuariosController {

    private final RecompensasUsuariosService recompensasUsuariosService;

    @PostMapping("/usuario/{idUsuario}/recompensa/{idRecompensa}")
    @Operation(summary = "Asignar recompensa a un usuario", description = "Asigna una recompensa específica a un usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Recompensa asignada correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta"),
            @ApiResponse(responseCode = "404", description = "Usuario o recompensa no encontrada")
    })
    public ResponseEntity<RecompensasUsuarios> asignarRecompensa(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idRecompensa,
            @RequestBody RecompensasUsuarios recompensaUsuario) {
        try {
            RecompensasUsuarios nuevaRecompensa = recompensasUsuariosService.asignarRecompensa(idUsuario, idRecompensa,
                    recompensaUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaRecompensa);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error al asignar recompensa");
        }
    }

    @GetMapping
    @Operation(summary = "Obtener todas las recompensas asignadas", description = "Devuelve todas las recompensas asignadas a los usuarios")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de recompensas obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay recompensas asignadas")
    })
    public ResponseEntity<List<RecompensasUsuarios>> obtenerTodas() {
        List<RecompensasUsuarios> recompensas = recompensasUsuariosService.getAllRecompensas();
        return recompensas.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(recompensas);
    }

    @GetMapping("/usuario/{idUsuario}")
    @Operation(summary = "Obtener recompensas de un usuario", description = "Devuelve todas las recompensas asignadas a un usuario específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recompensas obtenidas correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontraron recompensas para este usuario")
    })
    public ResponseEntity<List<RecompensasUsuarios>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        List<RecompensasUsuarios> recompensas = recompensasUsuariosService.getByUsuarioId(idUsuario);
        return recompensas.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(recompensas);
    }

    @GetMapping("/recompensa/{idRecompensa}")
    @Operation(summary = "Obtener usuarios con una recompensa específica", description = "Devuelve todos los usuarios que han recibido una recompensa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuarios obtenidos correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontraron usuarios con esta recompensa")
    })
    public ResponseEntity<List<RecompensasUsuarios>> obtenerPorRecompensa(@PathVariable Integer idRecompensa) {
        List<RecompensasUsuarios> recompensas = recompensasUsuariosService.getByRecompensaId(idRecompensa);
        return recompensas.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).build()
                : ResponseEntity.ok(recompensas);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener asignación recompensa-usuario por ID", description = "Devuelve la relación de una recompensa con un usuario por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Asignación encontrada"),
            @ApiResponse(responseCode = "404", description = "No se encontró la asignación")
    })
    public ResponseEntity<RecompensasUsuarios> obtenerRecompensaUsuarioById(@PathVariable Integer id) {
        return recompensasUsuariosService.obtenerRecompensaUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la relación de recompensa con usuario"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar recompensa de un usuario", description = "Elimina la relación entre un usuario y una recompensa específica")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Recompensa eliminada correctamente"),
            @ApiResponse(responseCode = "404", description = "No se encontró la relación de recompensa con usuario")
    })
    public ResponseEntity<Void> borrarRecompensaUsuario(@PathVariable Integer id) {
        Optional<RecompensasUsuarios> recompensa = recompensasUsuariosService.obtenerRecompensaUsuarioById(id);
        if (recompensa.isPresent()) {
            recompensasUsuariosService.borrarRecompensaUsuario(id);
            return ResponseEntity.noContent().build();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No se encontró la relación de recompensa con usuario");
        }
    }
}
