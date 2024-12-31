// js/signin.js

document.getElementById('signinForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous errors
    document.getElementById('username_error').innerText = '';
    document.getElementById('password_error').innerText = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    let hasError = false;

    // Validasi sederhana
    if (username === '') {
        document.getElementById('username_error').innerText = 'Username is required.';
        hasError = true;
    }

    if (password === '') {
        document.getElementById('password_error').innerText = 'Password is required.';
        hasError = true;
    }

    if (hasError) return;

    try {
        const response = await fetch('http://localhost:8000/api/signin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Sukses, mungkin menyimpan token atau redirect
            alert(result.message);
            window.location.href = '../../index.html'; // Ganti dengan halaman tujuan
        } else {
            // Tampilkan pesan error
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
