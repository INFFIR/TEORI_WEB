// js/script.js

// Fungsi untuk memuat komponen secara dinamis
async function loadComponent(selector, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Gagal memuat ${file}`);
        const content = await response.text();
        document.querySelector(selector).insertAdjacentHTML('beforeend', content);
    } catch (error) {
        console.error(error);
    }
}

// Fungsi untuk memastikan Font Awesome CSS telah dimuat
function isFontAwesomeLoaded() {
    return Array.from(document.styleSheets).some(sheet => {
        return sheet.href && sheet.href.includes('font-awesome');
    });
}

// Memuat semua komponen saat DOM telah siap
document.addEventListener("DOMContentLoaded", async () => {
    // Memeriksa apakah Font Awesome telah dimuat
    if (!isFontAwesomeLoaded()) {
        console.error('Font Awesome CSS tidak terdeteksi. Pastikan link Font Awesome ada di <head>.');
    }

    const components = [
        "./components/navbar.html",
        "./components/showcase.html",
        "./components/about.html",
        "./components/services.html",
        "./components/pricing.html",
        "./components/order.html",
        "./components/testimonials.html",
        "./components/contact.html",
        "./components/footer.html"
    ];

    for (const file of components) {
        await loadComponent("#wrapper", file);
    }

    // Menambahkan event listener untuk smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Menambahkan event listener untuk menutup menu ketika tautan diklik (mobile)
    document.addEventListener('click', function(event) {
        const isMenuLink = event.target.closest('.menu-items a');
        const navbarToggle = document.getElementById('navbar-toggle');

        if (isMenuLink && navbarToggle.checked) {
            navbarToggle.checked = false;
        }
    });
});
