let portfolioData = null;
document.addEventListener('DOMContentLoaded', function() {
  initPreloader();
  initMobileMenu();
  initStickyNavbar();
  initActiveNavLinks();
  initTypingAnimation();
  initSkillAnimations();
  initBackToTop();
  initSmoothScrolling();
  initProjectFilters();
  initProjectModals();
  initForms();
  initCurrentYear();
  initResumeViewer();
  initSocialLinks();
  initParticlesJS();
  initScrollAnimations();
  initThemeEffects();
  initNewsletterForm();
  initAOS();
  initStickyNavbar();
  initAdminButton();
  // Load dynamic content
  setupPortfolioUpdates();
  loadContent();
});
// ======================
// INITIALIZATION FUNCTIONS
// ======================
function initAdminButton() {
  const adminBtn = document.getElementById('adminBtn');
  if (!adminBtn) return;

  adminBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Show the admin access section
    const adminAccess = document.getElementById('admin-access');
    adminAccess.classList.remove('hidden');
    
    // Focus the first password field
    document.getElementById('first-password').focus();
  });

  // First verification step
  document.getElementById('verify-step1').addEventListener('click', verifyFirstStep);
  document.getElementById('first-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verifyFirstStep();
  });

  // Second verification step
  document.getElementById('verify-step2').addEventListener('click', verifySecondStep);
  document.getElementById('second-password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') verifySecondStep();
  });
}

function verifyFirstStep() {
  const input = document.getElementById('first-password');
  const error = document.getElementById('step1-error');
  
  if (input.value === "admin123") {
    // Hide first step, show second step
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    document.getElementById('second-password').focus();
    error.classList.add('hidden');
  } else {
    error.textContent = "Incorrect password, please try again";
    error.classList.remove('hidden');
    input.value = '';
    input.focus();
  }
}

// Resume handling functionality
function initResumeViewer() {
    const viewResumeBtn = document.getElementById('view-resume');
    if (!viewResumeBtn) return;

    viewResumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if resume exists in localStorage
        const resumeData = localStorage.getItem('portfolioResume');
        
        if (resumeData) {
            // Open the PDF in a new tab
            const pdfWindow = window.open();
            pdfWindow.document.write(`
                <iframe 
                    src="${resumeData}" 
                    style="width:100%; height:100vh; border:none;"
                    title="Resume PDF"
                ></iframe>
            `);
        } else {
            // Fallback to default resume if no uploaded resume exists
            window.open('documents/resume.pdf', '_blank');
        }
    });

    // Listen for resume updates from admin page
    window.addEventListener('message', function(e) {
        if (e.data.type === 'RESUME_UPDATE') {
            // You could update UI to show resume is available
            console.log('Resume was updated:', e.data.fileName);
        }
    });
}


function verifySecondStep() {
  const input = document.getElementById('second-password');
  const error = document.getElementById('step2-error');
  
  if (input.value === "secure456") {
    // Both verifications passed - open admin page
    window.open('admin/edit.html', '_blank');
    
    // Reset the form
    document.getElementById('admin-access').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('first-password').value = '';
    document.getElementById('second-password').value = '';
    error.classList.add('hidden');
  } else {
    error.textContent = "Incorrect password, please try again";
    error.classList.remove('hidden');
    input.value = '';
    input.focus();
  }
}

function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Hide preloader when all assets are loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    // Initialize animations after preloader is gone
                    initScrollAnimations();
                }, 500);
            }, 500);
        });
    }
}



