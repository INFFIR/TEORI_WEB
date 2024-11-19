document.addEventListener('DOMContentLoaded', () => {
  const transactionData = JSON.parse(localStorage.getItem('transactionData'));
  
  if (transactionData) {
    const locationElement = document.getElementById('invoice-location');
    const servicesElement = document.getElementById('invoice-services');
    const itemsElement = document.getElementById('invoice-items');
    const totalElement = document.getElementById('invoice-total');

    locationElement.textContent = `Location: ${transactionData.location || 'Not specified'}`;
    servicesElement.textContent = `Services: ${transactionData.selectedServices.map(service => getServiceName(service)).join(', ')}`;

    let itemsHTML = '<ul>';
    let total = 0;
    for (const key in transactionData.selectedItems) {
      const item = transactionData.selectedItems[key];
      itemsHTML += `<li>${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}</li>`;
      total += item.price * item.quantity;
    }
    itemsHTML += '</ul>';
    itemsElement.innerHTML = `Items Ordered: ${itemsHTML}`;
    totalElement.textContent = `Total: Rp${total.toLocaleString()}`;
  } else {
    document.getElementById('invoice-details').textContent = 'No transaction data found.';
  }

  // Helper function
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

  // Handle back button
  const backButton = document.getElementById('back-to-transaction');
  backButton.addEventListener('click', () => {
    window.location.href = './transaction.html'; // Ganti dengan URL yang sesuai
  });
});
