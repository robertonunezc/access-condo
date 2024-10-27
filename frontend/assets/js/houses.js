document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId");
  fetch("http://localhost:3000/api/house/by-user/" + userId)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("houses-list");
      data.forEach((house) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${house.id}</td>
                    <td>${house.address}</td>
                    <td>${house.name}</td>
                    <td>
                    <a href="/new_appointment/index.html?house_id=${house.id}" class="btn btn-primary">Agendar Cita</a>
                    <button class="btn-generate-appointment btn btn-success" data-house="${house.id}"  data-toggle="modal" data-target="#exampleModal">Visitante Generar Cita</button>
                    <a href="/house_appointments/index.html?house_id=${house.id}" class="btn btn-info">Ver Citas</a>
                    </td>
                `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching houses:", error));

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-generate-appointment")) {
      const houseId = event.target.getAttribute("data-house");
      fetch("http://localhost:3000/api/appointment/dummy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ houseId, userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) =>
          console.error("Error generating appointment:", error)
        );
    }
  });
});
