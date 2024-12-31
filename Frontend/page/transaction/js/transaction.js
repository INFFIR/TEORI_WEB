// transaction.js

document.addEventListener('DOMContentLoaded', () => {
  // Memuat navbar
  loadExternalHTML('../../../components/navbar.html', '#navbar')
    .then(() => {
      // Setelah navbar dimuat, lanjutkan dengan logika lainnya jika diperlukan
    })
    .catch(error => {
      console.error('Failed to load navbar:', error);
    });

  // Mendapatkan elemen-elemen DOM yang diperlukan
  const stepServices = document.getElementById('step-services');
  const servicesList = stepServices.querySelector('.services-list');
  const stepItems = document.getElementById('step-items');
  const itemsList = document.getElementById('items-list');
  const orderSummary = document.getElementById('order-summary');
  const proceedOrderBtn = document.getElementById('proceed-to-notation');
  const locationInput = document.getElementById('location-input');

  let selectedCategoryIds = []; // Array untuk menyimpan multiple category_id
  let selectedItems = {};
  let location = '';

  // Simpan data kategori dan layanan yang diambil dari API
  let categoriesData = {};
  let servicesData = {};

  // Fungsi untuk memuat kategori layanan dari API
  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:8000/api/service_category.php');
      const data = await response.json();

      console.log('Categories API Response:', data); // Log respons API

      if (data.success && Array.isArray(data.data)) {
        const categories = data.data;
        displayCategories(categories);

        // Simpan data kategori di objek
        categories.forEach(category => {
          categoriesData[category.category_id] = category.title;
        });

        // Simpan data kategori di localStorage untuk referensi nama
        localStorage.setItem('categoriesData', JSON.stringify(categoriesData));
      } else {
        console.error('Gagal mengambil data kategori layanan.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Fungsi untuk menampilkan kategori layanan
  function displayCategories(categories) {
    servicesList.innerHTML = ''; // Bersihkan kontainer

    categories.forEach(category => {
      const serviceItem = document.createElement('div');
      serviceItem.classList.add('service-item');
      serviceItem.setAttribute('data-category-id', category.category_id);

      // Tentukan apakah menggunakan ikon atau default icon
      let iconOrImage = '';
      if (category.category_icon) {
        iconOrImage = `<img src="${category.category_icon}" alt="${category.title}" class="category-icon">`;
      } else {
        // Jika tidak ada category_icon, tampilkan ikon default
        iconOrImage = `<div class="default-icon"><i class="fas fa-concierge-bell"></i></div>`;
      }

      serviceItem.innerHTML = `
        ${iconOrImage}
        <p>${category.title}</p>
      `;

      // Menambahkan event listener untuk memilih/deselect kategori
      serviceItem.addEventListener('click', () => {
        const categoryId = category.category_id;
        if (selectedCategoryIds.includes(categoryId)) {
          // Deselect kategori
          selectedCategoryIds = selectedCategoryIds.filter(id => id !== categoryId);
          serviceItem.classList.remove('selected');
        } else {
          // Pilih kategori baru
          selectedCategoryIds.push(categoryId);
          serviceItem.classList.add('selected');
        }

        // Setelah perubahan seleksi, fetch layanan berdasarkan kategori yang dipilih
        if (selectedCategoryIds.length > 0) {
          fetchServicesByCategories(selectedCategoryIds);
        } else {
          clearServices();
        }
      });

      servicesList.appendChild(serviceItem);
    });
  }

  // Fungsi untuk memuat layanan berdasarkan beberapa kategori yang dipilih dari API
  async function fetchServicesByCategories(categoryIds) {
    try {
      // Gabungkan semua category_id menjadi satu parameter dengan pemisah koma
      const categoryIdsParam = categoryIds.join(',');
      const response = await fetch(`http://localhost:8000/api/service_offered.php?category_ids=${categoryIdsParam}`);
      const data = await response.json();

      console.log('Service Offered API Response:', data); // Log respons API

      if (data.success && Array.isArray(data.data)) {
        const services = data.data;
        displayServices(services);

        // Simpan data layanan di objek
        services.forEach(service => {
          servicesData[service.offered_id] = service;
        });

        // Simpan data layanan di localStorage jika diperlukan
        localStorage.setItem('servicesData', JSON.stringify(servicesData));
      } else {
        console.error('Gagal mengambil data layanan.');
        displayNoServices();
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      displayNoServices();
    }
  }

  // Fungsi untuk menampilkan layanan di Step 3
  function displayServices(services) {
    stepItems.style.display = 'block';
    itemsList.innerHTML = ''; // Bersihkan kontainer item
    orderSummary.style.display = 'none';
    selectedItems = {};

    services.forEach(service => {
      const itemCard = document.createElement('div');
      itemCard.classList.add('item-card');
      itemCard.setAttribute('data-service-id', service.offered_id);
      itemCard.innerHTML = `
        <img src="${service.offered_image_url}" alt="${service.offered_name}" class="service-offered-image">
        <h4>${service.offered_name}</h4>
        <p>Harga: Rp${service.offered_price.toLocaleString()}</p>
        <div class="quantity-controls">
          <button class="minus-btn">-</button>
          <input type="number" min="0" value="0" class="quantity-input">
          <button class="plus-btn">+</button>
        </div>
      `;
      itemsList.appendChild(itemCard);
    });

    // Tambahkan event listener untuk kontrol kuantitas
    const minusButtons = document.querySelectorAll('.minus-btn');
    const plusButtons = document.querySelectorAll('.plus-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    minusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        if (value > 0) {
          input.value = value - 1;
          updateSelectedItems(e.target, input);
        }
      });
    });

    plusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        input.value = value + 1;
        updateSelectedItems(e.target, input);
      });
    });

    quantityInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          value = 0;
          e.target.value = value;
        }
        updateSelectedItems(e.target, e.target);
      });
    });
  }

  // Fungsi untuk menampilkan pesan jika tidak ada layanan
  function displayNoServices() {
    stepItems.style.display = 'block';
    itemsList.innerHTML = '<p>Tidak ada layanan tersedia di kategori yang dipilih.</p>';
    orderSummary.style.display = 'none';
    selectedItems = {};
  }

  // Fungsi untuk menghapus semua layanan ketika tidak ada kategori yang dipilih
  function clearServices() {
    stepItems.style.display = 'none';
    itemsList.innerHTML = '';
    orderSummary.style.display = 'none';
    selectedItems = {};
  }

  // Fungsi untuk memperbarui item terpilih berdasarkan kuantitas
  function updateSelectedItems(button, input) {
    const itemCard = button.closest('.item-card');
    const serviceId = itemCard.getAttribute('data-service-id');
    const service = servicesData[serviceId];
    if (!service) {
      console.error(`Service dengan ID ${serviceId} tidak ditemukan.`);
      return;
    }

    const serviceName = service.offered_name;
    const servicePrice = service.offered_price;
    const timePerItem = service.time_per_item || 3; // Jika API tidak menyediakan, default 3 jam
    const quantity = parseInt(input.value);

    if (quantity > 0) {
      selectedItems[serviceId] = {
        name: serviceName,
        price: servicePrice,
        quantity: quantity,
        timePerItem: timePerItem
      };
      itemCard.classList.add('selected');
    } else {
      delete selectedItems[serviceId];
      itemCard.classList.remove('selected');
    }

    if (Object.keys(selectedItems).length > 0) {
      orderSummary.style.display = 'block';
      generateOrderSummary();
    } else {
      orderSummary.style.display = 'none';
    }
  }

  // Fungsi untuk menghasilkan ringkasan pesanan
  function generateOrderSummary() {
    location = locationInput.value.trim();
    const summaryLocation = document.getElementById('summary-location');
    const summaryServices = document.getElementById('summary-services');
    const summaryItems = document.getElementById('summary-items');
    const summaryTime = document.getElementById('summary-time');

    summaryLocation.textContent = `Lokasi: ${location || 'Tidak ditentukan'}`;

    // Mendapatkan nama kategori yang dipilih berdasarkan category_id
    const serviceNames = selectedCategoryIds.map(id => getCategoryNameById(id));
    summaryServices.textContent = `Layanan Terpilih: ${serviceNames.join(', ')}`;

    let itemsHTML = '<ul>';
    let totalTime = 0;
    for (const key in selectedItems) {
      const item = selectedItems[key];
      itemsHTML += `<li>${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}</li>`;
      // Estimasi waktu berdasarkan layanan
      totalTime += item.timePerItem * item.quantity;
    }
    itemsHTML += '</ul>';
    summaryItems.innerHTML = `Item yang Dipesan: ${itemsHTML}`;

    // Minimal estimasi waktu adalah 24 jam (1 hari)
    totalTime = Math.max(totalTime, 24);
    const days = Math.floor(totalTime / 24);
    const hours = totalTime % 24;
    summaryTime.textContent = `Estimasi Waktu Selesai: ${totalTime} jam (${days > 0 ? days + ' hari' + (days > 1 ? 's' : '') : ''}${days > 0 && hours > 0 ? ', ' : ''}${hours > 0 ? hours + ' jam' + (hours > 1 ? 's' : '') : ''})`;
  }

  // Fungsi pembantu untuk mendapatkan nama kategori berdasarkan ID
  function getCategoryNameById(categoryId) {
    return categoriesData[categoryId] || `Kategori ${categoryId}`;
  }

  // Simpan data transaksi saat melanjutkan ke notasi
  proceedOrderBtn.addEventListener('click', async () => {
    // Validasi input lokasi
    if (!locationInput.value.trim()) {
      alert('Silakan masukkan lokasi laundry Anda.');
      return;
    }

    // Validasi bahwa ada setidaknya satu kategori yang dipilih
    if (selectedCategoryIds.length === 0) {
      alert('Silakan pilih setidaknya satu kategori layanan.');
      return;
    }

    // Validasi bahwa ada item yang dipilih
    if (Object.keys(selectedItems).length === 0) {
      alert('Silakan pilih setidaknya satu item.');
      return;
    }

    // Ambil user_id dari localStorage atau sumber lain (pastikan user sudah login)
    const userId = localStorage.getItem('user_id'); // Sesuaikan dengan cara Anda menyimpan user_id

    if (!userId) {
      alert('Pengguna tidak terautentikasi. Silakan login.');
      window.location.href = '/login.html'; // Redirect ke halaman login
      return;
    }

    try {
      // 1. Buat transaksi
      const transactionResponse = await fetch('http://localhost:8000/api/transaction.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          laundry_location: locationInput.value.trim()
        })
      });

      const transactionData = await transactionResponse.json();

      if (transactionData.success) {
        const transactionId = transactionData.data.transaction_id;

        // 2. Buat detail transaksi untuk setiap item yang dipilih
        const transactionDetails = Object.keys(selectedItems).map(serviceId => ({
          transaction_id: transactionId,
          offered_id: parseInt(serviceId),
          value_count: parseInt(selectedItems[serviceId].quantity),
          sum_offered_price: parseInt(selectedItems[serviceId].price) * parseInt(selectedItems[serviceId].quantity)
        }));

        // Kirim semua detail transaksi
        const detailPromises = transactionDetails.map(detail => fetch('http://localhost:8000/api/transaction_detail.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(detail)
        }).then(response => response.json()));

        const detailResults = await Promise.all(detailPromises);

        // Periksa setiap hasil detail transaksi
        for (const detailResult of detailResults) {
          if (!detailResult.success) {
            throw new Error(`Gagal membuat detail transaksi: ${detailResult.message}`);
          }
        }

        alert('Transaksi berhasil diselesaikan!');
        // Redirect ke halaman invoice atau notasi dengan query parameter transaction_id
        window.location.href = `../invoice/invoice.html?transaction_id=${transactionId}`;
      } else {
        throw new Error(`Gagal membuat transaksi: ${transactionData.message}`);
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      alert('Terjadi kesalahan saat memproses transaksi Anda. Silakan coba lagi.');
    }
  });

  // Panggil fungsi untuk mengambil dan menampilkan kategori
  fetchCategories();
});

// Fungsi untuk memuat HTML eksternal dan menjalankan skrip di dalamnya
function loadExternalHTML(filePath, targetSelector) {
  return fetch(filePath)
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

        // Opsional: Hapus skrip setelah dieksekusinya untuk kebersihan DOM
        script.remove();
      });
    })
    .catch(error => {
      console.error('Error:', error);
      document.querySelector(targetSelector).innerHTML = `<p>Gagal memuat konten dari ${filePath}</p>`;
    });
}
