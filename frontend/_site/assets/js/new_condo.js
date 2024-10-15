    const form = document.getElementById('newCondoForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log(formData)
        console.log(data);

        fetch('http://localhost:3000/condo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = '/condos/';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('There was an error creating the condo');
        });
    });