// Language switcher functionality
document.addEventListener('DOMContentLoaded', function() {
    // Default language
    let currentLang = localStorage.getItem('preferredLanguage') || 'zh';
    
    // Load the language file
    loadLanguage(currentLang);
    
    // Set up language switcher
    document.querySelectorAll('.language-switcher').forEach(switcher => {
        switcher.addEventListener('change', function(e) {
            const newLang = e.target.value;
            loadLanguage(newLang);
            localStorage.setItem('preferredLanguage', newLang);
        });
    });

    // Initialize language dropdown
    updateLanguageDropdown(currentLang);
});

// Load language file and update UI
function loadLanguage(lang) {
    fetch(`/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            document.documentElement.lang = lang;
            updateContent(data);
            updateLanguageDropdown(lang);
        })
        .catch(error => console.error('Error loading language file:', error));
}

// Update all content with the loaded language
function updateContent(data) {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = data;
        
        // Traverse the JSON object using the keys
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        // Update element content if value is found
        if (value !== null) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.placeholder = value;
                } else {
                    element.value = value;
                }
            } else {
                element.textContent = value;
            }
        }
    });
    
    // Update elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const keys = element.getAttribute('data-i18n-placeholder').split('.');
        let value = data;
        
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value !== null) {
            element.placeholder = value;
        }
    });
    
    // Update elements with data-i18n-src (for images)
    document.querySelectorAll('[data-i18n-src]').forEach(element => {
        const keys = element.getAttribute('data-i18n-src').split('.');
        let value = data;
        
        for (const key of keys) {
            if (value && key in value) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value !== null) {
            element.src = value;
        }
    });
}

// Update language dropdown selection
function updateLanguageDropdown(lang) {
    document.querySelectorAll('.language-switcher').forEach(select => {
        select.value = lang;
    });
}