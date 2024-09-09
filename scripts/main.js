document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is loaded and running.');

    // Menu button functionality
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu');

    menuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'flex'; // Change to 'flex' for centering content
        document.body.classList.add('no-scroll'); // Disable scroll
    });

    closeMenuBtn.addEventListener('click', () => {
        menuOverlay.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Re-enable scroll
    });
});

// Payment Page Logic
// Handle PayPal button and charging correct amount
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');

    let price;

    if (type === 'premium') {
        productName.textContent = 'Xercaii Premium Tweaking Utility';
        price = 24.99;
        productPrice.textContent = `$${price}`;
    } else if (type === 'basic') {
        productName.textContent = 'Xercaii Basic Tweaking Utility';
        price = 7.99;
        productPrice.textContent = `$${price}`;
    }   
    
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                window.location.href = `success.html?type=${type}&token=${data.orderID}`;
            });
        }
    }).render('#paypal-button-container');
});

// Success Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const successProductType = urlParams.get('type');
    const downloadLink = document.getElementById('download-link');

    if (token) {
        fetch(`/api/validate_token?token=${token}`)
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    if (successProductType === 'premium') {
                        downloadLink.href = 'Extra/Other/XERCAII TWEAKS.rar.zip';
                        downloadLink.textContent = 'Download Premium Utility';
                    } else if (successProductType === 'basic') {
                        downloadLink.href = 'Extra/Other/Xercaii-Basic-Tweaking-Utility-main.zip';
                        downloadLink.textContent = 'Download Basic Utility';
                    } else {
                        downloadLink.href = '#';
                        downloadLink.textContent = 'Download Error';
                    }
                } else {
                    downloadLink.href = '#';
                    downloadLink.textContent = 'Invalid or Expired Token';
                }
            });
    } else {
        downloadLink.href = '#';
        downloadLink.textContent = 'No Token Provided';
    }
});