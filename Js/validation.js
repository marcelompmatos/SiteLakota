// validation.js - Validação client-side para formulários

document.addEventListener('DOMContentLoaded', function() {
    // Validação do formulário de contato
    const contactForm = document.querySelector('#contactOverlay form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const subject = document.getElementById('contactSubject');
            const message = document.getElementById('contactMessage');

            let isValid = true;

            // Reset previous states
            [name, email, subject, message].forEach(field => {
                field.classList.remove('error', 'success');
            });

            // Validate name
            if (!name.value.trim()) {
                name.classList.add('error');
                isValid = false;
            } else {
                name.classList.add('success');
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.classList.add('error');
                isValid = false;
            } else {
                email.classList.add('success');
            }

            // Validate subject
            if (!subject.value.trim()) {
                subject.classList.add('error');
                isValid = false;
            } else {
                subject.classList.add('success');
            }

            // Validate message
            if (!message.value.trim()) {
                message.classList.add('error');
                isValid = false;
            } else {
                message.classList.add('success');
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('.submit-btn');
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                    contactForm.reset();
                    submitBtn.textContent = 'Enviar Mensagem';
                    submitBtn.disabled = false;
                    closeOverlay('contact');
                }, 2000);
            } else {
                // Show error message
                showFormError('Por favor, preencha todos os campos corretamente.');
            }
        });
    }

    // Real-time validation
    document.querySelectorAll('#contactOverlay input, #contactOverlay textarea').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
});

function validateField(field) {
    field.classList.remove('error', 'success');

    switch(field.id) {
        case 'contactName':
        case 'contactSubject':
            if (field.value.trim()) {
                field.classList.add('success');
            } else {
                field.classList.add('error');
            }
            break;
        case 'contactEmail':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(field.value)) {
                field.classList.add('success');
            } else {
                field.classList.add('error');
            }
            break;
        case 'contactMessage':
            if (field.value.trim().length >= 10) {
                field.classList.add('success');
            } else {
                field.classList.add('error');
            }
            break;
    }
}

function showFormError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.form-error');
    if (existingError) existingError.remove();

    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error);
        background: rgba(220, 20, 60, 0.1);
        border: 1px solid var(--error);
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 14px;
    `;

    const form = document.querySelector('#contactOverlay form');
    form.insertBefore(errorDiv, form.firstChild);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}