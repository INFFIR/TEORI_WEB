// transaction.js

document.addEventListener('DOMContentLoaded', () => {
    const serviceItems = document.querySelectorAll('.service-item');
    const stepItems = document.getElementById('step-items');
    const itemsList = document.getElementById('items-list');
    const orderSummary = document.getElementById('order-summary');
    const proceedOrderBtn = document.getElementById('proceed-order');
    const locationInput = document.getElementById('location-input');
  
    let selectedServices = [];
    let selectedItems = {};
    let location = '';
  
    // Define items available for each service
    const serviceItemsData = {
      'dry-clean': [
        { id: 'shirt', name: 'Shirt / T-shirt', price: 25000, image: 'images/price1.jpg' },
        { id: 'blazer', name: 'Blazer / Coat', price: 40000, image: 'images/price4.webp' },
        { id: 'sherwani', name: 'Sherwani', price: 100000, image: 'images/price6.jpg' }
      ],
      'laundry': [
        { id: 'jeans', name: 'Jeans', price: 25000, image: 'images/price9.jpg' },
        { id: 'cap', name: 'Cap (Casual / Woolen)', price: 20000, image: 'images/price5.jpg' }
      ],
      'steam-iron': [
        { id: 'curtains', name: 'Curtains', price: 50000, image: 'images/price10.webp' },
        { id: 'bedcover', name: 'Bed Cover Double', price: 60000, image: 'images/price9.jpg' }
      ],
      'shoes-clean': [
        { id: 'shoes', name: 'Shoes Sports', price: 50000, image: 'images/price2.jpg' }
      ],
      'bag-clean': [
        { id: 'bag', name: 'Bag Cleaning', price: 30000, image: 'images/price5.jpg' }
      ],
      'carpet-clean': [
        { id: 'carpet', name: 'Carpet Cleaning', price: 80000, image: 'images/price8.webp' }
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
  
    // Generate items based on selected services
    function generateItems() {
      itemsList.innerHTML = '';
      selectedItems = {};
      selectedServices.forEach(service => {
        serviceItemsData[service].forEach(item => {
          // Avoid duplicate items if multiple services include the same item
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
  
      // Add event listeners for quantity controls
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
  
    // Update selected items based on quantity
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
        // Estimate time based on services
        const service = getServiceByItemId(key);
        totalTime += getServiceTime(service) * item.quantity;
      }
      itemsHTML += '</ul>';
      summaryItems.innerHTML = `Items Ordered: ${itemsHTML}`;
      summaryTime.textContent = `Estimated Completion Time: ${totalTime} hours`;
  
      // Update summary location in real-time
      locationInput.addEventListener('input', () => {
        summaryLocation.textContent = `Location: ${locationInput.value.trim() || 'Not specified'}`;
      });
    }
  
    // Helper functions
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
  