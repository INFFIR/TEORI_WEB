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

  // Terapkan data dari localStorage setelah komponen dimuat
  applyLocalStorageData();
});

// Fungsi untuk menerapkan data dari localStorage
function applyLocalStorageData() {
  try {
      // Load Content from localStorage
      const aboutText = localStorage.getItem('aboutText');
      if (aboutText) {
          const aboutSection = document.querySelector('#about .about-text p');
          if (aboutSection) aboutSection.textContent = aboutText;
      }

      const servicesText = localStorage.getItem('servicesText');
      if (servicesText) {
          const servicesSection = document.querySelector('#services .services-description');
          if (servicesSection) {
              servicesSection.textContent = servicesText;
          } else {
              console.warn('Element .services-description tidak ditemukan.');
          }
      }

      const contactText = localStorage.getItem('contactText');
      if (contactText) {
          const contactSection = document.querySelector('#contact .form-container h3');
          if (contactSection) contactSection.textContent = contactText;
          else {
              console.warn('Element #contact .form-container h3 tidak ditemukan.');
          }
      }

      // Load Images from localStorage
      const logoImage = localStorage.getItem('logoImage');
      if (logoImage) {
          const logo = document.querySelector('.navbar .logo img');
          if (logo) logo.src = logoImage;
          else {
              console.warn('Element .navbar .logo img tidak ditemukan.');
          }
      }

      const aboutImage = localStorage.getItem('aboutImage');
      if (aboutImage) {
          const aboutImg = document.querySelector('#about .about-img img');
          if (aboutImg) aboutImg.src = aboutImage;
          else {
              console.warn('Element #about .about-img img tidak ditemukan.');
          }
      }

      const contactImage = localStorage.getItem('contactImage');
      if (contactImage) {
          const contactImg = document.querySelector('#contact .contact-image img');
          if (contactImg) contactImg.src = contactImage;
          else {
              console.warn('Element #contact .contact-image img tidak ditemukan.');
          }
      }

      // Load Pricing from localStorage
      const pricingData = JSON.parse(localStorage.getItem('pricingData'));
      if (pricingData) {
          // Update setiap harga berdasarkan indeks
          document.querySelectorAll('.pricing-description .item-price').forEach((priceElem, index) => {
              const priceKey = `price${index + 1}`;
              if (pricingData[priceKey]) {
                  priceElem.textContent = `Harga: Rp${Number(pricingData[priceKey]).toLocaleString()}`;
              }
          });
      }

      // Load Settings from localStorage
      const themeColor = localStorage.getItem('themeColor');
      if (themeColor) {
          document.documentElement.style.setProperty('--theme-color', themeColor);
          // Terapkan warna tema ke tombol
          document.querySelectorAll('.btn-primary').forEach(btn => {
              btn.style.backgroundColor = themeColor;
          });
      }

      const fontFamily = localStorage.getItem('fontFamily');
      if (fontFamily) {
          document.body.style.fontFamily = fontFamily;
      }
  } catch (error) {
      console.error('Terjadi kesalahan saat menerapkan data dari localStorage:', error);
  }
}
