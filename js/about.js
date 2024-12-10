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
        console.log(`Komponen ${file} berhasil dimuat.`);
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

    // Panggil fungsi untuk memuat layanan setelah 'services.html' dimuat
    await loadServices();

    await loadPricing();

    // Panggil fungsi untuk memuat dynamic about sections
    await loadDynamicAboutSections();
});

/*
 * ----------------------------------------------------------------------------------------------------
 * ABOUT
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * Fungsi untuk mengambil data About dari API dan menampilkannya di halaman.
 */
async function loadDynamicAboutSections() {
    try {
        const response = await fetch('http://localhost:8000/api/about.php', {
            method: 'GET'
        });

        const data = await response.json();
        console.log('API Response:', data);

        if (data.success && Array.isArray(data.data)) {
            const aboutSections = document.getElementById('about-sections');
            aboutSections.innerHTML = ''; // Clear previous content

            data.data.forEach((about, index) => {
                console.log(`Processing About Item ${index}:`, about);

                const wrapper = document.createElement('div');
                wrapper.classList.add('about-wrapper', 'container');

                // Alternating layout
                if (index % 2 === 0) {
                    wrapper.innerHTML = `
                        <div class="about-text">
                            <h3 class="about-head">${escapeHtml(about.about_title || '')}</h3>
                            <p>${escapeHtml(about.description_about || '')}</p>
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
                            <p>${escapeHtml(about.description_about || '')}</p>
                        </div>
                    `;
                }

                console.log('Appending wrapper:', wrapper);
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
 * Function to prevent XSS by escaping HTML.
 * @param {string} text - Text to be escaped.
 * @returns {string} - Escaped text.
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
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
/*
 * ----------------------------------------------------------------------------------------------------
 * ABOUT
 * ----------------------------------------------------------------------------------------------------
 */
/*
 * ----------------------------------------------------------------------------------------------------
 * OUR SERVICE
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * Fungsi untuk mencegah serangan XSS dengan meng-escape karakter HTML.
 * @param {string} text - Teks yang akan di-escape.
 * @returns {string} - Teks yang sudah di-escape.
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
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

/**
 * Fungsi untuk membuat elemen layanan berdasarkan data dari API.
 * @param {Object} service - Objek layanan dari API.
 * @returns {HTMLElement} - Elemen HTML yang mewakili layanan.
 */
function createServiceElement(service) {
    const serviceType = document.createElement('div');
    serviceType.className = 'service-type';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';

    const img = document.createElement('img');
    // Gunakan gambar default jika category_image tidak tersedia
    img.src = service.category_image ? service.category_image : 'images/default-service.jpg';
    img.alt = escapeHtml(service.title ? service.title : 'Untitled Service');

    img.onerror = () => {
        console.error(`Gagal memuat gambar: ${service.category_image}`);
        img.src = 'images/default-service.jpg'; // Pastikan gambar default ada
    };

    const imgContent = document.createElement('div');
    imgContent.className = 'img-content';

    const h3 = document.createElement('h3');
    h3.textContent = service.title ? service.title : 'Untitled Service';

    imgContent.appendChild(h3);
    imgContainer.appendChild(img);
    imgContainer.appendChild(imgContent);
    serviceType.appendChild(imgContainer);


    return serviceType;
}

/**
 * Fungsi untuk menampilkan pesan error di UI.
 * @param {string} message - Pesan error yang akan ditampilkan.
 */
function displayError(message) {
    const container = document.getElementById('service-container');
    if (!container) {
        console.error('Elemen dengan id "service-container" tidak ditemukan.');
        return;
    }

    let errorMsg = container.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'error-message';
        container.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

/**
 * Fungsi utama untuk memuat dan menampilkan layanan dari API.
 */
async function loadServices() {
    console.log('Fungsi loadServices() dipanggil.');

    // URL API Anda
    const apiUrl = 'http://localhost:8000/api/service_category.php';

    // Ambil elemen kontainer dan indikator loading
    const container = document.getElementById('service-container');
    const loadingIndicator = document.getElementById('loading');

    if (!container) {
        console.error('Elemen dengan id "service-container" tidak ditemukan.');
        return;
    }

    try {
        // Tampilkan indikator loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
            console.log('Indikator loading ditampilkan.');
        }

        console.log('Mengambil data layanan dari API...');

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Data yang diterima dari API:', data);

        // Sembunyikan indikator loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
            console.log('Indikator loading disembunyikan.');
        }

        // Periksa apakah respons berhasil dan data tersedia
        if (data.success && Array.isArray(data.data)) {
            const services = data.data;

            // Jika tidak ada layanan, tampilkan pesan
            if (services.length === 0) {
                console.log('Tidak ada layanan yang tersedia.');
                displayError('Tidak ada layanan yang tersedia.');
                return;
            }

            // Buat fragmen dokumen untuk meningkatkan performa
            const fragment = document.createDocumentFragment();

            // Iterasi melalui setiap layanan dan buat elemen HTML
            services.forEach((service, index) => {
                // Tidak perlu mengecek apakah category_image dan title ada
                // Karena kita sudah menangani nilai default di createServiceElement
                console.log(`Membuat elemen layanan untuk kategori ke-${index + 1}:`, service);
                const serviceElement = createServiceElement(service);
                fragment.appendChild(serviceElement);
            });

            // Tambahkan fragmen ke kontainer
            container.appendChild(fragment);
            console.log('Data layanan berhasil ditampilkan.');
        } else {
            console.error('Gagal memuat data layanan:', data.message);
            displayError(data.message || 'Gagal memuat data layanan.');
        }
    } catch (error) {
        // Sembunyikan indikator loading jika ada error
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        console.error('Terjadi kesalahan saat mengambil data:', error);
        displayError('Terjadi kesalahan saat memuat data layanan.');
    }
}

// Panggil fungsi loadServices setelah DOM telah dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
});
/*
 * ----------------------------------------------------------------------------------------------------
 * OUR SERVICE
 * ----------------------------------------------------------------------------------------------------
 */
/*
 * ----------------------------------------------------------------------------------------------------
 * PRICING LIST
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * Fungsi untuk mencegah serangan XSS dengan meng-escape karakter HTML.
 * @param {string} text - Teks yang akan di-escape.
 * @returns {string} - Teks yang sudah di-escape.
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }
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

/**
 * Fungsi untuk membuat elemen pricing berdasarkan data dari API.
 * @param {Object} pricing - Objek pricing dari API.
 * @returns {HTMLElement} - Elemen HTML yang mewakili pricing.
 */
function createPricingElement(pricing) {
    const pricingItem = document.createElement('div');
    pricingItem.className = 'pricing-item';

    const pricingImage = document.createElement('div');
    pricingImage.className = 'pricing-image';

    const img = document.createElement('img');
    // Gunakan gambar default jika offered_image_url tidak tersedia
    img.src = pricing.offered_image_url ? pricing.offered_image_url : 'images/default-pricing.jpg';
    img.alt = escapeHtml(pricing.offered_name ? pricing.offered_name : 'Untitled Pricing');

    img.onerror = () => {
        console.error(`Gagal memuat gambar: ${pricing.offered_image_url}`);
        img.src = 'images/default-pricing.jpg'; // Pastikan gambar default ada
    };

    pricingImage.appendChild(img);

    const pricingDescription = document.createElement('div');
    pricingDescription.className = 'pricing-description';

    const pricingTitle = document.createElement('h3');
    pricingTitle.className = 'pricing-title';
    pricingTitle.textContent = pricing.offered_name ? pricing.offered_name : 'Untitled Pricing';

    const pricingText = document.createElement('p');
    pricingText.textContent = pricing.offered_description ? pricing.offered_description : 'No description available.';

    const pricingPrice = document.createElement('p');
    pricingPrice.className = 'item-price';
    pricingPrice.textContent = pricing.offered_price ? `Harga: Rp${pricing.offered_price}` : 'Harga: Not Available';

    pricingDescription.appendChild(pricingTitle);
    pricingDescription.appendChild(pricingText);
    pricingDescription.appendChild(pricingPrice);

    pricingItem.appendChild(pricingImage);
    pricingItem.appendChild(pricingDescription);

    return pricingItem;
}

/**
 * Fungsi untuk menampilkan pesan error di UI Pricing List.
 * @param {string} message - Pesan error yang akan ditampilkan.
 */
function displayPricingError(message) {
    const container = document.getElementById('pricing-container');
    if (!container) {
        console.error('Elemen dengan id "pricing-container" tidak ditemukan.');
        return;
    }

    let errorMsg = container.querySelector('.pricing-error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'pricing-error-message';
        container.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

/**
 * Fungsi utama untuk memuat dan menampilkan daftar harga dari API.
 */
async function loadPricing() {
    console.log('Fungsi loadPricing() dipanggil.');

    // URL API Anda untuk pricing
    const apiUrl = 'http://localhost:8000/api/service_offered.php';

    // Ambil elemen kontainer dan indikator loading
    const container = document.getElementById('pricing-container');
    const loadingIndicator = document.getElementById('pricing-loading');

    if (!container) {
        console.error('Elemen dengan id "pricing-container" tidak ditemukan.');
        return;
    }

    try {
        // Tampilkan indikator loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
            console.log('Indikator loading untuk pricing ditampilkan.');
        }

        console.log('Mengambil data pricing dari API...');

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        console.log('Data yang diterima dari API:', data);

        // Sembunyikan indikator loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
            console.log('Indikator loading untuk pricing disembunyikan.');
        }

        // Periksa apakah respons berhasil dan data tersedia
        if (data.success && Array.isArray(data.data)) {
            const pricings = data.data;

            // Jika tidak ada pricing, tampilkan pesan
            if (pricings.length === 0) {
                console.log('Tidak ada daftar harga yang tersedia.');
                displayPricingError('Tidak ada daftar harga yang tersedia.');
                return;
            }

            // Buat fragmen dokumen untuk meningkatkan performa
            const fragment = document.createDocumentFragment();

            // Iterasi melalui setiap pricing dan buat elemen HTML
            pricings.forEach((pricing, index) => {
                console.log(`Membuat elemen pricing untuk item ke-${index + 1}:`, pricing);
                const pricingElement = createPricingElement(pricing);
                fragment.appendChild(pricingElement);
            });

            // Tambahkan fragmen ke kontainer
            container.appendChild(fragment);
            console.log('Data daftar harga berhasil ditampilkan.');
        } else {
            console.error('Gagal memuat data pricing:', data.message);
            displayPricingError(data.message || 'Gagal memuat data daftar harga.');
        }
    } catch (error) {
        // Sembunyikan indikator loading jika ada error
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        console.error('Terjadi kesalahan saat mengambil data pricing:', error);
        displayPricingError('Terjadi kesalahan saat memuat data daftar harga.');
    }
}