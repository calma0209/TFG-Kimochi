package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Recompensa;
import com.example.proyectoAppi.repository.RecompensaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecompensaService {

    private final RecompensaRepository recompensaRepository;

    public Recompensa crearRecompensa(Recompensa recompensa) {
        return recompensaRepository.save(recompensa);
    }

    public List<Recompensa> obtenerTodasRecompensas() {
        return recompensaRepository.findAll();
    }

    public Optional<Recompensa> obtenerRecompensaById(Integer id) {
        return recompensaRepository.findById(id);
    }

    public Recompensa updateRecompensa(Integer id, Recompensa newRecompensa) {
        return recompensaRepository.findById(id).map(
                premio -> {
                    premio.setNombre(newRecompensa.getNombre());
                    premio.setDescripcion(newRecompensa.getDescripcion());
                    premio.setTipo(newRecompensa.getTipo());
                    premio.setImagen_url(newRecompensa.getImagen_url());
                    return recompensaRepository.save(premio);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa no encontrada"));
    }

    public void borrarRecompensa(Integer id) {
        recompensaRepository.deleteById(id);
    }

}
