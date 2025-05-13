package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Diario;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.DiarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiarioService {

    private final DiarioRepository diarioR;
    private final usuarioService usuarioS;

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

    public void eliminarRegistro(Integer idRegistro) {
        if (!diarioR.existsById(idRegistro)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro no encontrado");
        }
        diarioR.deleteById(idRegistro);
    }
}
