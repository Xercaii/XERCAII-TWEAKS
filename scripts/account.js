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

document.getElementById('signup-form')?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            alert('Sign up successful. Please check your email for confirmation.');
            window.location.href = 'success.html';
        } else {
            alert('Sign up failed. Email may already be in use.');
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});