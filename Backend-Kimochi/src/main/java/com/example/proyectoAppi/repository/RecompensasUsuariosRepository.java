package com.example.proyectoAppi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proyectoAppi.model.Recompensa;
import com.example.proyectoAppi.model.RecompensasUsuarios;
import com.example.proyectoAppi.model.usuario;

@Repository
public interface RecompensasUsuariosRepository extends JpaRepository<RecompensasUsuarios, Integer> {
    List<RecompensasUsuarios> findByUsuario(usuario usuario);
boolean existsByUsuarioAndRecompensa(usuario usuario, Recompensa recompensa);



    List<RecompensasUsuarios> findByRecompensa(Recompensa recompensa);
}
