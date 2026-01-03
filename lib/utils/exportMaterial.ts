import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MaterialItem } from '@/app/api/material/route';

/**
 * Exporta los materiales a PDF
 */
export function exportToPDF(materiales: MaterialItem[]) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Material Recibido', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-AR')}`, 14, 28);
  doc.text(`Total de registros: ${materiales.length}`, 14, 34);
  
  // Preparar datos para la tabla
  const tableData = materiales.map((material, index) => [
    index + 1,
    `${material.nombre_completo} ${material.apellido}`,
    material.email,
    material.whatsapp || '-',
    material.edad.toString(),
    material.nacionalidad,
    material.created_at ? new Date(material.created_at).toLocaleDateString('es-AR') : '-',
  ]);

  // Crear tabla
  autoTable(doc, {
    startY: 40,
    head: [['#', 'Nombre Completo', 'Email', 'WhatsApp', 'Edad', 'Nacionalidad', 'Fecha Recepción']],
    body: tableData,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [26, 26, 26], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 40 },
  });

  // Agregar página para detalles si hay muchos registros
  let yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  if (yPosition > 250 && materiales.length > 0) {
    doc.addPage();
    yPosition = 20;
  }

  // Detalles de cada material (en páginas adicionales si es necesario)
  materiales.forEach((material, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Material ${index + 1}: ${material.nombre_completo} ${material.apellido}`, 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const detalles = [
      ['Email:', material.email],
      ['WhatsApp:', material.whatsapp || '-'],
      ['Edad:', material.edad.toString()],
      ['Fecha de Nacimiento:', material.fecha_nacimiento || '-'],
      ['Nombre Artístico:', material.nombre_artistico || '-'],
      ['Nacionalidad:', material.nacionalidad],
      ['Residencia:', material.residencia_actual || '-'],
      ['Altura:', material.altura || '-'],
      ['Peso:', material.peso || '-'],
      ['Color de Pelo:', material.color_pelo || '-'],
      ['Color de Ojos:', material.color_ojos || '-'],
      ['Idiomas:', material.idiomas || '-'],
      ['Canta:', material.canta || '-'],
      ['Baila:', material.baila || '-'],
      ['Reel URL:', material.reel_url || '-'],
      ['CV PDF:', material.cv_pdf_url ? 'Sí' : 'No'],
      ['Imágenes:', material.imagenes_urls && material.imagenes_urls.length > 0 ? `${material.imagenes_urls.length} imagen(es)` : 'No'],
      ['Fecha de Recepción:', material.created_at ? new Date(material.created_at).toLocaleString('es-AR') : '-'],
    ];

    detalles.forEach(([label, value]) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(label, 14, yPosition);
      doc.setFont('helvetica', 'normal');
      const textWidth = doc.getTextWidth(value);
      if (textWidth > 170) {
        const splitText = doc.splitTextToSize(value, 170);
        doc.text(splitText, 60, yPosition);
        yPosition += splitText.length * 5;
      } else {
        doc.text(value, 60, yPosition);
        yPosition += 7;
      }
    });

    yPosition += 5;
  });

  // Guardar PDF
  doc.save(`material-recibido-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Exporta los materiales a Excel
 */
export function exportToExcel(materiales: MaterialItem[]) {
  // Crear workbook
  const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen
  const resumenData = [
    ['#', 'Nombre Completo', 'Apellido', 'Email', 'WhatsApp', 'Edad', 'Fecha Nacimiento', 'Nombre Artístico', 'Nacionalidad', 'Residencia', 'Fecha Recepción'],
    ...materiales.map((material, index) => [
      index + 1,
      material.nombre_completo,
      material.apellido,
      material.email,
      material.whatsapp || '',
      material.edad,
      material.fecha_nacimiento || '',
      material.nombre_artistico || '',
      material.nacionalidad,
      material.residencia_actual || '',
      material.created_at ? new Date(material.created_at).toLocaleString('es-AR') : '',
    ]),
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(resumenData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Resumen');

  // Hoja 2: Características Físicas
  const fisicasData = [
    ['#', 'Nombre', 'Altura', 'Peso', 'Contextura', 'Color Pelo', 'Color Ojos', 'Talle Remera', 'Pantalón', 'Calzado', 'Tatuajes', 'Cicatrices'],
    ...materiales.map((material, index) => [
      index + 1,
      `${material.nombre_completo} ${material.apellido}`,
      material.altura || '',
      material.peso || '',
      material.contextura || '',
      material.color_pelo || '',
      material.color_ojos || '',
      material.talle_remera || '',
      material.pantalon || '',
      material.calzado || '',
      material.tatuajes || '',
      material.cicatrices || '',
    ]),
  ];

  const ws2 = XLSX.utils.aoa_to_sheet(fisicasData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Características Físicas');

  // Hoja 3: Habilidades y Contacto
  const habilidadesData = [
    ['#', 'Nombre', 'Instrumentos', 'Canta', 'Idiomas', 'Acento Neutro', 'Deportes', 'Baila', 'Otras Habilidades', 'Instagram', 'TikTok', 'Reel URL', 'CV PDF', 'Imágenes'],
    ...materiales.map((material, index) => [
      index + 1,
      `${material.nombre_completo} ${material.apellido}`,
      material.instrumentos || '',
      material.canta || '',
      material.idiomas || '',
      material.acento_neutro || '',
      material.deportes || '',
      material.baila || '',
      material.otras_habilidades || '',
      material.instagram || '',
      material.tik_tok || '',
      material.reel_url || '',
      material.cv_pdf_url ? 'Sí' : 'No',
      material.imagenes_urls && material.imagenes_urls.length > 0 ? `${material.imagenes_urls.length} imagen(es)` : 'No',
    ]),
  ];

  const ws3 = XLSX.utils.aoa_to_sheet(habilidadesData);
  XLSX.utils.book_append_sheet(wb, ws3, 'Habilidades y Contacto');

  // Hoja 4: Información Adicional
  const adicionalData = [
    ['#', 'Nombre', 'Alergias', 'Alimentación', 'Alimentación Otros', 'Hijos', 'Obra Social', 'Contacto Emergencia', 'DNI', 'Pasaporte', 'Licencia Conducir'],
    ...materiales.map((material, index) => [
      index + 1,
      `${material.nombre_completo} ${material.apellido}`,
      material.alergias || '',
      material.alimentacion || '',
      material.alimentacion_otros || '',
      material.hijos || '',
      material.obra_social || '',
      material.contacto_emergencia || '',
      material.dni || '',
      material.pasaporte || '',
      material.licencia_conducir || '',
    ]),
  ];

  const ws4 = XLSX.utils.aoa_to_sheet(adicionalData);
  XLSX.utils.book_append_sheet(wb, ws4, 'Información Adicional');

  // Ajustar ancho de columnas (aproximado)
  [ws1, ws2, ws3, ws4].forEach((ws) => {
    const colWidths = [];
    const ref = ws['!ref'];
    if (ref) {
      const range = XLSX.utils.decode_range(ref);
      for (let i = 0; i <= range.e.c; i++) {
        colWidths.push({ wch: 15 });
      }
    }
    ws['!cols'] = colWidths;
  });

  // Guardar archivo
  XLSX.writeFile(wb, `material-recibido-${new Date().toISOString().split('T')[0]}.xlsx`);
}

