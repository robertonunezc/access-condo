async function fetchCondos() {
    try {
        const response = await fetch('http://localhost:3000/condo');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log(data);
        const condosList = document.querySelector('#condo-list');
        data.forEach(condo => {
            condosList.innerHTML += `
                <tr>
                    <td>${condo.name}</td>
                    <td>${condo.address}</td>
                    <td>${condo.manager_id}</td>
                    <td>
                        <a href="edit_condo.html?id=${condo.id}" class="btn btn-primary">Edit</a>
                        <button class="btn btn-danger" onclick="deleteCondo(${condo.id})">Delete</button>
                    </td>
                    </tr>
            `;
        }
        );
        // You can add further processing of the data here
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Call the function to fetch data
fetchCondos();