function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarLinks = document.querySelector('.navbar-links');

    if (menuToggle && navbarLinks) {
        menuToggle.addEventListener('click', function() {
            navbarLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.addEventListener('click', () => {
                navbarLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function initActiveNavLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-links a');

    if (sections.length && navLinks.length) {
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= sectionTop - 300) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const messageDiv = this.nextElementSibling; // Assuming message div is next sibling
        
        // Simple validation
        if (!validateEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address', 'error');
            return;
        }

        try {
            // Show loading state
            showMessage(messageDiv, 'Subscribing...', 'loading');
            
            // Simulate API call (replace with actual API call)
            const success = await subscribeToNewsletter(email);
            
            if (success) {
                showMessage(messageDiv, 'Thank you for subscribing!', 'success');
                emailInput.value = ''; // Clear input
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                    messageDiv.textContent = '';
                }, 3000);
            } else {
                showMessage(messageDiv, 'Subscription failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showMessage(messageDiv, 'An error occurred. Please try again later.', 'error');
        }
    });
}

// Helper function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Helper function to show messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'newsletter-message ' + type;
}

// Simulate API call (replace with real implementation)
function subscribeToNewsletter(email) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // In a real app, you would make an actual API call here
            console.log('Subscribing email:', email);
            resolve(true); // Simulate success
        }, 1000);
    });
}

// Add this to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... other initializations
    initNewsletterForm();
});

function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new Typed(typingElement, {
            strings: [
                'Machine Learning Specialist',
                'Robotics Engineer',
                'AI/DS Expert',
                'Full-Stack Developer'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            backDelay: 1500,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

async function subscribeToNewsletter(email) {
    try {
        const response = await fetch('https://your-api-endpoint.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error('Subscription failed');
        }
        
        return true;
    } catch (error) {
        console.error('Subscription error:', error);
        return false;
    }
}

function showMessage(element, message, type) {
    // If you're using your existing toast system
    showToast(message, type);
    
    // Or if you want to use the inline message div
    element.textContent = message;
    element.className = 'newsletter-message ' + type;
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const items = document.querySelectorAll('.project-item, .skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
    items.forEach(item => observer.observe(item));
} 

function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom'
        });
    }
}


function initBackToTop() {
    const backToTopBtn = document.querySelector('#backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}
// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}


function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.dataset.filter.toLowerCase();

            projectItems.forEach(item => {
                const tags = item.dataset.tags ? 
                    JSON.parse(item.dataset.tags).map(tag => tag.toLowerCase()) : [];
                
                const shouldShow = filterValue === 'all' || 
                                 tags.some(tag => tag.includes(filterValue));

                item.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                }
            });
        });
    });
}

