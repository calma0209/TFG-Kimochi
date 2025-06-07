package com.example.proyectoAppi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoAppi.model.Diario;
import com.example.proyectoAppi.service.DiarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/diario")
@RequiredArgsConstructor
public class DiarioController {

    private final DiarioService diarioS;

    @PostMapping("/crear/{idUsuario}")
    public void crearRegistro(@PathVariable Integer idUsuario, @RequestBody Diario registro) {
        diarioS.crearRegistro(idUsuario, registro);
    }

    @GetMapping
    public List<Diario> obtenerTodosLosRegistros() {
        return diarioS.obtenerTodosLosRegistros();
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Diario> obtenerDiarioPorUsuario(@PathVariable Integer idUsuario) {
        return diarioS.obtenerDiarioPorUsuario(idUsuario);
    }

     @PutMapping("/{idRegistro}")
    public ResponseEntity<Diario> actualizar(@PathVariable Integer idRegistro,
                                             @RequestBody Diario body) {
        Diario actualizado = diarioS.actualizar(idRegistro, body);
        return ResponseEntity.ok(actualizado);
    }
    @DeleteMapping("/{idRegistro}")
    public void eliminarRegistro(@PathVariable Integer idRegistro) {
        diarioS.eliminarRegistro(idRegistro);
    }
}
