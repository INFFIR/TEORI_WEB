// step.js

document.addEventListener('DOMContentLoaded', () => {
    populateTransactions();
    fetchSteps();

    const stepForm = document.getElementById('step-form');
    stepForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const transaction_id = document.getElementById('transaction_id').value;
        const step_number = document.getElementById('step_number').value;
        const step_title = document.getElementById('step_title').value;
        const step_description = document.getElementById('step_description').value;
        const step_icon = document.getElementById('step_icon').files[0];

        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('transaction_id', transaction_id);
        formData.append('step_number', step_number);
        formData.append('step_title', step_title);
        formData.append('step_description', step_description);
        if (step_icon) {
            formData.append('step_icon', step_icon);
        }

        fetch('api/step_order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                stepForm.reset();
                fetchSteps();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Populate transactions in the select dropdown
    function populateTransactions() {
        fetch('api/transaction.php?action=read') // Ensure transaction.php exists and is properly implemented
            .then(response => response.json())
            .then(data => {
                const transactionSelect = document.getElementById('transaction_id');
                data.forEach(transaction => {
                    const option = document.createElement('option');
                    option.value = transaction.transaction_id;
                    option.textContent = `ID: ${transaction.transaction_id} - ${transaction.transaction_detail}`;
                    transactionSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Fetch and display steps
    function fetchSteps() {
        fetch('api/step_order.php?action=read')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#step-table tbody');
                tbody.innerHTML = '';
                data.forEach(step => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${step.step_id}</td>
                        <td>${step.transaction_id} - ${step.transaction_detail}</td>
                        <td>${step.step_number}</td>
                        <td>${step.step_title}</td>
                        <td>${step.step_description}</td>
                        <td>${step.step_icon ? `<img src="${step.step_icon}" alt="Step Icon">` : 'N/A'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editStep(${step.step_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteStep(${step.step_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Delete step
    window.deleteStep = function(step_id) {
        if (confirm('Are you sure you want to delete this step?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('step_id', step_id);

            fetch('api/step_order.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchSteps();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit step functionality can be implemented similarly
});
