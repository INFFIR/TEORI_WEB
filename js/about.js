/**
 * Fungsi untuk memuat komponen HTML secara dinamis ke dalam elemen yang ditentukan.
 * @param {string} selector - Selektor CSS dari elemen target.
 * @param {string} file - Jalur relatif ke file HTML yang akan dimuat.
 */
async function loadComponent(selector, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Gagal memuat ${file}: ${response.statusText}`);
        const content = await response.text();
        document.querySelector(selector).insertAdjacentHTML('beforeend', content);
    } catch (error) {
        console.error(`Error loading component ${file}:`, error);
    }
}

/**
 * Fungsi untuk menambahkan smooth scrolling ke semua link internal.
 */
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
}

/**
 * Fungsi untuk menggulir ke elemen berdasarkan hash di URL.
 */
function scrollToHash() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 100);
        }
    }
}

/**
 * Fungsi untuk menangani perubahan hash di URL.
 */
function handleHashChange() {
    window.addEventListener('hashchange', () => {
        scrollToHash();
    });
}

/**
 * Fungsi untuk menutup menu navbar di perangkat mobile setelah link diklik.
 */
function closeMobileMenu() {
    const navbarToggle = document.getElementById('navbar-toggle');
    if (navbarToggle && navbarToggle.checked) {
        navbarToggle.checked = false;
    }
}

/**
 * Fungsi utama yang dijalankan saat DOM telah dimuat.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const pageId = document.body.id;

    // Daftar komponen yang akan dimuat
    const components = [
        './components/navbar.html',
        './components/about/showcase.html',
        './components/about/about.html',
        './components/about/services.html',
        './components/about/pricing.html',
        './components/order.html',
        './components/about/testimonials.html',
        './components/about/contact.html',
        './components/footer.html',
    ];

    // Memuat semua komponen secara berurutan
    for (const file of components) {
        await loadComponent('#wrapper', file);
    }

    // Tambahkan smooth scrolling setelah semua komponen dimuat
    addSmoothScrolling();

    // Tambahkan event listener untuk menutup menu mobile setelah link diklik
    const navbarLinks = document.querySelectorAll('.menu-items a');
    navbarLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Gulir ke hash saat halaman dimuat
    scrollToHash();

    // Menangani perubahan hash di URL
    handleHashChange();
});
