// service.js

document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    fetchServices();

    const serviceForm = document.getElementById('service-form');
    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const category_id = document.getElementById('category_id').value;
        const offered_name = document.getElementById('offered_name').value;
        const offered_price = document.getElementById('offered_price').value;
        const offered_description = document.getElementById('offered_description').value;
        const offered_image_url = document.getElementById('offered_image_url').files[0];

        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('category_id', category_id);
        formData.append('offered_name', offered_name);
        formData.append('offered_price', offered_price);
        formData.append('offered_description', offered_description);
        if (offered_image_url) {
            formData.append('offered_image_url', offered_image_url);
        }

        fetch('api/service_offered.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                serviceForm.reset();
                fetchServices();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Populate service categories in the select dropdown
    function populateCategories() {
        fetch('api/service_category.php?action=read')
            .then(response => response.json())
            .then(data => {
                const categorySelect = document.getElementById('category_id');
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.category_id;
                    option.textContent = category.title;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Fetch and display services
    function fetchServices() {
        fetch('api/service_offered.php?action=read')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#service-table tbody');
                tbody.innerHTML = '';
                data.forEach(service => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${service.offered_id}</td>
                        <td>${service.title}</td>
                        <td>${service.offered_name}</td>
                        <td>$${service.offered_price}</td>
                        <td>${service.offered_description}</td>
                        <td>${service.offered_image_url ? `<img src="${service.offered_image_url}" alt="Service Image" width="50">` : 'N/A'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editService(${service.offered_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteService(${service.offered_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Delete service
    window.deleteService = function(offered_id) {
        if (confirm('Are you sure you want to delete this service?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('offered_id', offered_id);

            fetch('api/service_offered.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchServices();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit service functionality can be implemented similarly
});
