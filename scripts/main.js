document.addEventListener('DOMContentLoaded', () => {
    console.log('JavaScript is loaded and running.');

    // Event listener for description buttons
    document.querySelectorAll('.description-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Description button clicked.');
            const description = event.target.getAttribute('data-description');
            if (description) {
                alert(description); // Show the description in an alert dialog
            } else {
                console.error('No description found for this button.');
            }
        });
    });

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
                window.location.href = `success.html?type=${type}`;
            });
        }
    }).render('#paypal-button-container');
});

// Success Page Logic
const successParams = new URLSearchParams(window.location.search);
const successProductType = successParams.get('type');

if (successProductType === 'premium') {
    document.getElementById('download-link').href = 'Extra/Other/XERCAII TWEAKS.rar.zip';
} else if (successProductType === 'basic') {
    document.getElementById('download-link').href = 'Extra/Other/Xercaii-Basic-Tweaking-Utility-main.zip';
}