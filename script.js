document.addEventListener('DOMContentLoaded', () => {
    // Animation au défilement
    const sections = document.querySelectorAll('.content-section, .projects-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        observer.observe(section);
    });

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

    // Vérifier la préférence sauvegardée
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Formulaire EmailJS (uniquement sur la page Contact)
    if (document.getElementById('contact-form')) {
        const form = document.getElementById('contact-form');
        const formMessage = document.getElementById('form-message');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            emailjs.send('service_qy2iekx', 'template_rh7h7e3', {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            })
            .then(() => {
                formMessage.textContent = 'Message envoyé avec succès !';
                formMessage.style.color = 'green';
                form.reset();
            }, (error) => {
                formMessage.textContent = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
                formMessage.style.color = 'red';
                console.error('Erreur EmailJS:', error);
            });
        });
    }
});