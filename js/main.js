/**
 * Main JavaScript for Psicóloga Website
 * Handles: Navigation, Scroll effects, EmailJS form, Animations
 */

// ===== DOM Elements =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

// ===== EmailJS Configuration =====
// IMPORTANTE: Reemplaza estos valores con tus credenciales de EmailJS
// Puedes obtenerlas gratis en https://www.emailjs.com/
const EMAILJS_CONFIG = {
    publicKey: 'uhB2XkrLGBlc9wEhj',      // Public Key de EmailJS
    serviceId: 'service_ab2b82y',         // Service ID de EmailJS
    templateId: 'template_p7ntzp5'       // Template ID de EmailJS
};

// ===== Initialize EmailJS =====
function initEmailJS() {
    if (EMAILJS_CONFIG.publicKey !== 'TU_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
}

// ===== Mobile Navigation =====
function openMenu() {
    navMenu.classList.add('show-menu');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    navMenu.classList.remove('show-menu');
    document.body.style.overflow = '';
}

// Event listeners for mobile nav
if (navToggle) {
    navToggle.addEventListener('click', openMenu);
}

if (navClose) {
    navClose.addEventListener('click', closeMenu);
}

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('show-menu') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)) {
        closeMenu();
    }
});

// Close menu with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
        closeMenu();
    }
});

// ===== Butterfly Scroll Animation =====
const butterflyFrame = document.querySelector('.butterfly-frame');
const totalFrames = 88;
let lastScrollY = 0;

function handleButterflyScroll() {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
    
    // Calcular qué frame mostrar basado en el scroll
    // El scroll dentro del hero (0 a heroHeight) mapea a frames (1 a 88)
    const scrollProgress = Math.min(scrolled / heroHeight, 1);
    const frameIndex = Math.floor(scrollProgress * (totalFrames - 1)) + 1;
    
    // Asegurar que el frame esté en el rango válido
    const currentFrame = Math.max(1, Math.min(frameIndex, totalFrames));
    const frameNumber = String(currentFrame).padStart(3, '0');
    
    // Actualizar la imagen
    if (butterflyFrame) {
        butterflyFrame.src = `assets/images/mariposa/ezgif-frame-${frameNumber}.jpg`;
    }
    
    lastScrollY = scrolled;
}

// ===== Header Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Animar mariposa con el scroll
    handleButterflyScroll();
}

window.addEventListener('scroll', handleScroll);

// ===== Floating CTA Button Visibility =====
const floatingCta = document.getElementById('floating-cta');
const contactSection = document.getElementById('contacto');

function initFloatingCta() {
    if (!floatingCta || !contactSection) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // El formulario es visible, ocultar el botón
                    floatingCta.classList.add('hidden');
                } else {
                    // El formulario no es visible, mostrar el botón
                    floatingCta.classList.remove('hidden');
                }
            });
        },
        {
            threshold: 0.2, // 20% del formulario visible
            rootMargin: '0px'
        }
    );
    
    observer.observe(contactSection);
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== Form Validation =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];

    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Por favor, ingresa tu nombre completo.');
    }

    if (!formData.email || !validateEmail(formData.email)) {
        errors.push('Por favor, ingresa un email válido.');
    }

    if (!formData.country || formData.country.trim().length < 2) {
        errors.push('Por favor, indica tu país de residencia.');
    }

    return errors;
}

// ===== Form Submission =====
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form__message ' + type;
}

function hideMessage() {
    formMessage.className = 'form__message';
    formMessage.textContent = '';
}

function setLoading(isLoading) {
    const btnText = submitBtn.querySelector('.btn__text');
    const btnLoading = submitBtn.querySelector('.btn__loading');

    if (isLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
    } else {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    hideMessage();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        country: document.getElementById('country').value,
        phone: document.getElementById('phone').value || 'No proporcionado',
        message: document.getElementById('message').value || 'Sin mensaje adicional'
    };

    // Validate
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showMessage(errors[0], 'error');
        return;
    }

    // Check privacy checkbox
    const privacyCheckbox = document.getElementById('privacy');
    if (!privacyCheckbox.checked) {
        showMessage('Debes aceptar la política de privacidad para continuar.', 'error');
        return;
    }

    // Check if EmailJS is configured
    if (EMAILJS_CONFIG.publicKey === 'TU_PUBLIC_KEY') {
        // Demo mode - just show success message
        showMessage('¡Gracias por tu mensaje! (Modo demo: configura EmailJS para envío real)', 'success');
        contactForm.reset();
        return;
    }

    // Send email via EmailJS
    setLoading(true);

    try {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            country: formData.country,
            phone: formData.phone,
            message: formData.message,
            to_email: 'licgubitosimicaela@gmail.com'
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('EmailJS Success:', response);
        showMessage('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto.', 'success');
        contactForm.reset();

    } catch (error) {
        console.error('EmailJS Error Details:', error);
        console.error('Error Status:', error.status);
        console.error('Error Text:', error.text);
        
        let errorMessage = 'Hubo un error al enviar el mensaje. ';
        
        if (error.status === 400) {
            errorMessage += 'Verifica que los nombres de las variables en tu plantilla de EmailJS coincidan con: from_name, from_email, country, phone, message.';
        } else if (error.status === 401) {
            errorMessage += 'Verifica tu Public Key en la configuración.';
        } else if (error.status === 404) {
            errorMessage += 'Verifica tu Service ID y Template ID en la configuración.';
        } else {
            errorMessage += 'Por favor, intenta nuevamente.';
        }
        
        showMessage(errorMessage, 'error');
    } finally {
        setLoading(false);
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service__card, .step, .about__content, .about__image, .benefit, .about__quote'
    );

    // Agregar clase y delays variables para animaciones más orgánicas
    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        // Delay variable con pequeña aleatoriedad para sentirse más natural
        const baseDelay = index * 0.08;
        const randomOffset = Math.random() * 0.05;
        el.style.setProperty('--animation-delay', `${baseDelay + randomOffset}s`);
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Pequeño delay antes de animar para sentirse más natural
                    const delay = parseFloat(
                        getComputedStyle(entry.target).getPropertyValue('--animation-delay')
                    ) * 1000 || 0;

                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        }
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===== Active Navigation Link =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initEmailJS();
    initScrollAnimations();
    handleScroll();
    updateActiveNavLink();
    
    // Initialize butterfly scroll animation
    handleButterflyScroll();
    
    // Initialize floating CTA button
    initFloatingCta();
});

// ===== Accessibility: Reduce motion =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
