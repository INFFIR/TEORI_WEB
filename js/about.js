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



// --- Start of Dynamic About Section Code ---

/**
 * Fungsi untuk mengambil data About dari API dan menampilkannya di halaman.
 */
async function loadDynamicAboutSections() {
    try {
        const response = await fetch('http://localhost:8000/api/about.php', {
            method: 'GET'
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
            const aboutSections = document.getElementById('about-sections');
            aboutSections.innerHTML = ''; // Kosongkan konten sebelumnya

            data.data.forEach((about, index) => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('about-wrapper', 'container');

                // Alternating layout: index genap - teks pertama, gambar kedua; index ganjil - gambar pertama, teks kedua
                if (index % 2 === 0) {
                    wrapper.innerHTML = `
                        <div class="about-text">
                            <h3 class="about-head">${escapeHtml(about.about_title || '')}</h3>
                            <p>${escapeHtml(about.description_about)}</p>
                        </div>
                        <div class="about-img ${about.image_url_about ? '' : 'no-image'}">
                            ${about.image_url_about ? `<img src="${about.image_url_about}" alt="${escapeHtml(about.about_title || '')}">` : ''}
                        </div>
                    `;
                } else {
                    wrapper.innerHTML = `
                        <div class="about-img2 ${about.image_url_about ? '' : 'no-image'}">
                            ${about.image_url_about ? `<img src="${about.image_url_about}" alt="${escapeHtml(about.about_title || '')}">` : ''}
                        </div>
                        <div class="about-text2">
                            <h3 class="about-head">${escapeHtml(about.about_title || '')}</h3>
                            <p>${escapeHtml(about.description_about)}</p>
                        </div>
                    `;
                }

                aboutSections.appendChild(wrapper);
            });
        } else {
            console.warn('No about sections found or failed to fetch data.');
            const aboutSections = document.getElementById('about-sections');
            aboutSections.innerHTML = '<p>No about sections available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error fetching about sections:', error);
        const aboutSections = document.getElementById('about-sections');
        aboutSections.innerHTML = '<p>Error loading about sections. Please try again later.</p>';
    }
}

/**
 * Fungsi untuk mencegah XSS dengan escaping HTML.
 * @param {string} text - Teks yang akan di-escape.
 * @returns {string} - Teks yang sudah di-escape.
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        '`': '&#x60;'
    };
    return text.replace(/[&<>"'`]/g, function(m) { return map[m]; });
}

// Panggil fungsi loadDynamicAboutSections setelah seluruh komponen dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadDynamicAboutSections();
});



// --- End of Dynamic About Section Code ---