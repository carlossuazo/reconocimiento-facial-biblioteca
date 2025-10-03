document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#studentsTable tbody');
    const modal = document.getElementById('photoModal');
    const modalName = document.getElementById('modalName');
    const modalDni = document.getElementById('modalDni');
    const modalPhoto = document.getElementById('modalPhoto');
    const closeBtn = document.querySelector('.close');

    async function loadStudents() {
        try {
            const response = await fetch('http://localhost:3000/estudiantes');
            const estudiantes = await response.json();

            tableBody.innerHTML = ''; // Limpiar la tabla

            estudiantes.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.nombre}</td>
                    <td>${student.dni}</td>
                    <td><button class="view-btn" data-id="${student.id}">Ver Foto</button></td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
        }
    }

    tableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('view-btn')) {
            const studentId = event.target.dataset.id;
            const response = await fetch('http://localhost:3000/estudiantes');
            const estudiantes = await response.json();
            const student = estudiantes.find(s => s.id == studentId);

            if (student) {
                modalName.textContent = student.name;
                modalDni.textContent = `DNI: ${student.dni}`;
                // La URL de la foto apunta al servidor
                modalPhoto.src = `http://localhost:3000/${student.ruta_foto}`;
                modal.style.display = 'block';
            }
        }
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    loadStudents();
});