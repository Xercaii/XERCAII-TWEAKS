// Menu Button Logic
document.getElementById('menu-btn').addEventListener('click', function() {
    document.getElementById('menu-overlay').style.display = 'flex';
});

document.getElementById('close-menu').addEventListener('click', function() {
    document.getElementById('menu-overlay').style.display = 'none';
});

// Description Buttons
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for description buttons
    document.querySelectorAll('.description-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const description = event.target.getAttribute('data-description');
            alert(description); // Show the description in an alert dialog
        });
    });

    // Menu button functionality (if needed)
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu');

    menuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'block';
    });

    closeMenuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'none';
    });
});

// Payment Page Logic
const urlParams = new URLSearchParams(window.location.search);
const productType = urlParams.get('type');

if (productType === 'premium') {
    document.getElementById('product-name').textContent = 'Xercaii Premium Tweaking Utility';
    document.getElementById('product-price').textContent = '$25.00';
} else if (productType === 'basic') {
    document.getElementById('product-name').textContent = 'Xercaii Basic Tweaking Utility';
    document.getElementById('product-price').textContent = '$0.01';
}

// Success Page Logic
const successParams = new URLSearchParams(window.location.search);
const successProductType = successParams.get('type');

if (successProductType === 'premium') {
    document.getElementById('download-link').href = 'assets/premium-file.zip';
} else if (successProductType === 'basic') {
    document.getElementById('download-link').href = 'assets/basic-file.zip';
}