document.addEventListener('DOMContentLoaded', () => {
    const logoImgElement = document.getElementById('navbar-logo-img');
  
    // Panggil API untuk mengambil data contact
    fetch('http://localhost/TEORI_WEB/PHP/api/contact.php?action=read')
      .then(response => response.json())
      .then(data => {
        // Pastikan data berbentuk array dan minimal ada 1 item
        if (Array.isArray(data) && data.length > 0) {
          const contact = data[0];
          
          // Debug: Cek apakah URL/logo sudah benar
          console.log("Navbar Logo URL:", contact.logo);
          
          if (contact.logo) {
            // Jika logo ada, atur src dan alt
            logoImgElement.src = contact.logo;
            logoImgElement.alt = 'Soapy Suds Logo';
          } else {
            // Jika logo tidak ada, kosongkan src atau tampilkan teks alternatif
            logoImgElement.src = '';
            logoImgElement.alt = 'No Logo in Database';
          }
        } else {
          // Jika tidak ada data contact sama sekali
          console.warn("No contact data found");
          logoImgElement.src = '';
          logoImgElement.alt = 'No Contact Data';
        }
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching contact data:', error);
        logoImgElement.src = '';
        logoImgElement.alt = 'Error Loading Logo';
      });
  });
  