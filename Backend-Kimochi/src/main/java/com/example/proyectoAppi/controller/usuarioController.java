package com.example.proyectoAppi.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.LoginRequest;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.service.usuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class usuarioController {

    private final usuarioService userS;

    @PostMapping
    @Operation(summary = "Crear un nuevo usuario", description = "Registra un nuevo usuario en la base de datos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "usuario creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Error en la solicitud")
    })
    public ResponseEntity<?> crearUsuario(@RequestBody usuario user) {
    
        if (userS.findByEmail(user.getEmail()).isPresent()) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Map.of("message", "El correo electrónico ya está registrado."));
    }

        usuario nuevoUsuario = userS.crearUsuario(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @Operation(summary = "Iniciar sesión", description = "Verifica las credenciales del usuario y devuelve sus datos si son correctas.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario autenticado correctamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = usuario.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales incorrectas", content = @Content(mediaType = "text/plain"))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<usuario> usuario = userS.findByEmail(request.getEmail());

        if (usuario.isPresent() && userS.verificarContraseña(request.getContraseña(), usuario.get().getContraseña())) {
            return ResponseEntity.ok(usuario.get()); // Devuelve usuario autenticado.
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
    }

    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Devuelve una lista de todos los usuarios registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida correctamente"),
            @ApiResponse(responseCode = "204", description = "No hay usuarios registrados")
    })
    public ResponseEntity<List<usuario>> obtenerUsuarios() {
        List<usuario> usuarios = userS.getAllUsuarios();
        return usuarios.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Devuelve un usuario específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "usuario no encontrado")
    })
    public ResponseEntity<usuario> obtenerUsuario(@PathVariable Integer id) {
        return userS.getUsuarioById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "usuario con ID " + id + " no encontrado"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "usuario actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "usuario no encontrado"),
            @ApiResponse(responseCode = "400", description = "Solicitud incorrecta")
    })
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody usuario user) {
        try {
            usuario usuarioActualizado = userS.updateUsuario(id, user);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("usuario no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
            } else if (e.getMessage().equals("La contraseña actual es incorrecta.")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
            } else if (e.getMessage().equals("El email ya está registrado.")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario por su ID si existe")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "usuario eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "usuario no encontrado")
    })
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        if (!userS.getUsuarioById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "usuario con ID " + id + " no encontrado");
        }
        userS.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
