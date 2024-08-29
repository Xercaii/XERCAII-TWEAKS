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
const urlParams = new URLSearchParams(window.location.search);
const productType = urlParams.get('type');

if (productType === 'premium') {
    document.getElementById('product-name').textContent = 'Xercaii Premium Tweaking Utility';
    document.getElementById('product-price').textContent = '$25.00';
} else if (productType === 'basic') {
    document.getElementById('product-name').textContent = 'Xercaii Basic Tweaking Utility';
    document.getElementById('product-price').textContent = '$8.00';
}

paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: (productType === 'premium' ? '25.00' : '8.00')
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            window.location.href = 'success.html?type=' + productType;
        });
    }
}).render('#paypal-button-container');

// Success Page Logic
const successParams = new URLSearchParams(window.location.search);
const successProductType = successParams.get('type');

if (successProductType === 'premium') {
    document.getElementById('download-link').href = 'assets/premium-file.zip';
} else if (successProductType === 'basic') {
    document.getElementById('download-link').href = 'assets/basic-file.zip';
}