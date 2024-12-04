// service-category.js

document.addEventListener('DOMContentLoaded', () => {
    fetchServiceCategories();

    const serviceCategoryForm = document.getElementById('service-category-form');
    serviceCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const service_icon = document.getElementById('service_icon').files[0];
        const service_description = document.getElementById('service_description').value;

        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('title', title);
        formData.append('service_description', service_description);
        if (service_icon) {
            formData.append('service_icon', service_icon);
        }

        fetch('api/service_category.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                serviceCategoryForm.reset();
                fetchServiceCategories();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch and display service categories
    function fetchServiceCategories() {
        fetch('api/service_category.php?action=read')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#service-category-table tbody');
                tbody.innerHTML = '';
                data.forEach(category => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${category.category_id}</td>
                        <td>${category.title}</td>
                        <td>${category.service_icon ? `<img src="${category.service_icon}" alt="Service Icon">` : 'N/A'}</td>
                        <td>${category.service_description}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editServiceCategory(${category.category_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteServiceCategory(${category.category_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Delete service category
    window.deleteServiceCategory = function(category_id) {
        if (confirm('Are you sure you want to delete this service category?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('category_id', category_id);

            fetch('api/service_category.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchServiceCategories();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit service category functionality can be implemented similarly
});
