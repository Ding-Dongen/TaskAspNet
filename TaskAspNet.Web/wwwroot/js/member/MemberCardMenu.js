function toggleMenu(memberId) {
    console.log("Toggle menu triggered for memberId:", memberId); // Debugging
    const overlayId = 'overlay-' + memberId;
    const overlayMenu = document.getElementById(overlayId);
    if (!overlayMenu) {
        console.error("Overlay menu not found:", overlayId);
        return;
    }

    // Hide all other overlay menus
    document.querySelectorAll('.overlay-menu').forEach(menu => {
        if (menu.id !== overlayId) {
            menu.style.display = 'none';
        }
    });

    // Toggle current menu
    overlayMenu.style.display = overlayMenu.style.display === 'block' ? 'none' : 'block';
    console.log("Menu display status:", overlayMenu.style.display);
}


function openEditModal(memberId) {
    // Close the menu
    toggleMenu(memberId);

    // Get modal elements
    const modal = document.getElementById('editMemberModal-' + memberId);
    const container = document.getElementById('editMemberContainer-' + memberId);

    if (!modal || !container) {
        console.error('Modal elements not found for memberId:', memberId);
        return;
    }

    // Fetch the edit form via AJAX
    fetch(`/Member/Edit/${memberId}`)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            modal.style.display = 'block'; // Show modal
        })
        .catch(error => {
            console.error('Error loading edit form:', error);
        });
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.overlay-menu') && !event.target.closest('.dotes')) {
        document.querySelectorAll('.overlay-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Close modal when clicking outside
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('upload-modal-overlay')) {
        event.target.style.display = 'none';
    }
});

// Close modal when clicking the close button
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function () {
        this.closest('.upload-modal-overlay').style.display = 'none';
    });
});
 // dropdown member card member information
function toggleDropdown(memberId) {
    const dropdownContent = document.getElementById(`dropdown-content-${memberId}`);
    const button = event.currentTarget;
    const dropdownText = button.querySelector('.dropdown-text');
    
    if (dropdownContent.style.display === 'none') {
        dropdownContent.style.display = 'block';
        dropdownText.textContent = 'Show Less';
        button.classList.add('active');
        
        // Smooth animation
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
    } else {
        dropdownContent.style.display = 'none';
        dropdownText.textContent = 'Show More Details';
        button.classList.remove('active');
        
        // Reset max height
        dropdownContent.style.maxHeight = null;
    }
}

function openDetailsModal(memberId) {
    // Close the menu
    toggleMenu(memberId);

    // Get modal element
    const modal = document.getElementById('detailsModal-' + memberId);

    if (!modal) {
        console.error('Details modal not found for memberId:', memberId);
        return;
    }

    // Show modal
    modal.style.display = 'block';
}
