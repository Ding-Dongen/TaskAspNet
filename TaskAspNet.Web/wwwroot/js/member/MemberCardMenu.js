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
