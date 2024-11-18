// js/script.js

// Fungsi untuk memuat komponen secara dinamis
async function loadComponent(selector, file) {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      const content = await response.text();
      document.querySelector(selector).insertAdjacentHTML('beforeend', content);
    } catch (error) {
      console.error(error);
    }
  }
  
  // Memuat semua komponen saat DOM telah siap
  document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#wrapper", "./components/navbar.html").then(() => {
      // Setelah navbar dimuat, tambahkan event listener untuk toggle
      const navbarToggle = document.getElementById('navbar-toggle');
      navbarToggle.addEventListener('change', () => {
        document.querySelector('.menu-items').classList.toggle('active', navbarToggle.checked);
      });
    });
    
    loadComponent("#wrapper", "./components/showcase.html");
    loadComponent("#wrapper", "./components/about.html");
    loadComponent("#wrapper", "./components/services.html");
    loadComponent("#wrapper", "./components/pricing.html");
    loadComponent("#wrapper", "./components/testimonials.html");
    loadComponent("#wrapper", "./components/contact.html");
    loadComponent("#wrapper", "./components/footer.html");
  });
  