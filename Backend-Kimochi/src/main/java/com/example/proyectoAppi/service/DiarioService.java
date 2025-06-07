package com.example.proyectoAppi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Diario;
import com.example.proyectoAppi.model.Emocion;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.DiarioRepository;
import com.example.proyectoAppi.repository.EmocionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiarioService {

    private final DiarioRepository diarioR;
    private final usuarioService usuarioS;
    private final EmocionRepository emocionRepository;

    public Diario crearRegistro(Integer idUser, Diario registro) {
        usuario usuario = usuarioS.getUsuarioById(idUser)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        registro.setUsuario(usuario);
        return diarioR.save(registro);
    }

    public List<Diario> obtenerTodosLosRegistros() {
        return diarioR.findAll();
    }

    public Optional<Diario> obtenerRegistroById(Integer id) {
        return diarioR.findById(id);
    }

    public List<Diario> obtenerDiarioPorUsuario(Integer idUsuario) {
        usuario usuario = usuarioS.getUsuarioById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        return diarioR.findByUsuario(usuario);
    }
    // DiarioService.java
  public Diario actualizar(Integer idRegistro, Diario dto) {
        Diario entidad = diarioR.findById(idRegistro)
                          .orElseThrow(() -> new IllegalArgumentException("Registro no existe"));

        Emocion emocion = emocionRepository.findById(dto.getEmocion().getId_emocion())
                          .orElseThrow(() -> new IllegalArgumentException("Emoción no existe"));

        entidad.setNota(dto.getNota());
        entidad.setEmocion(emocion);
      

        return diarioR.save(entidad);
    }


    public void eliminarRegistro(Integer idRegistro) {
        if (!diarioR.existsById(idRegistro)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado");
        }
        diarioR.deleteById(idRegistro);
    }
}
