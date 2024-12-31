// js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    fetchContact();

    const editContactBtn = document.getElementById('edit-contact-btn');
    const editModal = document.getElementById('edit-modal');
    const closeBtn = editModal.querySelector('.close-btn');
    const editContactForm = document.getElementById('edit-contact-form');

    // Open the edit modal
    editContactBtn.addEventListener('click', () => {
        // Populate the form with existing data
        const title = document.getElementById('display-title_contact').innerText;
        document.getElementById('edit_title_contact').value = title;

        // Optionally, display current images/logos or provide previews

        editModal.style.display = 'block';
    });

    // Close the edit modal
    closeBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    // Handle edit form submission
    editContactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title_contact = document.getElementById('edit_title_contact').value;
        const image_url_contact = document.getElementById('edit_image_url_contact').files[0];
        const logo_contact = document.getElementById('edit_logo_contact').files[0];

        const formData = new FormData();
        formData.append('action', 'update');
        formData.append('title_contact', title_contact);
        if (image_url_contact) {
            formData.append('image_url_contact', image_url_contact);
        }
        if (logo_contact) {
            formData.append('logo_contact', logo_contact);
        }

        fetch('http://localhost/TEORI_WEB/PHP/api/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                editModal.style.display = 'none';
                fetchContact();
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Fetch and display contact entry
    function fetchContact() {
        fetch('http://localhost/TEORI_WEB/PHP/api/contact.php?action=read')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Contact Data:', data); // Debug Log
                if (data.length > 0) {
                    const contact = data[0]; // Assuming only one contact entry
                    document.getElementById('display-title_contact').innerText = contact.title_contact;
                    
                    if (contact.image_url_contact) {
                        document.getElementById('display-image_url_contact').src = contact.image_url_contact;
                        document.getElementById('display-image_url_contact').alt = 'Contact Image';
                    } else {
                        document.getElementById('display-image_url_contact').src = '';
                        document.getElementById('display-image_url_contact').alt = 'No Image';
                    }

                    if (contact.logo) {
                        console.log('Logo URL:', contact.logo); // Debug Log
                        document.getElementById('display-logo_contact').src = contact.logo;
                        document.getElementById('display-logo_contact').alt = 'Logo';
                    } else {
                        document.getElementById('display-logo_contact').src = '';
                        document.getElementById('display-logo_contact').alt = 'No Logo';
                    }
                } else {
                    document.getElementById('display-title_contact').innerText = 'No Contact Information Available';
                    document.getElementById('display-image_url_contact').src = '';
                    document.getElementById('display-image_url_contact').alt = 'No Image';
                    document.getElementById('display-logo_contact').src = '';
                    document.getElementById('display-logo_contact').alt = 'No Logo';
                }
            })
            .catch(error => console.error('Error:', error));
    }
});
