document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');
    fetch('http://localhost:3000/api/house/by-user/' + userId)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('houses-list');
            data.forEach(house => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${house.id}</td>
                    <td>${house.address}</td>
                    <td>${house.name}</td>
                    <td>
                    <a href="house.html?id=${house.id}" class="btn btn-primary">Agendar Cita</a>
                    <button class="btn-generate-appointment btn btn-success" data-house="${house.id}">Visitante Generar Cita</button>

                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching houses:', error));

        const btnGenerateAppointment = document.getElementsByClassName('btn-generate-appointment');
        for (let i = 0; i < btnGenerateAppointment.length; i++) {
            btnGenerateAppointment[i].addEventListener('click', function() {
                console.log('Generating appointment');
                const houseId = this.parentElement.dataset.house;
                fetch('http://localhost:3000/api/appointment/dummy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        houseId,
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Cita generada correctamente');
                    console.log(data);
                })
                .catch(error => console.error('Error generating appointment:', error));
            });
        }
});
