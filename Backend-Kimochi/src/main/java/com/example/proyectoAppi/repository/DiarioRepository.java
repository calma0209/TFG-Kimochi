package com.example.proyectoAppi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyectoAppi.model.Diario;
import com.example.proyectoAppi.model.usuario;

public interface DiarioRepository extends JpaRepository<Diario, Integer> {
    List<Diario> findByUsuario(usuario usuario);
}
