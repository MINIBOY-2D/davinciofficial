document.addEventListener('DOMContentLoaded', () => {
    // Animation au défilement
    const sections = document.querySelectorAll('.content-section, .projects-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));

    // Menu Burger
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Mode Sombre/Clair
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Formulaire EmailJS avec reCAPTCHA et cooldown
    if (document.getElementById('contact-form')) {
        const form = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');
        const submitButton = form.querySelector("button[type='submit']");
        const cooldownKey = "contactCooldown";
        const cooldownSeconds = 60;

        const isCooldownActive = () => {
            const expiry = localStorage.getItem(cooldownKey);
            return expiry && parseInt(expiry) > Date.now();
        };

        const updateCooldownMessage = () => {
            const remaining = Math.ceil((parseInt(localStorage.getItem(cooldownKey)) - Date.now()) / 1000);
            formMessage.textContent = `⏳ Merci ! Vous pouvez renvoyer un message dans ${remaining}s.`;
            formMessage.style.color = 'gray';
        };

        const startCooldown = () => {
            const expiresAt = Date.now() + cooldownSeconds * 1000;
            localStorage.setItem(cooldownKey, expiresAt.toString());
            submitButton.disabled = true;
            updateCooldownMessage();
            const interval = setInterval(() => {
                if (!isCooldownActive()) {
                    clearInterval(interval);
                    formMessage.textContent = '';
                    submitButton.disabled = false;
                } else {
                    updateCooldownMessage();
                }
            }, 1000);
        };

        if (isCooldownActive()) {
            submitButton.disabled = true;
            updateCooldownMessage();
            const interval = setInterval(() => {
                if (!isCooldownActive()) {
                    clearInterval(interval);
                    formMessage.textContent = '';
                    submitButton.disabled = false;
                } else {
                    updateCooldownMessage();
                }
            }, 1000);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isCooldownActive()) {
                updateCooldownMessage();
                return;
            }

            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                formMessage.textContent = "⚠️ Merci de valider le reCAPTCHA.";
                formMessage.style.color = "orange";
                return;
            }

            submitButton.disabled = true;

            emailjs.send('service_qy2iekx', 'template_rh7h7e3', {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value,
            })
            .then(() => {
                formMessage.textContent = '✅ Message envoyé avec succès !';
                formMessage.style.color = 'green';
                form.reset();
                grecaptcha.reset();
                startCooldown();
            }, (error) => {
                formMessage.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
                formMessage.style.color = 'red';
                console.error('Erreur EmailJS:', error);
                submitButton.disabled = false;
            });
        });
    }
});
