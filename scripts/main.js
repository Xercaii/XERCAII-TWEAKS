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

// Success Page Logic
const successParams = new URLSearchParams(window.location.search);
const successProductType = successParams.get('type');

if (successProductType === 'premium') {
    document.getElementById('download-link').href = 'assets/premium-file.zip';
} else if (successProductType === 'basic') {
    document.getElementById('download-link').href = 'assets/basic-file.zip';
}