// login.js
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Perform login via API or backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            // Login successful, store email in localStorage
            localStorage.setItem('userEmail', email);

            // Redirect to a different page (e.g., dashboard or payment)
            window.location.href = '/dashboard.html';
        } else {
            // Handle login error
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred while logging in. Please try again.');
    }
});   