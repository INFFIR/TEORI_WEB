document.addEventListener('DOMContentLoaded', () => {
  const transactionData = JSON.parse(localStorage.getItem('transactionData'));
  
  if (transactionData) {
    const locationElement = document.getElementById('invoice-location');
    const servicesElement = document.getElementById('invoice-services');
    const itemsElement = document.getElementById('invoice-items');
    const totalElement = document.getElementById('invoice-total');

    locationElement.textContent = transactionData.location || 'Not specified';
    servicesElement.textContent = transactionData.selectedServices.map(service => getServiceName(service)).join(', ');

    // Populate items list
    let total = 0;
    for (const key in transactionData.selectedItems) {
      const item = transactionData.selectedItems[key];
      const listItem = document.createElement('li');
      listItem.innerHTML = `${item.name} x${item.quantity} <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>`;
      itemsElement.appendChild(listItem);
      total += item.price * item.quantity;
    }
    totalElement.textContent = `Rp ${(total).toLocaleString()}`;
  } else {
    document.getElementById('invoice-details').textContent = 'No transaction data found.';
  }

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

  const backButton = document.getElementById('back-to-transaction');
  backButton.addEventListener('click', () => {
    window.location.href = '../transaction/transaction.html';
  });
});
