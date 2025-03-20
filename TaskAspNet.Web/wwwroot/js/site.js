    // Global modal handler
document.addEventListener("DOMContentLoaded", function () {
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "flex";
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    };

    // Open any modal with [data-modal="modalId"]
    document.querySelectorAll("[data-modal]").forEach(button => {
        button.addEventListener("click", function () {
            const modalId = this.getAttribute("data-modal");
            openModal(modalId);
        });
    });

   
    document.querySelectorAll(".close-modal").forEach(button => {
        button.addEventListener("click", function () {
            const modal = this.closest(".upload-modal-overlay, .modal-overlay");
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("upload-modal-overlay") || event.target.classList.contains("modal-overlay")) {
            closeModal(event.target.id);
        }
    });
});
