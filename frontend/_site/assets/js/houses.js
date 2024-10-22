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
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching houses:', error));
});
