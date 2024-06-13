async function imprimirPDF() {
  const nombre = document.getElementById('nombre').value;
  const apellidos = document.getElementById('apellidos').value;
  const grupo = document.getElementById('grupo').value;
  const especialidad = document.getElementById('especialidad').value;
//creauna ventana emergente
  if (!esTextoValido(nombre) || !esTextoValido(apellidos) || !esTextoValido(especialidad)) {
    alert('Por favor, ingrese solo letras en los campos de nombre, apellidos y especialidad.');
    return;
  }

  const calificacionesMateria1 = [
    parseFloat(document.getElementById('calificacion1').value),
    parseFloat(document.getElementById('calificacion2').value),
    parseFloat(document.getElementById('calificacion3').value),
  ];

  const calificacionesMateria2 = [
    parseFloat(document.getElementById('calificacion4').value),
    parseFloat(document.getElementById('calificacion5').value),
    parseFloat(document.getElementById('calificacion6').value),
  ];
//crea una ventana emergente
  if (!sonCalificacionesValidas(calificacionesMateria1) || !sonCalificacionesValidas(calificacionesMateria2)) {
    alert('Por favor, asegúrese de que las calificaciones estén en el rango de 0.0 a 10.0.');
    return;
  }

  const promedioMateria1 = calificacionesMateria1.reduce((a, b) => a + b, 0) / calificacionesMateria1.length;
  const promedioMateria2 = calificacionesMateria2.reduce((a, b) => a + b, 0) / calificacionesMateria2.length;
  const promedioFinalModulo = (promedioMateria1 + promedioMateria2) / 2;

  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage();

  const { width, height } = page.getSize();
  const fontSize = 15;
  const text = `
          Nombre: ${nombre}
          Apellidos: ${apellidos}
          Grupo: ${grupo}
          Especialidad: ${especialidad}

          Materia 1:
          Calificación 1: ${calificacionesMateria1[0]}
          Calificación 2: ${calificacionesMateria1[1]}
          Calificación 3: ${calificacionesMateria1[2]}
          Promedio: ${promedioMateria1.toFixed(2)}

          Materia 2:
          Calificación 1: ${calificacionesMateria2[0]}
          Calificación 2: ${calificacionesMateria2[1]}
          Calificación 3: ${calificacionesMateria2[2]}
          Promedio: ${promedioMateria2.toFixed(2)}

          Promedio Final de Módulo: ${promedioFinalModulo.toFixed(2)}
      `;

  page.drawText(text, { x: 50, y: height - 100, fontSize });

  function esTextoValido(texto) {
    return /^[A-Za-z\sáéíóúÁÉÍÓÚñÑüÜ.,;:'"-]+$/.test(texto);
  }

  function sonCalificacionesValidas(calificaciones) {
    return calificaciones.every(calificacion => !isNaN(calificacion) && calificacion >= 0 && calificacion <= 10);
  }

  // Guardar el PDF como un blob
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Crear un objeto URL del blob y abrir una nueva ventana para imprimir
  const pdfUrl = URL.createObjectURL(blob);
  const ventanaImpresion = window.open(pdfUrl, '_blank');

  // Esperar a que la ventana de impresión se abra y luego cerrarla
  ventanaImpresion.onload = function() {
    ventanaImpresion.print();
    ventanaImpresion.onafterprint = function() {
      ventanaImpresion.close();
      URL.revokeObjectURL(pdfUrl); // Liberar recursos
    };
  };
}