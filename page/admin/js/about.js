// js/about.js

document.addEventListener('DOMContentLoaded', () => {
    fetchAboutSections();

    const aboutForm = document.getElementById('about-form');
    const editFormContainer = document.getElementById('edit-form-container');

    // Handle create form submission
    aboutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const about_title = document.getElementById('about_title').value.trim(); // Tambahan
        const description_about = document.getElementById('description_about').value.trim();
        const imageInput = document.getElementById('image_url_about');
        const image_url_about = imageInput.files[0];

        if (!description_about) {
            alert('Description is required.');
            return;
        }

        const formData = new FormData();
        formData.append('about_title', about_title); // Tambahan
        formData.append('description_about', description_about);
        if (image_url_about) {
            formData.append('image_url_about', image_url_about);
        }

        // Kirim data form ke API untuk membuat entry baru
        fetch('http://localhost:8000/api/about.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                aboutForm.reset();
                fetchAboutSections();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch dan tampilkan about sections
    function fetchAboutSections() {
        fetch('http://localhost:8000/api/about.php', {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#about-table tbody');
            tbody.innerHTML = '';

            if (data.success && Array.isArray(data.data)) {
                data.data.forEach(about => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${about.about_id}</td>
                        <td>${about.about_title ? escapeHtml(about.about_title) : 'N/A'}</td> <!-- Kolom Title -->
                        <td>${escapeHtml(about.description_about)}</td> <!-- Kolom Description -->
                        <td>${about.image_url_about ? `<img src="${about.image_url_about}" alt="About Image" width="50">` : 'N/A'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editAbout(${about.about_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteAbout(${about.about_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5">No about sections found.</td></tr>';
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

    // Delete about section
    window.deleteAbout = function(about_id) {
        if (confirm('Are you sure you want to delete this about section?')) {
            fetch(`http://localhost:8000/api/about.php?id=${about_id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchAboutSections();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit about section
    window.editAbout = function(about_id) {
        // Fetch existing data untuk entry yang dipilih
        fetch(`http://localhost:8000/api/about.php?id=${about_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.about_id) {
                // Populate form edit dengan data yang ada
                document.getElementById('edit_about_id').value = data.data.about_id;
                document.getElementById('edit_about_title').value = data.data.about_title || ''; // Tambahan
                document.getElementById('edit_description_about').value = data.data.description_about;
                // Menampilkan form edit
                editFormContainer.style.display = 'block';
            } else {
                alert('About entry not found.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Handle edit form submission
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const about_id = document.getElementById('edit_about_id').value;
        const about_title = document.getElementById('edit_about_title').value.trim(); // Tambahan
        const description_about = document.getElementById('edit_description_about').value.trim();
        const imageInput = document.getElementById('edit_image_url_about');
        const image_url_about = imageInput.files[0];

        if (!description_about) {
            alert('Description is required.');
            return;
        }

        const formData = new FormData();
        formData.append('about_title', about_title); // Tambahan
        formData.append('description_about', description_about);
        if (image_url_about) {
            formData.append('image_url_about', image_url_about);
        }

        // Kirim data form ke API untuk mengupdate entry
        fetch(`http://localhost:8000/api/about.php?id=${about_id}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                editForm.reset();
                editFormContainer.style.display = 'none';
                fetchAboutSections();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Handle canceling the edit
    const cancelEditBtn = document.getElementById('cancel-edit');
    cancelEditBtn.addEventListener('click', () => {
        editForm.reset();
        editFormContainer.style.display = 'none';
    });
});
