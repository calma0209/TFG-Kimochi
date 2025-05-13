package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Emocion;

import com.example.proyectoAppi.repository.EmocionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmocionService {
    private final EmocionRepository emocionR;

    public Emocion crearEmocion(Emocion emotion) {
        return emocionR.save(emotion);
    }

    public List<Emocion> getAllEmociones() {
        return emocionR.findAll();
    }

    public Optional<Emocion> getEmocionById(Integer id) {
        return emocionR.findById(id);
    }

    public Emocion updateEmocion(Integer id, Emocion newEmocion) {
        return emocionR.findById(id)
                .map(emotion -> {
                    emotion.setNombre_emocion(newEmocion.getNombre_emocion());
                    emotion.setImagen_url(newEmocion.getImagen_url());
                    return emocionR.save(emotion);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Emocion no encontrada"));
    }

    public void deleteEmocion(Integer id) {
        emocionR.deleteById(id);

    }

}
