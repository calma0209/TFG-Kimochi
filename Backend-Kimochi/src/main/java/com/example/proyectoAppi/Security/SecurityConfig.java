package com.example.proyectoAppi.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.http.HttpMethod.POST;
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS completamente abierto (solo para desarrollo)
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }

    // ✅ Seguridad HTTP con CSRF desactivado y rutas públicas
   @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
          
            .requestMatchers("/api/usuarios/login").permitAll()
            .requestMatchers("/api/usuarios").permitAll()     
            .requestMatchers(POST, "/api/usuarios/*/monedas/sumar").permitAll()
          
            .requestMatchers("/api/usuarios/forgot-password").permitAll()
            .requestMatchers("/api/usuarios/reset-password").permitAll()
            .requestMatchers("api/enviar-informe/**").permitAll()
            
            .requestMatchers("/api/respuestas/**").permitAll()
            .requestMatchers("/api/usuarios/**").permitAll()
          .requestMatchers(GET,"/api/usuarios/**").permitAll()
             .requestMatchers(GET, "/api/emociones/**").permitAll()
            .requestMatchers(GET, "/api/diario/usuario/**").permitAll()
            
            .requestMatchers("/api/diario/crear/**").permitAll()
            .requestMatchers(PUT,    "/api/diario/**").permitAll()
              .requestMatchers(DELETE, "/api/diario/**").permitAll() 

               .requestMatchers(GET, "/api/recompensas-usuarios/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
          
            .anyRequest().authenticated()
        );
    return http.build();
}
}
