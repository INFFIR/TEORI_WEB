// service.js

document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    fetchServices();

    const serviceForm = document.getElementById('service-form');
    serviceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(serviceForm);

        fetch('http://localhost:8000/api/service_offered.php', {
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

    // Populate service categories in all select elements
    function populateCategories() {
        fetch('http://localhost:8000/api/service_category.php')
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    // Pilih semua select dengan name "category_id"
                    const categorySelects = document.querySelectorAll('select[name="category_id"]');
                    categorySelects.forEach(select => {
                        // Reset opsi
                        select.innerHTML = '<option value="">Select Category</option>';
                        data.data.forEach(category => {
                            const option = document.createElement('option');
                            option.value = category.category_id;
                            option.textContent = category.title;
                            select.appendChild(option);
                        });
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

// Fetch and display services
function fetchServices() {
    fetch('http://localhost:8000/api/service_offered.php', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                const tbody = document.querySelector('#service-table tbody');
                tbody.innerHTML = '';
                
                // Urutkan data berdasarkan offered_id ascending
                data.data.sort((a, b) => a.offered_id - b.offered_id);
                
                data.data.forEach(service => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${service.offered_id}</td>
                        <td>${service.category_title}</td>
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
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}


    // Delete service
    window.deleteService = function(offered_id) {
        if (confirm('Are you sure you want to delete this service?')) {
            fetch(`http://localhost:8000/api/service_offered.php?id=${offered_id}`, {
                method: 'DELETE'
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

    // Edit service
    window.editService = function(offered_id) {
        // Fetch service data
        fetch(`http://localhost:8000/api/service_offered.php?id=${offered_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if(data.success){
                const service = data.data;
                // Populate the edit form
                document.getElementById('edit_offered_id').value = service.offered_id;
                document.getElementById('edit_category_id').value = service.category_id;
                document.getElementById('edit_offered_name').value = service.offered_name;
                document.getElementById('edit_offered_price').value = service.offered_price;
                document.getElementById('edit_offered_description').value = service.offered_description;
                // Open the modal
                openModal();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Modal functionality
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    function openModal(){
        modal.style.display = "block";
    }

    function closeModal(){
        modal.style.display = "none";
        document.getElementById('edit-service-form').reset();
    }

    // Handle edit form submission
    const editServiceForm = document.getElementById('edit-service-form');
    editServiceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const offered_id = document.getElementById('edit_offered_id').value;
        const formData = new FormData(editServiceForm);
        formData.append('_method', 'PUT'); // Tambahkan field _method=PUT untuk method override

        fetch(`http://localhost:8000/api/service_offered.php?id=${offered_id}`, {
            method: 'POST', // Gunakan POST dan method override
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                closeModal();
                fetchServices();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
