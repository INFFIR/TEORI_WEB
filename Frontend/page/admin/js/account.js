// account.js

document.addEventListener('DOMContentLoaded', () => {
    fetchAccounts();

    const accountForm = document.getElementById('account-form');
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username_user = document.getElementById('username_user').value;
        const password_user = document.getElementById('password_user').value;
        const user_role = document.getElementById('user_role').value;

        // Hash the password before sending (basic example)
        const hashedPassword = btoa(password_user); // Note: Use a better hashing mechanism in production

        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('username_user', username_user);
        formData.append('password_user', hashedPassword);
        formData.append('user_role', user_role);

        fetch('api/account.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                accountForm.reset();
                fetchAccounts();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch and display accounts
    function fetchAccounts() {
        fetch('api/account.php?action=read')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#accounts-table tbody');
                tbody.innerHTML = '';
                data.forEach(account => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${account.user_id}</td>
                        <td>${account.username_user}</td>
                        <td>${account.user_role}</td>
                        <td>${account.user_image_profile ? `<img src="${account.user_image_profile}" alt="Profile" width="50">` : 'N/A'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editAccount(${account.user_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteAccount(${account.user_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Delete account
    window.deleteAccount = function(user_id) {
        if (confirm('Are you sure you want to delete this account?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('user_id', user_id);

            fetch('api/account.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchAccounts();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit account functionality can be implemented similarly
});