function updatePersonalInfo() {
    if (!portfolioData?.personalInfo) return;
    
    const info = portfolioData.personalInfo;
    const elements = {
        'hero-title': info.name,
        'hero-subtitle': info.title,
        'about-description': info.description,
        'about-name': info.name,
        'about-degree': info.degree,
        'about-email': info.email,
        'about-location': info.location,
        'contact-email': info.email,
        'contact-phone': info.phone,
        'contact-location': info.location
    };

    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) element.textContent = value || '';
    }
}
// In main.js
function initProjectModals() {
    // Create modal element if it doesn't exist
    let modal = document.querySelector('.project-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h3 class="modal-title"></h3>
                <div class="modal-description"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Add click event to all view buttons
    document.querySelectorAll('.view-desc-btn').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.dataset.title;
            const description = this.dataset.description;

            // Update modal content - make sure to set both title and description
            const modalTitle = modal.querySelector('.modal-title');
            const modalDesc = modal.querySelector('.modal-description');
            
            modalTitle.textContent = title;
            modalDesc.textContent = description;

            // Show modal
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        });
    });

    // Close modal when clicking close button
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });

    // Close modal when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });
}
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                showToast('Please fill in all required fields', 'error');
                return;
            }

            // Here you would typically send the form data to a server
            // For demonstration, we'll simulate an API call
            simulateFormSubmission()
                .then(() => {
                    showToast(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`, 'success');
                    contactForm.reset();
                })
                .catch(() => {
                    showToast('There was an error sending your message. Please try again.', 'error');
                });
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = this.querySelector('input[type="email"]').value;

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            // Simulate subscription
            simulateNewsletterSubscription(email)
                .then(() => {
                    showToast(`Thank you for subscribing with ${email}!`, 'success');
                    this.reset();
                })
                .catch(() => {
                    showToast('Subscription failed. Please try again.', 'error');
                });
        });
    }
}

function initCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}


async function loadDefaultPortfolioData() {
    try {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error loading default portfolio data:', error);
        return getFallbackData();
    }
}

function getFallbackData() {
    return {
        personalInfo: {
            name: "Alex Tech",
            title: "Machine Learning & Full-Stack Specialist",
            email: "alex@techportfolio.com",
            phone: "+1 (555) 123-4567",
            location: "San Francisco, CA",
            description: "Passionate about creating intelligent systems and beautiful web experiences."
        },
        experience: [],
        education: [],
        skills: []
    };
}


function initSocialLinks() {
    // Add click tracking for social links
    document.querySelectorAll('.about-social a, .contact-social a, .footer-social a').forEach(link => {
        link.addEventListener('click', function(e) {
            // In a real app, you might track these clicks with analytics
            console.log(`Social link clicked: ${this.href}`);
        });
    });
}

function initParticlesJS() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#6c63ff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#6c63ff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: false, straight: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// ======================
// CONTENT LOADING FUNCTIONS
// ======================

function loadContent() {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        const data = JSON.parse(savedData);
        renderProjects(data.projects);
        renderExperience(data.experience);
        renderEducation(data.education);
        updatePersonalInfo(data.personalInfo);
    } else {
        // Fallback to loading from JSON file
        loadProjects();
        loadExperience();
        loadEducation();
    }
}


function updatePersonalInfo(info) {
    document.querySelector('.about-text h3').textContent = info.title;
    document.querySelector('.about-text p').textContent = info.description;
    // Update other personal info fields as needed
}



function loadContent() {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
        portfolioData = JSON.parse(savedData);
        renderAllSections();
    } else {
        // Fallback to loading from JSON file
        fetch('data/portfolio.json')
            .then(response => response.json())
            .then(data => {
                portfolioData = data;
                renderAllSections();
            })
            .catch(error => {
                console.error('Error loading portfolio data:', error);
                showToast('Failed to load portfolio data', 'error');
            });
    }
}



function renderAllSections() {
    if (!portfolioData) return;
    
    renderProjects();
    renderExperience();
    renderEducation();
    updatePersonalInfo();
}

// In the renderProjects function in main.js
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !portfolioData?.projects) return;

    projectsGrid.innerHTML = '';
    
    portfolioData.projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.dataset.tags = JSON.stringify(project.tags || []);
        
        projectItem.innerHTML = `
            <img src="${project.image || 'images/default-project.jpg'}" alt="${project.title || 'Project'}" class="project-img">
            <div class="project-info">
                <h3>${project.title || 'Project Title'}</h3>
                <p class="project-short-desc">${project.shortDescription || 'Project short description'}</p>
                <div class="project-tags">
                    ${(project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button class="view-desc-btn" data-description="${project.description || 'No description available'}">
                        View Details
                    </button>
                    ${project.links?.demo ? `<a href="${project.links.demo}" target="_blank" class="demo-btn">Demo</a>` : ''}
                    ${project.links?.code ? `<a href="${project.links.code}" target="_blank" class="code-btn">Code</a>` : ''}
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectItem);
    });

    // Initialize the project modals after rendering
    initProjectModals();
    initProjectFilters();
}

function renderExperience() {
    const container = document.getElementById('experience-items');
    if (!container || !portfolioData?.experience) return;

    container.innerHTML = '';
    
    portfolioData.experience.forEach((exp, index) => {
        const expItem = document.createElement('div');
        expItem.className = 'timeline-item';
        expItem.dataset.aos = 'fade-up';
        expItem.dataset.aosDelay = index * 100;
        
        expItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-logo">
                    <img src="${exp.logo || 'images/default-exp-logo.png'}" alt="${exp.company || 'Company'}">
                </div>
                <h3>${exp.position || 'Position'}</h3>
                <span class="timeline-company">${exp.company || 'Company'}</span>
                <span class="timeline-date">${exp.date || 'Date'}</span>
                <p class="timeline-description">${exp.description || 'Description'}</p>
            </div>
        `;
        
        container.appendChild(expItem);
    });
}

function renderEducation() {
    const container = document.getElementById('education-items');
    if (!container || !portfolioData?.education) return;

    container.innerHTML = '';
    
    portfolioData.education.forEach((edu, index) => {
        const eduItem = document.createElement('div');
        eduItem.className = 'timeline-item';
        eduItem.dataset.aos = 'fade-up';
        eduItem.dataset.aosDelay = index * 100;
        
        eduItem.innerHTML = `
            <div class="timeline-content">
                <div class="timeline-logo">
                    <img src="${edu.logo || 'images/default-edu-logo.png'}" alt="${edu.institution || 'Institution'}">
                </div>
                <h3>${edu.degree || 'Degree'}</h3>
                <span class="timeline-institution">${edu.institution || 'Institution'}</span>
                <span class="timeline-date">${edu.date || 'Date'}</span>
                ${edu.grade ? `<p class="timeline-grade">Grade: ${edu.grade}</p>` : ''}
                <p class="timeline-description">${edu.description || 'Description'}</p>
            </div>
        `;
        
        container.appendChild(eduItem);
    });
}

function updatePersonalInfo() {
    if (!portfolioData?.personalInfo) return;
    
    const info = portfolioData.personalInfo;
    
    // Update hero section
    document.querySelector('.hero-title span').textContent = info.name || '';
    document.querySelector('.hero-subtitle .typing-text').textContent = info.title || '';
    
    // Update about section
    const aboutDesc = document.getElementById('about-description');
    const aboutName = document.getElementById('about-name');
    const aboutDegree = document.getElementById('about-degree');
    const aboutEmail = document.getElementById('about-email');
    const aboutLocation = document.getElementById('about-location');
    
    if (aboutDesc) aboutDesc.textContent = info.description || '';
    if (aboutName) aboutName.textContent = info.name || '';
    if (aboutDegree) aboutDegree.textContent = info.degree || '';
    if (aboutEmail) aboutEmail.textContent = info.email || '';
    if (aboutLocation) aboutLocation.textContent = info.location || '';
    
    // Update contact section
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contactLocation = document.getElementById('contact-location');
    
    if (contactEmail) contactEmail.textContent = info.email || '';
    if (contactPhone) contactPhone.textContent = info.phone || '';
    if (contactLocation) contactLocation.textContent = info.location || '';
}

// Add this to initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Existing initialization code...
    loadContent();
    
    // Listen for updates from admin page
    window.addEventListener('storage', function(e) {
        if (e.key === 'portfolioData') {
            portfolioData = JSON.parse(e.newValue);
            renderAllSections();
        }
    });

    window.addEventListener('message', function(e) {
        if (e.data.type === 'PORTFOLIO_UPDATE') {
            portfolioData = e.data.data;
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
            renderAllSections();
        }
    });
});

// ======================
// HELPER FUNCTIONS
// ======================

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1500);
    });
}

function simulateNewsletterSubscription(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}
// Add this at the end of main.js
function setupPortfolioUpdates() {
    // Listen for storage events (for when edit page is in a separate tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'shouldReload') {
            loadContent(); // Reload all dynamic content
            localStorage.removeItem('shouldReload');
        }
    });

    // Listen for messages (for when edit page is in a popup)
    window.addEventListener('message', function(e) {
        if (e.data.type === 'PORTFOLIO_UPDATE') {
            updatePortfolio(e.data.data);
        }
    });
}

function updatePortfolio(data) {
    // Update localStorage
    localStorage.setItem('portfolioData', JSON.stringify(data));
    
    // Reload all dynamic content
    loadContent();
}

// Call this in your DOMContentLoaded event


