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

// Handle Sign-Up Form
document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
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
            alert('Sign up successful! You can now log in.');
            window.location.href = 'login.html';
        } else {
            const errorText = await response.text();
            alert(`Error: ${errorText}`);
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
    }
});

// Handle Login Form
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
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

        if (response.ok) {
            localStorage.setItem('userEmail', email);
            window.location.href = '/dashboard.html'; // Redirect to dashboard or another page
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('An error occurred while logging in. Please try again.');
    }
});