// js/signup.js

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    document.getElementById('profile_image_error').innerText = '';
    document.getElementById('username_error').innerText = '';
    document.getElementById('password_error').innerText = '';
    document.getElementById('terms_error').innerText = '';

    const profile_image = document.getElementById('profile_image').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const terms = document.getElementById('terms').checked;

    let hasError = false;

    // Validasi sederhana
    if (profile_image !== '' && !isValidURL(profile_image)) {
        document.getElementById('profile_image_error').innerText = 'Invalid URL.';
        hasError = true;
    }

    if (username === '') {
        document.getElementById('username_error').innerText = 'Username is required.';
        hasError = true;
    }

    if (password.length < 6) {
        document.getElementById('password_error').innerText = 'Password must be at least 6 characters.';
        hasError = true;
    }

    if (!terms) {
        document.getElementById('terms_error').innerText = 'You must agree to the terms.';
        hasError = true;
    }

    if (hasError) return;

    try {
        const response = await fetch('http://localhost/TEORI_WEB/PHP/api/signup.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ profile_image, username, password, terms })
        });

        const result = await response.json();

        if (response.ok) {
            // Sukses, redirect ke halaman sign in
            alert(result.message);
            window.location.href = '../signin/signin.html';
        } else {
            // Tampilkan pesan error
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Fungsi untuk validasi URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
}
