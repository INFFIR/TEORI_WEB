const API_URL = 'http://localhost/laundry/api'; // Sesuaikan jika Anda menggunakan port lain

async function fetchCategories() {
  const response = await axios.get(`${API_URL}/categories.php`);
  const categories = response.data;
  const categoryTableBody = document.getElementById('category-table-body');
  const offeredCategorySelect = document.getElementById('offered_category');

  // Clear current dropdown and table
  categoryTableBody.innerHTML = '';
  offeredCategorySelect.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown

  categories.forEach(category => {
    // Add category to the table
    categoryTableBody.innerHTML += `
      <tr>
        <td>${category.category_id}</td>
        <td><img src="${category.service_icon}" width="50"></td>
        <td>${category.service_description}</td>
        <td><button class="btn btn-danger" onclick="deleteCategory(${category.category_id})">Delete</button></td>
      </tr>
    `;
    
    // Add category to dropdown
    offeredCategorySelect.innerHTML += `
      <option value="${category.category_id}">${category.service_description}</option>
    `;
  });
}


async function fetchOfferedServices() {
  const response = await axios.get(`${API_URL}/services.php`);
  const services = response.data;
  const serviceTableBody = document.getElementById('service-table-body');
  serviceTableBody.innerHTML = '';

  services.forEach(service => {
    serviceTableBody.innerHTML += `
      <tr>
        <td>${service.offered_id}</td>
        <td>${service.category_id}</td>
        <td><img src="${service.offered_image_url}" width="50"></td>
        <td>${service.offered_name}</td>
        <td>${service.offered_price}</td>
        <td>${service.offered_description}</td>
        <td><button class="btn btn-danger" onclick="deleteService(${service.offered_id})">Delete</button></td>
      </tr>
    `;
  });
}

document.getElementById('category-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const serviceIcon = document.getElementById('service_icon').value;
  const serviceDescription = document.getElementById('service_description').value;

  await axios.post(`${API_URL}/categories.php`, {
    service_icon: serviceIcon,
    service_description: serviceDescription,
  });
  fetchCategories();
});

document.getElementById('offered-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const categoryId = document.getElementById('offered_category').value;
  const imageUrl = document.getElementById('offered_image_url').value;
  const name = document.getElementById('offered_name').value;
  const price = document.getElementById('offered_price').value;
  const description = document.getElementById('offered_description').value;

  await axios.post(`${API_URL}/services.php`, {
    category_id: categoryId,
    offered_image_url: imageUrl,
    offered_name: name,
    offered_price: price,
    offered_description: description,
  });
  fetchOfferedServices();
});

async function deleteCategory(categoryId) {
  await axios.delete(`${API_URL}/categories.php?id=${categoryId}`);
  fetchCategories();
}

async function deleteService(serviceId) {
  await axios.delete(`${API_URL}/services.php?id=${serviceId}`);
  fetchOfferedServices();
}

// Load categories and services when the page loads
window.onload = () => {
  fetchCategories();
  fetchOfferedServices();
};
