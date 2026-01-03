import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Bloque {
  tipo: string;
  contenido: string;
}

/**
 * Exporta los bloques a PDF
 */
export function exportBloquesToPDF(bloques: Bloque[]) {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.text('Bloques de Información', 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-AR')}`, 14, 28);
  doc.text(`Total de bloques: ${bloques.length}`, 14, 34);
  
  // Preparar datos para la tabla
  const tableData = bloques.map((bloque, index) => [
    index + 1,
    bloque.tipo,
    bloque.contenido.length > 50 ? bloque.contenido.substring(0, 50) + '...' : bloque.contenido,
  ]);

  // Crear tabla
  autoTable(doc, {
    startY: 40,
    head: [['#', 'Tipo', 'Contenido']],
    body: tableData,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [26, 26, 26], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 40 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 50 },
      2: { cellWidth: 120 },
    },
  } as UserOptions);

  // Detalles completos de cada bloque
  const lastAutoTable = (doc as any).lastAutoTable;
  let yPosition = lastAutoTable ? lastAutoTable.finalY + 15 : 50;
  
  bloques.forEach((bloque, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bloque ${index + 1}: ${bloque.tipo}`, 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Dividir contenido largo en múltiples líneas
    const maxWidth = 180;
    const splitText = doc.splitTextToSize(bloque.contenido, maxWidth);
    doc.text(splitText, 14, yPosition);
    yPosition += splitText.length * 5 + 5;
  });

  // Guardar PDF
  doc.save(`bloques-informacion-${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Exporta los bloques a Excel
 */
export function exportBloquesToExcel(bloques: Bloque[]) {
  // Crear workbook
  const wb = XLSX.utils.book_new();

  // Hoja 1: Resumen
  const resumenData = [
    ['#', 'Tipo', 'Contenido'],
    ...bloques.map((bloque, index) => [
      index + 1,
      bloque.tipo,
      bloque.contenido,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(resumenData);
  
  // Ajustar ancho de columnas
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 20 }, // Tipo
    { wch: 80 }, // Contenido
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Bloques');

  // Guardar archivo
  XLSX.writeFile(wb, `bloques-informacion-${new Date().toISOString().split('T')[0]}.xlsx`);
}

