package com.example.proyectoAppi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoAppi.model.RespuestaJuego;
import com.example.proyectoAppi.service.RespuestaJuegoService;

import org.springframework.web.bind.annotation.RequestBody;   
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/respuestas")
public class RespuestaJuegoController {
    

     private final RespuestaJuegoService service;

       @PostMapping
    public ResponseEntity<Void> guardar(@RequestBody RespuestaJuego r) {
       
        service.guardar(r);
        return ResponseEntity.ok().build();
    }
}
