// Fungsi untuk memuat file HTML eksternal ke dalam elemen dengan ID tertentu dan menjalankan skrip di dalamnya
function loadExternalHTML(filePath, targetSelector) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading file: ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            const target = document.querySelector(targetSelector);
            target.innerHTML = data;

            // Cari semua tag <script> dalam data yang dimuat
            const scripts = target.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');

                // Jika skrip memiliki atribut src, salin atribut tersebut
                if (script.src) {
                    newScript.src = script.src;
                    newScript.async = false; // Pastikan skrip dijalankan dalam urutan
                } else {
                    // Jika skrip inline, salin kontennya
                    newScript.textContent = script.textContent;
                }

                // Tambahkan skrip baru ke DOM untuk mengeksekusinya
                document.body.appendChild(newScript);

                // Opsional: Hapus skrip setelah dieksekusi untuk kebersihan DOM
                script.remove();
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector(targetSelector).innerHTML = `<p>Failed to load content from ${filePath}</p>`;
        });
}

// Fungsi untuk menambahkan smooth scroll pada semua anchor link
function enableSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Memuat komponen HTML ke dalam elemen target setelah DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadExternalHTML('components/navbar.html', '#navbar');
    loadExternalHTML('components/order.html', '#order');
    loadExternalHTML('components/footer.html', '#footer');

    // Tambahkan smooth scroll setelah semua elemen dimuat
    setTimeout(enableSmoothScroll, 500); // Berikan waktu agar elemen terload
});
