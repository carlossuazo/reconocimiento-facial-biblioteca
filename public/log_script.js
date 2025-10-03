document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#logsTable tbody');

    try {
        const response = await fetch('http://localhost:3000/logs');
        const logs = await response.json();

        logs.forEach(log => {
            const row = document.createElement('tr');
            const accessTime = new Date(log.timestamp).toLocaleString('es-ES');
            
            row.innerHTML = `
                <td>${log.nombre}</td>
                <td>${log.dni}</td>
                <td>${accessTime}</td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error al cargar los registros:', error);
        tableBody.innerHTML = '<tr><td colspan="3">No se pudieron cargar los registros.</td></tr>';
    }
});