const video = document.getElementById('video');
const studentInfoDiv = document.getElementById('studentInfo');
const resetButton = document.getElementById('resetButton');
let labeledFaceDescriptors;
let faceMatcher;
let isScanning = true; // Variable de estado para controlar el escaneo
let recognitionInterval; // Para poder detener el intervalo

// Cargar modelos y datos de face api
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    loadRegisteredStudents()
]).then(startVideo);

async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    } catch (err) {
        console.error(err);
    }
}

async function loadRegisteredStudents() {
    const response = await fetch('http://localhost:3000/estudiantes');
    const estudiantes = await response.json();
    labeledFaceDescriptors = estudiantes.map(estudiante => {
        const descriptor = new Float32Array(estudiante.photo_descriptor);
        return new faceapi.LabeledFaceDescriptors(`${estudiante.id}:${estudiante.nombre}:${estudiante.dni}`, [descriptor]);
    });
}

function startRecognition() {
    isScanning = true;
    studentInfoDiv.innerHTML = "Escaneando rostro...";
    resetButton.style.display = 'none';

    recognitionInterval = setInterval(async () => {
        if (!isScanning) return; // Si no estamos escaneando, no hacer nada

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        
        if (detections.length > 0 && isScanning) {
            if (!faceMatcher) {
                faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
            }
            
            const bestMatch = faceMatcher.findBestMatch(detections[0].descriptor);
            
            if (bestMatch.label !== 'unknown') {
                isScanning = false; // Detener el escaneo
                
                const [id, nombre, dni] = bestMatch.label.split(':');
                studentInfoDiv.innerHTML = `<h2>Acceso Concedido</h2>
                                            <p><strong>Nombre:</strong> ${nombre}</p>
                                            <p><strong>DNI:</strong> ${dni}</p>`;
                
                resetButton.style.display = 'block'; // Mostrar el botón de reset
                logAccess(id);
                clearInterval(recognitionInterval);
            }
        }
    }, 1000);
}

resetButton.addEventListener('click', () => {
    startRecognition(); // Reiniciar el proceso
});

video.addEventListener('play', () => {
    startRecognition();
});

async function logAccess(estudianteId) {
    await fetch('http://localhost:3000/logs-acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estudiante_id: estudianteId })
    });
    console.log(`Acceso registrado para el estudiante ID: ${estudianteId}`);
}