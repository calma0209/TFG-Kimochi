package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Recompensa;
import com.example.proyectoAppi.model.RecompensasUsuarios;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.RecompensasUsuariosRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecompensasUsuariosService {

    private final RecompensasUsuariosRepository recompensasUsuariosRepository;
    private final usuarioService usuarioService;
    private final RecompensaService recompensaService;

    public RecompensasUsuarios asignarRecompensa(Integer idUsuario, Integer idRecompensa,
            RecompensasUsuarios recompensaUsuario) {
        usuario usuario = usuarioService.getUsuarioById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Recompensa recompensa = recompensaService.obtenerRecompensaById(idRecompensa)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa no encontrada"));

        recompensaUsuario.setUsuario(usuario);
        recompensaUsuario.setRecompensa(recompensa);

        return recompensasUsuariosRepository.save(recompensaUsuario);
    }

    public List<RecompensasUsuarios> getAllRecompensas() {
        return recompensasUsuariosRepository.findAll();
    }

    public List<RecompensasUsuarios> getByUsuarioId(Integer usuarioId) {
        usuario user = usuarioService.getUsuarioById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return recompensasUsuariosRepository.findByUsuario(user);
    }

    public List<RecompensasUsuarios> getByRecompensaId(Integer recompensaId) {
        Recompensa recompensa = recompensaService.obtenerRecompensaById(recompensaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recompensa no encontrada"));

        return recompensasUsuariosRepository.findByRecompensa(recompensa);
    }

    public Optional<RecompensasUsuarios> obtenerRecompensaUsuarioById(Integer id) {
        return recompensasUsuariosRepository.findById(id);
    }

    public void borrarRecompensaUsuario(Integer id) {
        if (!recompensasUsuariosRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No se encontró la recompensa del usuario con ID " + id);
        }
        recompensasUsuariosRepository.deleteById(id);
    }
}
