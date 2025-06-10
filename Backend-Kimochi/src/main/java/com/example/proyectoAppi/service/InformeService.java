package com.example.proyectoAppi.service;

import lombok.RequiredArgsConstructor;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.stereotype.Service;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Optional;

import com.example.proyectoAppi.model.usuario;
import com.example.proyectoAppi.repository.RespuestaJuegoRepository;



@Service
@RequiredArgsConstructor
public class InformeService {
     private final RespuestaJuegoRepository repo;
     private final usuarioService usuarioService;

    public byte[] generarPdf(Integer idUsuario) throws Exception {
  Optional<usuario> u = usuarioService.getUsuarioById(idUsuario);
    var lista = repo.findByUsuario(u);

        long emoOK = lista.stream().filter(r -> r.getJuego().equals("emociones") && r.isCorrecta()).count();
        long emoKO = lista.stream().filter(r -> r.getJuego().equals("emociones") && !r.isCorrecta()).count();
        long empOK = lista.stream().filter(r -> r.getJuego().equals("empatia")   && r.isCorrecta()).count();
        long empKO = lista.stream().filter(r -> r.getJuego().equals("empatia")   && !r.isCorrecta()).count();
        long cmsTot = lista.stream().filter(r -> r.getJuego().equals("como_me_siento")).count();
   
        DefaultCategoryDataset ds = new DefaultCategoryDataset();
        ds.addValue(emoOK, "Correctas",   "Emociones");
        ds.addValue(emoKO, "Incorrectas", "Emociones");
        ds.addValue(empOK, "Correctas",   "Empatía");
        ds.addValue(empKO, "Incorrectas", "Empatía");

        JFreeChart chart = ChartFactory.createBarChart(
                "Resultados usuario " + idUsuario,
                "Juego", "Respuestas", ds);

        ByteArrayOutputStream chartBytes = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(chartBytes, chart, 500, 300);

        ByteArrayOutputStream pdfBytes = new ByteArrayOutputStream();
        Document doc = new Document();
        PdfWriter.getInstance(doc, pdfBytes);
        doc.open();

        doc.add(new Paragraph("Informe de progreso"));
        doc.add(new Paragraph("Fecha: " + LocalDateTime.now()));
        doc.add(new Paragraph("Entradas de 'Cómo me siento': " + cmsTot));
        doc.add(Chunk.NEWLINE);

        Image img = Image.getInstance(chartBytes.toByteArray());
        img.scaleToFit(500, 300);
        doc.add(img);

        doc.close();
        return pdfBytes.toByteArray();
    }
}