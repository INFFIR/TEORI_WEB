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

// Memuat semua komponen saat DOM telah siap
document.addEventListener("DOMContentLoaded", async () => {
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

    // Menambahkan event listener untuk menutup menu ketika tautan diklik (mobile)
    document.addEventListener('click', function(event) {
        const isMenuLink = event.target.closest('.menu-items a');
        const navbarToggle = document.getElementById('navbar-toggle');

        if (isMenuLink && navbarToggle.checked) {
            navbarToggle.checked = false;
        }
    });
});
