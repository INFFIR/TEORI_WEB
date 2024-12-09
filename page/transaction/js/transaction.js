const API_URL = 'http://localhost/laundry/api'; // Sesuaikan jika Anda menggunakan port lain

let selectedServices = {}; // To store selected services and their quantities
let userAddress = ''; // To store user input address

// Fetch categories and render them
async function fetchCategories() {
  const response = await axios.get(`${API_URL}/categories.php`);
  const categories = response.data;
  const categoriesContainer = document.getElementById('categories-container');

  categoriesContainer.innerHTML = '';

  categories.forEach(category => {
    categoriesContainer.innerHTML += `
      <div class="col-md-3 mb-3">
        <div class="card" data-category-id="${category.category_id}">
          <img src="${category.service_icon}" class="card-img-top" alt="${category.service_description}" />
          <div class="card-body">
            <h5 class="card-title">${category.service_description}</h5>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      const categoryId = e.target.closest('.card').getAttribute('data-category-id');
      fetchServices(categoryId);
    });
  });
}

// Fetch services based on the selected category and render them
async function fetchServices(categoryId) {
  const response = await axios.get(`${API_URL}/services.php?category_id=${categoryId}`);
  const services = response.data;
  const servicesContainer = document.getElementById('services-container');

  servicesContainer.innerHTML = '';

  if (services.length === 0) {
    servicesContainer.innerHTML = '<p>No services available for this category.</p>';
    return;
  }

  services.forEach(service => {
    servicesContainer.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card">
          <img src="${service.offered_image_url}" class="card-img-top" alt="${service.offered_name}" />
          <div class="card-body">
            <h5 class="card-title">${service.offered_name}</h5>
            <p class="card-text">Price: Rp ${service.offered_price}</p>
            <p class="card-text">${service.offered_description}</p>
            <div class="d-flex align-items-center">
              <button class="btn btn-secondary decrease-btn" data-service-id="${service.offered_id}">-</button>
              <input type="number" id="quantity-${service.offered_id}" value="1" class="form-control w-25 mx-2" readonly />
              <button class="btn btn-secondary increase-btn" data-service-id="${service.offered_id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelectorAll('.increase-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      increaseQuantity(e.target.dataset.serviceId);
    });
  });

  document.querySelectorAll('.decrease-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      decreaseQuantity(e.target.dataset.serviceId);
    });
  });
}

// Increase quantity
function increaseQuantity(serviceId) {
  const quantityInput = document.getElementById(`quantity-${serviceId}`);
  let quantity = parseInt(quantityInput.value);
  quantityInput.value = quantity + 1;
  updateOrderSummary(serviceId, quantityInput.value);
}

// Decrease quantity
function decreaseQuantity(serviceId) {
  const quantityInput = document.getElementById(`quantity-${serviceId}`);
  let quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantityInput.value = quantity - 1;
    updateOrderSummary(serviceId, quantityInput.value);
  }
}

// Update the order summary
function updateOrderSummary(serviceId, quantity) {
  const serviceDetails = document.querySelector(`#quantity-${serviceId}`).closest('.card-body').querySelector('.card-title').innerText;
  const servicePrice = parseFloat(document.querySelector(`#quantity-${serviceId}`).closest('.card-body').querySelector('.card-text').innerText.replace('Price: Rp ', '').trim());
  const totalServicePrice = servicePrice * quantity;

  if (quantity > 0) {
    selectedServices[serviceId] = { serviceDetails, quantity, totalServicePrice, servicePrice };
  } else {
    delete selectedServices[serviceId];
  }

  const orderSummary = document.getElementById('order-summary');
  const orderDetails = document.getElementById('order-details');

  let totalPrice = 0;
  orderDetails.innerHTML = '';

  for (const id in selectedServices) {
    const { serviceDetails, quantity, totalServicePrice } = selectedServices[id];
    totalPrice += totalServicePrice;

    orderDetails.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-2" data-service-id="${id}">
        <button class="btn btn-danger btn-sm remove-btn">-</button>
        <span class="ms-2">${serviceDetails} x ${quantity} ........ Rp ${totalServicePrice.toFixed(2)}</span>
      </div>
    `;
  }

  orderDetails.innerHTML += `
    <div class="d-flex justify-content-between mt-3">
      <strong>Total Price:</strong>
      <span>Rp ${totalPrice.toFixed(2)}</span>
    </div>
  `;

  if (Object.keys(selectedServices).length > 0) {
    orderSummary.style.display = 'block';
  } else {
    orderSummary.style.display = 'none';
  }

  const addressSummary = document.getElementById('address-summary');
  addressSummary.innerHTML = `<strong>Address:</strong> ${userAddress || 'Not provided'}`;
}

// Event delegation for removing services
document.getElementById('order-details').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const serviceId = e.target.closest('div[data-service-id]').getAttribute('data-service-id');
    delete selectedServices[serviceId];
    updateOrderSummary(serviceId, 0);
  }
});

document.getElementById('address').addEventListener('input', (e) => {
  userAddress = e.target.value;
  updateOrderSummary();
});

document.getElementById('finalize-order').addEventListener('click', async () => {
  if (!userAddress.trim()) {
    alert('Please enter your address.');
    return;
  }

  if (Object.keys(selectedServices).length === 0) {
    alert('Please select at least one service.');
    return;
  }

  try {
    // Kirim data transaksi
    const transactionResponse = await axios.post(`${API_URL}/transaction.php`, {
      user_id: 1, // ID pengguna (sesuaikan dengan ID yang login)
      laundry_location: userAddress
    });

    const transactionId = transactionResponse.data.transaction_id;

    // Menyimpan transactionId ke localStorage
    localStorage.setItem('transactionId', transactionId);

    // Kirim detail transaksi untuk setiap layanan
    for (const serviceId in selectedServices) {
      const service = selectedServices[serviceId];
      await axios.post(`${API_URL}/transaction_detail.php`, {
        transaction_id: transactionId,
        offered_id: serviceId,
        value_count: service.quantity,
        sum_offered_price: service.totalServicePrice
      });
    }

    alert('Transaction completed successfully!');
    window.location.href = '../invoice/invoice.html'; // Arahkan ke halaman invoice
  } catch (error) {
    alert('Error: ' + error.response.data.message);
  }
});

window.onload = () => {
  fetchCategories();
};
