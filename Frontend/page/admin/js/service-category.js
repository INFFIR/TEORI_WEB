// js/service-category.js

document.addEventListener('DOMContentLoaded', () => {
    fetchServiceCategories();

    const serviceCategoryForm = document.getElementById('service-category-form');
    const editFormContainer = document.getElementById('edit-form-container');
    const editForm = document.getElementById('edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');

    // Handle create form submission
    serviceCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const category_description = document.getElementById('category_description').value.trim();
        const category_icon = document.getElementById('category_icon').files[0];
        const category_image = document.getElementById('category_image').files[0];

        if (!title || !category_description || !category_icon) {
            alert('Title, Description, and Category Icon are required.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category_description', category_description);
        formData.append('category_icon', category_icon);
        if (category_image) {
            formData.append('category_image', category_image);
        }

        // Send data to API to create a new service category
        fetch('http://localhost:8000/api/service_category.php', {
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
        fetch('http://localhost:8000/api/service_category.php', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#service-category-table tbody');
                tbody.innerHTML = '';

                data.data.forEach(category => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${category.category_id}</td>
                        <td>${escapeHtml(category.title)}</td>
                        <td>${category.category_icon ? `<img src="${category.category_icon}" alt="Category Icon">` : 'N/A'}</td>
                        <td>${category.category_image ? `<img src="${category.category_image}" alt="Category Image">` : 'N/A'}</td>
                        <td>${escapeHtml(category.category_description)}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editServiceCategory(${category.category_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteServiceCategory(${category.category_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                alert(data.message || 'Failed to fetch service categories.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Fungsi untuk mencegah XSS dengan escaping HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Delete service category
    window.deleteServiceCategory = function(category_id) {
        if (confirm('Are you sure you want to delete this service category?')) {
            const formData = new FormData();
            formData.append('_method', 'DELETE');

            fetch(`http://localhost:8000/api/service_category.php?id=${category_id}`, {
                method: 'POST', // Using POST with method override
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

    // Edit service category
    window.editServiceCategory = function(category_id) {
        // Fetch existing data for the selected category
        fetch(`http://localhost:8000/api/service_category.php?id=${category_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.category_id) {
                // Populate the edit form with existing data
                document.getElementById('edit_category_id').value = data.data.category_id;
                document.getElementById('edit_title').value = data.data.title || '';
                document.getElementById('edit_category_description').value = data.data.category_description || '';

                // Menampilkan form edit
                editFormContainer.style.display = 'block';
            } else {
                alert(data.message || 'Service category not found.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Handle edit form submission
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const category_id = document.getElementById('edit_category_id').value;
        const title = document.getElementById('edit_title').value.trim();
        const category_description = document.getElementById('edit_category_description').value.trim();
        const category_icon = document.getElementById('edit_category_icon').files[0];
        const category_image = document.getElementById('edit_category_image').files[0];

        if (!title || !category_description) {
            alert('Title and Description are required.');
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT'); // Append method override
        formData.append('title', title);
        formData.append('category_description', category_description);
        if (category_icon) {
            formData.append('category_icon', category_icon);
        }
        if (category_image) {
            formData.append('category_image', category_image);
        }

        // Send data to API to update the service category
        fetch(`http://localhost:8000/api/service_category.php?id=${category_id}`, {
            method: 'POST', // Using POST with method override (PUT)
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                editForm.reset();
                editFormContainer.style.display = 'none';
                fetchServiceCategories();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Handle canceling the edit
    cancelEditBtn.addEventListener('click', () => {
        editForm.reset();
        editFormContainer.style.display = 'none';
    });

    // Close modal when clicking outside the form
    window.onclick = function(event) {
        if (event.target == editFormContainer) {
            editForm.reset();
            editFormContainer.style.display = "none";
        }
    }
});
