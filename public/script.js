const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const nombreInput = document.getElementById('nombre');
const dniInput = document.getElementById('dni');
const statusElem = document.getElementById('status');

// Cargar modelos de face-api.js
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo);

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (err) {
    console.error(err);
  }
}

// ... (código existente para cargar modelos y video) ...

captureButton.addEventListener('click', async () => {
  const nombre = nombreInput.value;
  const dni = dniInput.value;

  if (!nombre || !dni) {
    statusElem.innerText = 'Por favor, completa el nombre y el DNI.';
    return;
  }
  statusElem.innerText = 'Procesando...';

  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // *** NUEVO: Obtener los datos de la imagen del canvas ***
  const photoData = canvas.toDataURL('image/png');

  const detection = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

  if (!detection) {
    statusElem.innerText = 'No se detectó ningún rostro. Inténtalo de nuevo.';
    return;
  }

  const descriptor = Array.from(detection.descriptor);

  try {
    const response = await fetch('http://localhost:3000/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify({ nombre, dni, descriptor, photoData }),
    });
    
    if (response.ok) {
        statusElem.innerText = `¡Estudiante ${nombre} registrado con éxito!`;
        nombreInput.value = '';
        dniInput.value = '';
    } else {
        const errorData = await response.json();
        statusElem.innerText = `Error: ${errorData.error}`;
    }
  } catch (error) {
    statusElem.innerText = 'Error de conexión con el servidor.';
    console.error('Error al registrar:', error);
  }
});