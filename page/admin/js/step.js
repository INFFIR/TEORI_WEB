// step.js

document.addEventListener('DOMContentLoaded', () => {
    fetchSteps();

    const stepForm = document.getElementById('step-form');
    stepForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(stepForm);

        fetch('http://localhost:8000/api/step_order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Create Response:', data); // Tambahkan ini untuk debugging
            alert(data.message + (data.step_number ? `\nAssigned Step Number: ${data.step_number}` : ''));
            if (data.success) {
                stepForm.reset();
                fetchSteps();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch and display steps
    function fetchSteps() {
        fetch('http://localhost:8000/api/step_order.php?action=read')
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    const tbody = document.querySelector('#step-table tbody');
                    tbody.innerHTML = '';
                    data.data.forEach(step => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${step.step_id}</td>
                            <td>${step.step_number}</td>
                            <td>${step.step_title}</td>
                            <td>${step.step_description}</td>
                            <td>${step.step_icon ? `<img src="${step.step_icon}" alt="Step Icon" width="50">` : 'N/A'}</td>
                            <td>
                                <button class="action-btn edit-btn" onclick="editStep(${step.step_id})">Edit</button>
                                <button class="action-btn delete-btn" onclick="deleteStep(${step.step_id})">Delete</button>
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

    // Delete step
    window.deleteStep = function(step_id) {
        if (confirm('Are you sure you want to delete this step?')) {
            const formData = new FormData();
            formData.append('_method', 'DELETE'); // Method Override
            formData.append('id', step_id);

            fetch(`http://localhost:8000/api/step_order.php?id=${step_id}`, {
                method: 'POST', // Gunakan POST dengan method override
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Delete Response:', data); // Tambahkan ini untuk debugging
                alert(data.message);
                if (data.success) {
                    fetchSteps();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit step
    window.editStep = function(step_id) {
        // Fetch step data
        fetch(`http://localhost:8000/api/step_order.php?id=${step_id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Edit Fetch Response:', data); // Tambahkan ini untuk debugging
            if(data.success){
                const step = data.data;
                // Populate the edit form
                openEditModal(step);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Modal functionality for Edit
    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Edit Step</h2>
            <form id="edit-step-form">
                <input type="hidden" id="edit_step_id" name="step_id">
                <div class="form-group">
                    <label for="edit_step_number">Step Number:</label>
                    <input type="number" id="edit_step_number" name="step_number" min="1">
                </div>
                <div class="form-group">
                    <label for="edit_step_title">Step Title:</label>
                    <input type="text" id="edit_step_title" name="step_title">
                </div>
                <div class="form-group">
                    <label for="edit_step_description">Step Description:</label>
                    <textarea id="edit_step_description" name="step_description" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label for="edit_step_icon">Step Icon:</label>
                    <input type="file" id="edit_step_icon" name="step_icon" accept="image/*">
                    <small>If you want to change the icon, upload a new one.</small>
                </div>
                <button type="submit" class="btn btn-primary">Update Step</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.onclick = function() {
        closeEditModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeEditModal();
        }
    }

    function openEditModal(step){
        document.getElementById('edit_step_id').value = step.step_id;
        document.getElementById('edit_step_number').value = step.step_number;
        document.getElementById('edit_step_title').value = step.step_title;
        document.getElementById('edit_step_description').value = step.step_description;
        // Note: Tidak mengisi field step_icon karena file input tidak dapat diisi secara programatik

        modal.style.display = "block";
    }

    function closeEditModal(){
        modal.style.display = "none";
        document.getElementById('edit-step-form').reset();
    }

    // Handle edit form submission
    const editStepForm = document.getElementById('edit-step-form');
    editStepForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const step_id = document.getElementById('edit_step_id').value;
        const formData = new FormData(editStepForm);
        formData.append('_method', 'PUT'); // Method Override

        fetch(`http://localhost:8000/api/step_order.php?id=${step_id}`, {
            method: 'POST', // Gunakan POST dengan method override
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update Response:', data); // Tambahkan ini untuk debugging
            alert(data.message);
            if (data.success) {
                closeEditModal();
                fetchSteps();
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
