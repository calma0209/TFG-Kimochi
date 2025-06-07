package com.example.proyectoAppi.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.proyectoAppi.model.Recompensa;
import com.example.proyectoAppi.model.RecompensasUsuarios;
import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.RecompensaRepository;
import com.example.proyectoAppi.repository.RecompensasUsuariosRepository;
import com.example.proyectoAppi.repository.usuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class usuarioService {

    private final usuarioRepository usuarioR;
    private final PasswordEncoder passwordEncoder;
    private final RecompensasUsuariosRepository recompensasUsuariosRepository;
    private final RecompensaRepository recompensaRepository;
    private final EmailService emailService;
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

    public void actualizarNivel(int idUsuario, int nuevoNivel) {
        Optional<usuario> optionalUsuario = usuarioR.findById(idUsuario);
        if (optionalUsuario.isPresent()) {
            usuario usuario = optionalUsuario.get();
            usuario.setNivel(nuevoNivel);
            usuarioR.save(usuario);
        }
    }
    public void forgotPassword(String email) {
    Optional<usuario> optUser = usuarioR.findByEmail(email);
    if (optUser.isEmpty()) {
        throw new IllegalArgumentException("El correo no está registrado.");
    }

    usuario user = optUser.get();

    // 1️⃣ Generar y guardar token
    String token = UUID.randomUUID().toString();
    user.setTokenReset(token);
    usuarioR.save(user);

    // 2️⃣ Construir deep-link
    //    Usa tu host de Expo (túnel o LAN). Puedes inyectarlo por variable de entorno.
    String host = System.getenv().getOrDefault("EXPO_HOST", "gbjt_so-slubyn-8081.exp.direct");
    String enlace = "exp://" + host + "/--/resetPassword?email=" + email + "&token=" + token;

    // 3️⃣ Plantilla HTML del correo
    String html = """
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center;">
            <h2>Restablecer tu contraseña</h2>
            <p>Haz clic en el botón para abrir Kimochi y crear una nueva contraseña:</p>
            <a href="%s" style="background-color:#FFB800;color:black;padding:12px 20px;
               border-radius:6px;text-decoration:none;font-weight:bold;">
              ABRIR EN KIMOCHI
            </a>
            <p>Si no funciona el botón, copia y pega este enlace en tu navegador:</p>
            <p>%s</p>
          </body>
        </html>
        """.formatted(enlace, enlace);

    emailService.enviarCorreo(email, "Recuperación de contraseña – Kimochi", html);
}



    public ResponseEntity<String> resetearPassword(String email, String token, String nuevaPassword) {
        Optional<usuario> usuarioOpt = usuarioR.findByEmail(email);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        usuario usuario = usuarioOpt.get();
        if (!token.equals(usuario.getTokenReset())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }

       usuario.setContraseña(passwordEncoder.encode(nuevaPassword)); // 🔐 ahora sí encriptada

        usuario.setTokenReset(null); // invalida token
        usuarioR.save(usuario);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }


  public void completarNivel(int idUsuario, int nuevoNivel) {
    Optional<usuario> optionalUsuario = usuarioR.findById(idUsuario);
    if (optionalUsuario.isPresent()) {
        usuario usuario = optionalUsuario.get();

        // Calcular el nivel que acaba de completar
        int nivelCompletado = nuevoNivel - 1;

        // Buscar recompensa por completar el nivel anterior
        String nombreRecompensa = "Nivel " + nivelCompletado + " completado";
        Recompensa recompensa = recompensaRepository.findByNombre(nombreRecompensa);

        if (recompensa != null) {
            // Verificar si el usuario ya tiene la recompensa
            boolean yaRegistrada = recompensasUsuariosRepository.existsByUsuarioAndRecompensa(usuario, recompensa);

            if (!yaRegistrada) {
                RecompensasUsuarios recompensaUsuario = new RecompensasUsuarios();
                recompensaUsuario.setUsuario(usuario);
                recompensaUsuario.setRecompensa(recompensa);
                recompensaUsuario.setCantidad_monedas(0);
                recompensasUsuariosRepository.save(recompensaUsuario);
            } else {
                System.out.println("ℹEl usuario ya tiene esta recompensa del nivel " + nivelCompletado);
            }
        } else {
            System.out.println("Recompensa no encontrada para el nivel " + nivelCompletado);
        }

        // Actualizar el nivel del usuario
        usuario.setNivel(nuevoNivel);
        usuarioR.save(usuario);
    } else {
        System.out.println("Usuario con ID " + idUsuario + " no encontrado.");
    }
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
                }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "usuario no encontrado"));
    }

    public void deleteUsuario(Integer id) {
        usuarioR.deleteById(id);

    }
}