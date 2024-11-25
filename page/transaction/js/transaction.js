// transaction.js

document.addEventListener('DOMContentLoaded', () => {
  // Memuat navbar
  loadExternalHTML('../../../components/navbar.html', '#navbar')
    .then(() => {
      // Setelah navbar dimuat dan skrip dieksekusi, lanjutkan dengan logika lainnya jika diperlukan
      // Namun, karena skrip dalam navbar.html sudah mengatur tautan, Anda tidak perlu menambahkan ulang logika tersebut di sini
    })
    .catch(error => {
      console.error('Failed to load navbar:', error);
    });

  // ... (Sisa kode Anda untuk transaction.js)
  
  const serviceItems = document.querySelectorAll('.service-item');
  const stepItems = document.getElementById('step-items');
  const itemsList = document.getElementById('items-list');
  const orderSummary = document.getElementById('order-summary');
  const proceedOrderBtn = document.getElementById('proceed-order');
  const locationInput = document.getElementById('location-input');

  let selectedServices = [];
  let selectedItems = {};
  let location = '';

  // Definisikan data item per layanan
  const serviceItemsData = {
    'dry-clean': [
      { id: 'shirt', name: 'Shirt / T-shirt', price: 25000, image: '../../images/price1.jpg' },
      { id: 'blazer', name: 'Blazer / Coat', price: 40000, image: '../../images/price4.webp' },
      { id: 'sherwani', name: 'Sherwani', price: 100000, image: '../../images/price6.jpg' }
    ],
    'laundry': [
      { id: 'jeans', name: 'Jeans', price: 25000, image: '../../images/price9.jpg' },
      { id: 'cap', name: 'Cap (Casual / Woolen)', price: 20000, image: '../../images/price5.jpg' }
    ],
    'steam-iron': [
      { id: 'curtains', name: 'Curtains', price: 50000, image: '../../images/price10.webp' },
      { id: 'bedcover', name: 'Bed Cover Double', price: 60000, image: '../../images/price9.jpg' }
    ],
    'shoes-clean': [
      { id: 'shoes', name: 'Shoes Sports', price: 50000, image: '../../images/price2.jpg' }
    ],
    'bag-clean': [
      { id: 'bag', name: 'Bag Cleaning', price: 30000, image: '../../images/price5.jpg' }
    ],
    'carpet-clean': [
      { id: 'carpet', name: 'Carpet Cleaning', price: 80000, image: '../../images/price8.webp' }
    ]
  };

  // Handle service selection
  serviceItems.forEach(item => {
    item.addEventListener('click', () => {
      const service = item.getAttribute('data-service');
      if (selectedServices.includes(service)) {
        selectedServices = selectedServices.filter(s => s !== service);
        item.classList.remove('selected');
      } else {
        selectedServices.push(service);
        item.classList.add('selected');
      }

      if (selectedServices.length > 0) {
        stepItems.style.display = 'block';
        generateItems();
      } else {
        stepItems.style.display = 'none';
        itemsList.innerHTML = '';
        orderSummary.style.display = 'none';
      }
    });
  });

  // Generate items berdasarkan layanan yang dipilih
  function generateItems() {
    itemsList.innerHTML = '';
    selectedItems = {};
    selectedServices.forEach(service => {
      serviceItemsData[service].forEach(item => {
        // Hindari item duplikat jika beberapa layanan menyertakan item yang sama
        if (!itemsList.querySelector(`[data-item-id="${item.id}"]`)) {
          const itemCard = document.createElement('div');
          itemCard.classList.add('item-card');
          itemCard.setAttribute('data-item-id', item.id);
          itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Harga: Rp${item.price.toLocaleString()}</p>
            <div class="quantity-controls">
              <button class="minus-btn">-</button>
              <input type="number" min="0" value="0" class="quantity-input">
              <button class="plus-btn">+</button>
            </div>
          `;
          itemsList.appendChild(itemCard);
        }
      });
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
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
          e.target.value = 0;
        }
        updateSelectedItems(e.target, e.target);
      });
    });
  }

  // Update selected items berdasarkan kuantitas
  function updateSelectedItems(button, input) {
    const itemCard = button.closest('.item-card');
    const itemId = itemCard.getAttribute('data-item-id');
    const itemName = itemCard.querySelector('h4').innerText;
    const itemPriceText = itemCard.querySelector('p').innerText;
    const itemPrice = parseInt(itemPriceText.replace(/\D/g, ''));
    const quantity = parseInt(input.value);

    if (quantity > 0) {
      selectedItems[itemId] = {
        name: itemName,
        price: itemPrice,
        quantity: quantity
      };
      itemCard.classList.add('selected');
    } else {
      delete selectedItems[itemId];
      itemCard.classList.remove('selected');
    }

    if (Object.keys(selectedItems).length > 0) {
      orderSummary.style.display = 'block';
      generateOrderSummary();
    } else {
      orderSummary.style.display = 'none';
    }
  }

  // Generate order summary
  function generateOrderSummary() {
    location = locationInput.value.trim();
    const summaryLocation = document.getElementById('summary-location');
    const summaryServices = document.getElementById('summary-services');
    const summaryItems = document.getElementById('summary-items');
    const summaryTime = document.getElementById('summary-time');

    summaryLocation.textContent = `Location: ${location || 'Not specified'}`;
    summaryServices.textContent = `Selected Services: ${selectedServices.map(s => getServiceName(s)).join(', ')}`;

    let itemsHTML = '<ul>';
    let totalTime = 0;
    for (const key in selectedItems) {
      const item = selectedItems[key];
      itemsHTML += `<li>${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}</li>`;
      // Estimasi waktu berdasarkan layanan
      const service = getServiceByItemId(key);
      totalTime += getServiceTime(service) * item.quantity;
    }
    itemsHTML += '</ul>';
    summaryItems.innerHTML = `Items Ordered: ${itemsHTML}`;
    summaryTime.textContent = `Estimated Completion Time: ${totalTime} hours`;

    // Update summary location secara real-time
    locationInput.addEventListener('input', () => {
      summaryLocation.textContent = `Location: ${locationInput.value.trim() || 'Not specified'}`;
    });
  }

  // Fungsi pembantu
  function getServiceName(serviceId) {
    const names = {
      'dry-clean': 'Dry Cleaning',
      'laundry': 'Premium Laundry',
      'steam-iron': 'Steam Ironing',
      'shoes-clean': 'Shoes Cleaning',
      'bag-clean': 'Bag Cleaning',
      'carpet-clean': 'Carpet Cleaning'
    };
    return names[serviceId] || serviceId;
  }

  function getServiceByItemId(itemId) {
    for (const service in serviceItemsData) {
      if (serviceItemsData[service].some(item => item.id === itemId)) {
        return service;
      }
    }
    return null;
  }

  function getServiceTime(serviceId) {
    const times = {
      'dry-clean': 24,
      'laundry': 12,
      'steam-iron': 6,
      'shoes-clean': 24,
      'bag-clean': 24,
      'carpet-clean': 48
    };
    return times[serviceId] || 24;
  }

  // Simpan data transaksi saat melanjutkan ke notasi
  document.getElementById('proceed-to-notation').addEventListener('click', () => {
    const transactionData = {
      location: locationInput.value.trim(),
      selectedServices: selectedServices,
      selectedItems: selectedItems
    };
    
    // Simpan data ke localStorage
    localStorage.setItem('transactionData', JSON.stringify(transactionData));
  });
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
      document.querySelector(targetSelector).innerHTML = `<p>Failed to load content from ${filePath}</p>`;
    });
}
