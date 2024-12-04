// login.js
window.onload = () => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
        try {
            const decodedToken = jwt_decode(authToken);
            const userType = decodedToken.user_type;
            // Redirect user based on the type
            if (userType === 'shopper') {
                window.location.href = 'cart.html';
            } else if (userType === 'admin') {
                window.location.href = 'admin-products.html';
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
};


const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert('Login successful!');
        localStorage.setItem('authToken', result.token);
        const decodedToken = jwt_decode(result.token);
        const userType = decodedToken.user_type;
        localStorage.setItem('user_id', decodedToken.id);
        
        if (userType === 'shopper') {
            window.location.href = 'cart.html';
        } else if (userType === 'admin') {
            window.location.href = 'admin-products.html';
        } else {
            alert('User type not recognized');
        }

    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in');
    }
});