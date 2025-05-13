package com.example.proyectoAppi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoAppi.model.RespuestasUsuarios;
import com.example.proyectoAppi.model.usuario;

import java.util.List;

public interface RespuestasUsuarioRespository extends JpaRepository<RespuestasUsuarios, Integer> {
    List<RespuestasUsuarios> findByUsuario(usuario usuario);
}
