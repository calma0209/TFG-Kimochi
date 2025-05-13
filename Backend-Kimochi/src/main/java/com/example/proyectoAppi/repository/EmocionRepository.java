package com.example.proyectoAppi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proyectoAppi.model.Emocion;

@Repository
public interface EmocionRepository extends JpaRepository<Emocion, Integer> {

}
