
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin features
    setupAddItemButtons();
    setupRemoveButtons();
    setupPortfolioUpdatesListener();
    setupSaveButton();
    setupAdminButton();
    loadDataForEditing();
    setupEventListeners();
});

// ... rest of your existing admin.js functions remain the same ...
function setupRemoveButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const type = e.target.dataset.type;
            const container = document.getElementById(`edit-${type}`);
            
            if (container && confirm(`Are you sure you want to remove this ${type} item?`)) {
                const item = e.target.closest('.edit-item');
                if (item) {
                    item.remove();
                    renumberItems(container, type);
                }
            }
        }
    });
}

function renumberItems(container, type) {
    container.querySelectorAll('.edit-item').forEach((item, index) => {
        const title = item.querySelector('h3');
        if (title) {
            const btn = title.querySelector('button');
            title.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)} ${index + 1} `;
            if (btn) {
                btn.dataset.index = index;
                title.appendChild(btn);
            }
        }
        item.querySelectorAll('[data-index]').forEach(el => {
            el.dataset.index = index;
        });
    });
}

function loadDataForEditing() {
    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(data => {
            populatePersonalInfo(data.personalInfo);
            populateProjects(data.projects);
            populateExperience(data.experience);
            populateEducation(data.education);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            showToast('Error loading data!', true);
            const savedData = localStorage.getItem('portfolioData');
            if (savedData) {
                const data = JSON.parse(savedData);
                populatePersonalInfo(data.personalInfo);
                populateProjects(data.projects);
                populateExperience(data.experience);
                populateEducation(data.education);
            }
        });
}

function populatePersonalInfo(personalInfo) {
    if (!personalInfo) return;
    
    const fields = {
        'edit-name': personalInfo.name,
        'edit-title': personalInfo.title,
        'edit-description': personalInfo.description,
        'edit-email': personalInfo.email,
        'edit-phone': personalInfo.phone,
        'edit-location': personalInfo.location,
        'edit-degree': personalInfo.degree
    };

    for (const [id, value] of Object.entries(fields)) {
        const element = document.getElementById(id);
        if (element) element.value = value || '';
    }
}

function populateProjects(projects) {
    const container = document.getElementById('edit-projects');
    if (!container || !projects) return;

    container.innerHTML = '';
    projects.forEach((project, index) => {
        addProjectToEditor(project, index);
    });
}

function addProjectToEditor(project = {}, index) {
    const container = document.getElementById('edit-projects');
    const projectDiv = document.createElement('div');
    projectDiv.className = 'edit-item';
    projectDiv.dataset.index = index;
    projectDiv.innerHTML = `
        <h3>Project ${index + 1} <button class="btn btn-danger remove-item" data-type="projects" data-index="${index}">Remove</button></h3>
        <div class="form-row">
            <div class="form-group">
                <label>Title</label>
                <input type="text" value="${project.title || ''}" data-field="title" data-index="${index}">
            </div>
            <div class="form-group">
                <label>Short Description</label>
                <input type="text" value="${project.shortDescription || ''}" data-field="shortDescription" data-index="${index}">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea data-field="description" data-index="${index}">${project.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Image URL</label>
            <input type="text" value="${project.image || ''}" data-field="image" data-index="${index}">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Demo Link</label>
                <input type="text" value="${(project.links && project.links.demo) || ''}" data-field="demo" data-index="${index}">
            </div>
            <div class="form-group">
                <label>Code Link</label>
                <input type="text" value="${(project.links && project.links.code) || ''}" data-field="code" data-index="${index}">
            </div>
        </div>
        <div class="form-group">
            <label>Tags (comma separated)</label>
            <input type="text" value="${(project.tags && project.tags.join(', ')) || ''}" data-field="tags" data-index="${index}">
        </div>
        <hr>
    `;
    container.appendChild(projectDiv);
}

function populateExperience(experience) {
    const container = document.getElementById('edit-experience');
    if (!container || !experience) return;

    container.innerHTML = '';
    experience.forEach((exp, index) => {
        addExperienceToForm(exp, index);
    });
}

function addExperienceToForm(exp = {}, index) {
    const container = document.getElementById('edit-experience');
    const expDiv = document.createElement('div');
    expDiv.className = 'edit-item';
    expDiv.dataset.index = index;
    expDiv.innerHTML = `
        <h3>Experience ${index + 1} <button class="btn btn-danger remove-item" data-type="experience" data-index="${index}">Remove</button></h3>
        <!-- Other fields -->
        <div class="form-group">
            <label>Company Logo</label>
            <input type="file" data-field="logo" data-index="${index}" accept="image/*" class="image-upload">
            <div class="image-upload-container">
                ${exp.logo ? `
                    <img src="${exp.logo}" class="preview-image">
                    <div class="image-actions">
                        <button type="button" class="btn btn-secondary save-image-btn" data-type="experience" data-index="${index}">
                            <i class="fas fa-save"></i> Save Image
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="text" value="${exp.date || ''}" data-field="date" data-index="${index}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea data-field="description" data-index="${index}">${exp.description || ''}</textarea>
        </div>
        <hr>
    `;
    container.appendChild(expDiv);
}

function populateEducation(education) {
    const container = document.getElementById('edit-education');
    if (!container || !education) return;

    container.innerHTML = '';
    education.forEach((edu, index) => {
        addEducationToForm(edu, index);
    });
}

function addEducationToForm(edu = {}, index) {
    const container = document.getElementById('edit-education');
    const eduDiv = document.createElement('div');
    eduDiv.className = 'edit-item';
    eduDiv.dataset.index = index;
    eduDiv.innerHTML = `
        <h3>Education ${index + 1} <button class="btn btn-danger remove-item" data-type="education" data-index="${index}">Remove</button></h3>
        <!-- Other fields -->
        <div class="form-group">
            <label>Institution Logo</label>
            <input type="file" data-field="logo" data-index="${index}" accept="image/*" class="image-upload">
            <div class="image-upload-container">
                ${edu.logo ? `
                    <img src="${edu.logo}" class="preview-image">
                    <div class="image-actions">
                        <button type="button" class="btn btn-secondary save-image-btn" data-type="education" data-index="${index}">
                            <i class="fas fa-save"></i> Save Image
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="text" value="${edu.date || ''}" data-field="date" data-index="${index}">
        </div>
        <div class="form-group">
            <label>Grade</label>
            <input type="text" value="${edu.grade || ''}" data-field="grade" data-index="${index}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea data-field="description" data-index="${index}">${edu.description || ''}</textarea>
        </div>
        <hr>
    `;
    container.appendChild(eduDiv);
}

function setupAddItemButtons() {
    document.getElementById('add-project')?.addEventListener('click', () => {
        const container = document.getElementById('edit-projects');
        addProjectToEditor({}, container.querySelectorAll('.edit-item').length);
    });

    document.getElementById('add-experience')?.addEventListener('click', () => {
        const container = document.getElementById('edit-experience');
        addExperienceToForm({}, container.querySelectorAll('.edit-item').length);
    });

    document.getElementById('add-education')?.addEventListener('click', () => {
        const container = document.getElementById('edit-education');
        addEducationToForm({}, container.querySelectorAll('.edit-item').length);
    });
}

function setupSaveButton() {
    const saveBtn = document.getElementById('save-changes');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveChanges);
    }
}

function saveChanges() {
    try {
        const personalInfo = {
            name: document.getElementById('edit-name').value,
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            location: document.getElementById('edit-location').value,
            degree: document.getElementById('edit-degree').value
        };

        const projects = [];
        document.querySelectorAll('#edit-projects .edit-item').forEach(item => {
            projects.push({
                title: item.querySelector('[data-field="title"]').value,
                description: item.querySelector('[data-field="description"]').value,
                shortDescription: item.querySelector('[data-field="shortDescription"]').value,
                image: item.querySelector('[data-field="image"]').value,
                links: {
                    demo: item.querySelector('[data-field="demo"]').value,
                    code: item.querySelector('[data-field="code"]').value
                },
                tags: item.querySelector('[data-field="tags"]').value.split(',').map(tag => tag.trim()).filter(tag => tag)
            });
        });

        const experience = [];
        document.querySelectorAll('#edit-experience .edit-item').forEach(item => {
            const index = item.getAttribute('data-index');
            experience.push({
                position: item.querySelector('[data-field="position"]').value,
                company: item.querySelector('[data-field="company"]').value,
                logo: item.querySelector('.preview-image')?.src || '',
                date: item.querySelector('[data-field="date"]').value,
                description: item.querySelector('[data-field="description"]').value
            });
        });

        const education = [];
        document.querySelectorAll('#edit-education .edit-item').forEach(item => {
            const index = item.getAttribute('data-index');
            education.push({
                degree: item.querySelector('[data-field="degree"]').value,
                institution: item.querySelector('[data-field="institution"]').value,
                logo: item.querySelector('.preview-image')?.src || '',
                date: item.querySelector('[data-field="date"]').value,
                grade: item.querySelector('[data-field="grade"]').value,
                description: item.querySelector('[data-field="description"]').value
            });
        });


        const portfolioData = {
            personalInfo,
            projects,
            experience,
            education
        };

        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'PORTFOLIO_UPDATE',
                data: portfolioData
            }, '*');
        } else {
            localStorage.setItem('shouldReload', 'true');
        }
        
        showToast('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving changes:', error);
        showToast('Error saving changes!', true);
    }
}

function setupPortfolioUpdatesListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'portfolioUpdateTrigger') {
            loadDataForEditing();
        }
    });
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
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
    }, 3000);
}