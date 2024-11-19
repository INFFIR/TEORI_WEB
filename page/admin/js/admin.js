// admin.js

document.addEventListener('DOMContentLoaded', () => {
  // Manage Content Form
  const contentForm = document.getElementById('content-form');
  contentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const aboutText = document.getElementById('about-text').value;
    const servicesText = document.getElementById('services-text').value;
    const contactText = document.getElementById('contact-text').value;
    
    localStorage.setItem('aboutText', aboutText);
    localStorage.setItem('servicesText', servicesText);
    localStorage.setItem('contactText', contactText);
    
    alert('Content Updated Successfully!');
  });
  
  // Manage Images Form
  const imagesForm = document.getElementById('images-form');
  imagesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const logoInput = document.getElementById('logo');
    const aboutImageInput = document.getElementById('about-image');
    const contactImageInput = document.getElementById('contact-image');
    
    if (logoInput.files.length > 0) {
      const logoFile = logoInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        localStorage.setItem('logoImage', event.target.result);
        alert('Logo Updated Successfully!');
      }
      reader.readAsDataURL(logoFile);
    }
    
    if (aboutImageInput.files.length > 0) {
      const aboutImageFile = aboutImageInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        localStorage.setItem('aboutImage', event.target.result);
        alert('About Us Image Updated Successfully!');
      }
      reader.readAsDataURL(aboutImageFile);
    }
    
    if (contactImageInput.files.length > 0) {
      const contactImageFile = contactImageInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        localStorage.setItem('contactImage', event.target.result);
        alert('Contact Image Updated Successfully!');
      }
      reader.readAsDataURL(contactImageFile);
    }
  });
  
  // Manage Pricing Form
  const pricingForm = document.getElementById('pricing-form');
  pricingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const price1 = document.getElementById('price1').value;
    const price2 = document.getElementById('price2').value;
    // Tambahkan lebih banyak harga sesuai kebutuhan
    
    const pricingData = {
      price1: price1,
      price2: price2,
      // Tambahkan lebih banyak harga sesuai kebutuhan
    };
    
    localStorage.setItem('pricingData', JSON.stringify(pricingData));
    
    alert('Pricing Updated Successfully!');
  });
  
  // Manage Settings Form
  const settingsForm = document.getElementById('settings-form');
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const themeColor = document.getElementById('theme-color').value;
    const fontFamily = document.getElementById('font-family').value;
    
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('fontFamily', fontFamily);
    
    alert('Settings Updated Successfully!');
    
    // Terapkan perubahan segera
    document.documentElement.style.setProperty('--theme-color', themeColor);
    document.body.style.fontFamily = fontFamily;
  });
});
