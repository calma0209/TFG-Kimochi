package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.usuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class usuarioService {

    private final usuarioRepository usuarioR;
    private final PasswordEncoder passwordEncoder;

    public usuario crearUsuario(usuario user) {
        user.setContraseña(passwordEncoder.encode(user.getContraseña()));
        return usuarioR.save(user);
    }

    public List<usuario> getAllUsuarios() {
        return usuarioR.findAll();
    }

    public Optional<usuario> getUsuarioById(Integer id) {
        return usuarioR.findById(id);
    }

    public Optional<usuario> findByEmail(String email) {
        return usuarioR.findByEmail(email);
    }

    public boolean verificarContraseña(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    public usuario updateUsuario(Integer id, usuario newUsuario) {
        return usuarioR.findById(id)
                .map(user -> {
                    if (!user.getEmail().equals(newUsuario.getEmail())
                            && usuarioR.findByEmail(newUsuario.getEmail()).isPresent()) {
                        throw new RuntimeException("El email ya está registrado.");
                    }
                    user.setNombre_usuario(newUsuario.getNombre_usuario());
                    user.setEmail(newUsuario.getEmail());

                    // Verificar si el usuario quiere cambiar contraseña
                    if (newUsuario.getContraseña_actual() != null && !newUsuario.getContraseña_actual().isEmpty() &&
                            newUsuario.getContraseña() != null && !newUsuario.getContraseña().isEmpty()) {

                        // Verificacion de contraseña sea igual a la de la BBDD
                        if (!passwordEncoder.matches(newUsuario.getContraseña_actual(), user.getContraseña())) {
                            throw new RuntimeException("La contraseña actual es incorrecta.");
                        }
                        // hasheo de contraseñas
                        user.setContraseña(passwordEncoder.encode(newUsuario.getContraseña()));
                    }

                    user.setRol(newUsuario.getRol());
                    return usuarioR.save(user);
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    public void deleteUsuario(Integer id) {
        usuarioR.deleteById(id);

    }
}