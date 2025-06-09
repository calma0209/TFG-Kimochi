package com.example.proyectoAppi.service;


import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.proyectoAppi.repository.usuarioRepository;
@Service
@RequiredArgsConstructor
public class CorreoService {
     private final JavaMailSender mailSender;
    private final usuarioRepository usuarioRepo;

    public void enviarInforme(Integer idUsuario, byte[] pdf) throws Exception {
        var usuario = usuarioRepo.findById(idUsuario)
                                 .orElseThrow();

        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

        helper.setTo(usuario.getEmail());
        helper.setSubject("Informe de progreso Kimochi");
        helper.setText("Adjuntamos el informe del progreso de tu hijo.");

        helper.addAttachment("informe.pdf", new ByteArrayResource(pdf));

        mailSender.send(msg);
    }
}