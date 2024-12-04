// contact.js

document.addEventListener('DOMContentLoaded', () => {
    fetchContacts();

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title_contact = document.getElementById('title_contact').value;
        const image_url_contact = document.getElementById('image_url_contact').files[0];

        const formData = new FormData();
        formData.append('action', 'create');
        formData.append('title_contact', title_contact);
        if (image_url_contact) {
            formData.append('image_url_contact', image_url_contact);
        }

        fetch('api/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                contactForm.reset();
                fetchContacts();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch and display contact entries
    function fetchContacts() {
        fetch('api/contact.php?action=read')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#contact-table tbody');
                tbody.innerHTML = '';
                data.forEach(contact => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${contact.contact_id}</td>
                        <td>${contact.title_contact}</td>
                        <td>${contact.image_url_contact ? `<img src="${contact.image_url_contact}" alt="Contact Image">` : 'N/A'}</td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editContact(${contact.contact_id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteContact(${contact.contact_id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Delete contact entry
    window.deleteContact = function(contact_id) {
        if (confirm('Are you sure you want to delete this contact entry?')) {
            const formData = new FormData();
            formData.append('action', 'delete');
            formData.append('contact_id', contact_id);

            fetch('api/contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchContacts();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // Edit contact entry functionality can be implemented similarly
});
