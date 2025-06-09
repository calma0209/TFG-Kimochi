package com.example.proyectoAppi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyectoAppi.service.CorreoService;
import com.example.proyectoAppi.service.InformeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class InformeController {
      private final InformeService informeService;
    private final CorreoService correoService;

    @PostMapping("/enviar-informe/{idUsuario}")
    public ResponseEntity<Void> enviar(@PathVariable Integer idUsuario) {
        try {
            byte[] pdf = informeService.generarPdf(idUsuario);
            correoService.enviarInforme(idUsuario, pdf);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}