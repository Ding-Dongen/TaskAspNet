document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("btnOpenCreateModal");
    const modal = document.getElementById("createProjectModal");

    // Open the modal
    if (openModalBtn && modal) {
        openModalBtn.addEventListener("click", function () {
            openModal("createProjectModal");
        });
    }
});

/*Edit project modal*/
function openEditModal(projectId) {
    // 1. Make an AJAX/fetch call to retrieve the Edit form
    fetch(`/Project/Edit/${projectId}`, {
        method: "GET",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            return response.text();
        })
        .then(html => {
            // 2. Load the returned HTML into #editProjectContainer
            document.getElementById("editProjectContainer").innerHTML = html;

            // 3. Show the modal
            openModal("editProjectModal");

            // 4. Initialize modal handlers for the edit form
            initializeImageModalHandlers();
        })
        .catch(error => {
            console.error("Failed to load edit form:", error);
        });
}

// Function to initialize image modal handlers
function initializeImageModalHandlers() {
    const openUploadModalBtn = document.getElementById("openUploadModal");
    const uploadModal = document.getElementById("uploadModal");
    const triggerFileInput = document.getElementById("triggerFileInput");
    const fileInput = document.getElementById("fileInput");
    const imagePreview = document.getElementById("imagePreview");
    const hiddenCurrentImage = document.getElementById("hiddenCurrentImage");
    const hiddenSelectedImage = document.getElementById("hiddenSelectedImage");
    const selectImage = document.getElementById("selectImage");
    const saveBtn = document.getElementById("saveImageSelection");

    // Open modal handler
    if (openUploadModalBtn && uploadModal) {
        openUploadModalBtn.addEventListener("click", function () {
            openModal("uploadModal");
        });
    }

    // File upload handler
    if (triggerFileInput && fileInput && imagePreview) {
        triggerFileInput.addEventListener("click", function () {
            fileInput.click();
        });

        fileInput.addEventListener("change", function () {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imagePreview.src = e.target.result;
                    if (hiddenCurrentImage) {
                        hiddenCurrentImage.value = "";
                    }
                    if (hiddenSelectedImage) {
                        hiddenSelectedImage.value = "";
                    }
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    // Predefined image selection handler
    if (selectImage && imagePreview) {
        selectImage.addEventListener("change", function () {
            const selected = this.value;
            if (selected) {
                imagePreview.src = "/images/predefined/" + selected;
                if (hiddenSelectedImage) {
                    hiddenSelectedImage.value = selected;
                }
                if (hiddenCurrentImage) {
                    hiddenCurrentImage.value = "";
                }
                if (fileInput) {
                    fileInput.value = "";
                }
            }
        });
    }

    // Save selection handler
    if (saveBtn && imagePreview) {
        saveBtn.addEventListener("click", function () {
            const chosenSrc = imagePreview.src;
            const cameraPreview = document.getElementById("cameraPreview");
            
            if (cameraPreview) {
                cameraPreview.src = chosenSrc;
            }

            if (hiddenCurrentImage) {
                if (chosenSrc.startsWith("data:")) {
                    hiddenCurrentImage.value = chosenSrc;
                    if (hiddenSelectedImage) {
                        hiddenSelectedImage.value = "";
                    }
                } else if (chosenSrc.includes("/predefined/")) {
                    hiddenCurrentImage.value = chosenSrc;
                    if (hiddenSelectedImage) {
                        hiddenSelectedImage.value = chosenSrc.split("/predefined/")[1];
                    }
                }
            }

            closeModal("uploadModal");
        });
    }
}

// Initialize handlers for the create form when the page loads
document.addEventListener("DOMContentLoaded", initializeImageModalHandlers);

/*Create Project modal add members search*/

document.addEventListener("DOMContentLoaded", () => {
    const memberSearchInput = document.getElementById("memberSearchInput");
    const memberSearchResults = document.getElementById("memberSearchResults");
    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
    const memberInputsContainer = document.getElementById("memberInputsContainer");

    if (!memberSearchInput) return;

    memberSearchInput.addEventListener("input", async () => {
        const query = memberSearchInput.value.trim();

        if (query.length < 2) {
            memberSearchResults.innerHTML = "";
            return;
        }

        try {
            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
            if (!response.ok) {
                console.error("Member search failed:", response.status);
                return;
            }

            const members = await response.json();
            memberSearchResults.innerHTML = "";

            members.forEach(member => {
                const li = document.createElement("li");
                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
                li.classList.add("search-result");

                li.addEventListener("click", () => {
                    addMemberAsChip(member);
                });

                memberSearchResults.appendChild(li);
            });
        } catch (err) {
            console.error("Error searching members:", err);
        }
    });

    function addMemberAsChip(member) {
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "SelectedMemberIds";
        hiddenInput.value = member.id.toString();
        memberInputsContainer.appendChild(hiddenInput);

        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = `${member.firstName} ${member.lastName}`;

        const removeX = document.createElement("span");
        removeX.className = "remove-x";
        removeX.textContent = "x";
        removeX.addEventListener("click", () => {
            memberInputsContainer.removeChild(hiddenInput);
            selectedChipsContainer.removeChild(chip);
        });

        chip.appendChild(removeX);
        selectedChipsContainer.appendChild(chip);

        memberSearchInput.value = "";
        memberSearchResults.innerHTML = "";
    }
});