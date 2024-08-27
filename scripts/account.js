
document.getElementById('login-form')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const feedback = document.getElementById('login-feedback');
        if (response.ok) {
            feedback.textContent = 'Login successful. Redirecting to home...';
            feedback.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            feedback.textContent = 'Invalid email or password.';
            feedback.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});