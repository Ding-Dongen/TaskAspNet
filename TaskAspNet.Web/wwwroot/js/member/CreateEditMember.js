document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("btnOpenCreateModal");
    const modal = document.getElementById("createMemberModal");

    // Open the modal
    if (openModalBtn && modal) {
        openModalBtn.addEventListener("click", function () {
            openModal("createMemberModal");
        });
    }
    // add phone and address
    initializeAddressAndPhoneHandlers();
    initializeImageModalHandlers();
});

function initializeAddressAndPhoneHandlers() {
    // Address handlers
    document.querySelectorAll('.btn-add-address').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            addAddress(type);
        });
    });

    // Phone handlers
    document.querySelectorAll('.btn-add-phone').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            addPhone(type);
        });
    });
}

function addAddress(type) {
    const container = document.getElementById("addressesContainer");
    const index = container.querySelectorAll(".address-block").length;

    const html = `
        <div class="address-block" data-type="${type}">
            <div class="address-header">
                <span class="address-type">${type}</span>
                <button type="button" class="btn-remove" onclick="removeThis(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <input type="hidden" name="Addresses[${index}].AddressType" value="${type}" />
            <div class="form-row">
                <input name="Addresses[${index}].Address" class="form-control" placeholder="Street Address" />
            </div>
            <div class="form-row">
                <input name="Addresses[${index}].ZipCode" class="form-control" placeholder="Zip Code" />
            </div>
            <div class="form-row">
                <input name="Addresses[${index}].City" class="form-control" placeholder="City" />
            </div>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
}

function addPhone(type) {
    const container = document.getElementById("phonesContainer");
    const index = container.querySelectorAll(".phone-block").length;

    const html = `
        <div class="phone-block" data-type="${type}">
            <div class="phone-header">
                <span class="phone-type">${type}</span>
                <button type="button" class="btn-remove" onclick="removeThis(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <input type="hidden" name="Phones[${index}].PhoneType" value="${type}" />
            <div class="form-row">
                <input name="Phones[${index}].Phone" class="form-control" placeholder="Phone Number" />
            </div>
        </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
}

function removeThis(button) {
    button.closest(".address-block, .phone-block")?.remove();
}

/*Edit member modal*/
function openEditModal(memberId) {
    // 1. Make an AJAX/fetch call to retrieve the Edit form
    fetch(`/Member/Edit/${memberId}`, {
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
            // 2. Load the returned HTML into #editMemberContainer
            document.getElementById("editMemberContainer").innerHTML = html;

            // 3. Show the modal
            openModal("editMemberModal");

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

// -- OPEN UPLOAD MODAL --
const openUploadModalBtn = document.getElementById("openUploadModal");
const uploadModal = document.getElementById("uploadModal");
const closeModalBtn = uploadModal?.querySelector(".close-modal");

if (openUploadModalBtn && uploadModal) {
    openUploadModalBtn.addEventListener("click", function () {
        uploadModal.style.display = "flex";
    });
}

// -- CLOSE MODAL WITH 'X' --
if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
        uploadModal.style.display = "none";
    });
}

// -- CLOSE MODAL WHEN CLICKING OUTSIDE --
window.addEventListener("click", function (event) {
    if (event.target === uploadModal) {
        uploadModal.style.display = "none";
    }
});

// -- CHOOSE FILE & PREVIEW --
const triggerFileInput = document.getElementById("triggerFileInput");
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const hiddenCurrentImage = document.getElementById("hiddenCurrentImage");
const hiddenSelectedImage = document.getElementById("hiddenSelectedImage");

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
                    hiddenCurrentImage.value = ""; // Clear current image when uploading new one
                }
                if (hiddenSelectedImage) {
                    hiddenSelectedImage.value = ""; // Clear selected image when uploading new one
                }
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
}

// -- SELECT PREDEFINED IMAGE --
const selectImage = document.getElementById("selectImage");
if (selectImage && imagePreview) {
    selectImage.addEventListener("change", function () {
        const selected = this.value;
        if (selected) {
            imagePreview.src = "/images/membericon/" + selected;
            if (hiddenSelectedImage) {
                hiddenSelectedImage.value = selected;
            }
            if (hiddenCurrentImage) {
                hiddenCurrentImage.value = ""; // Clear current image when selecting predefined
            }
            // Clear file input when selecting predefined image
            if (fileInput) {
                fileInput.value = "";
            }
        }
    });
}

// -- SAVE SELECTION (updates the main preview) --
const saveBtn = document.getElementById("saveImageSelection");
if (saveBtn && imagePreview) {
    saveBtn.addEventListener("click", function () {
        const chosenSrc = imagePreview.src;
        const cameraPreview = document.getElementById("cameraPreview");

        if (cameraPreview) {
            cameraPreview.src = chosenSrc;
        }

        // Update hidden fields based on selection type
        if (hiddenCurrentImage) {
            if (chosenSrc.startsWith("data:")) {
                // For uploaded files (data URLs)
                hiddenCurrentImage.value = chosenSrc;
                if (hiddenSelectedImage) {
                    hiddenSelectedImage.value = "";
                }
            } else if (chosenSrc.includes("/membericon/")) {
                // For predefined images
                hiddenCurrentImage.value = chosenSrc;
                if (hiddenSelectedImage) {
                    hiddenSelectedImage.value = chosenSrc.split("/membericon/")[1];
                }
            }
        }

        // Close modal
        if (uploadModal) {
            uploadModal.style.display = "none";
        }
    });
}

///*Create Project modal*/
//document.addEventListener("DOMContentLoaded", function () {
//    const openModalBtn = document.getElementById("btnOpenCreateModal");
//    const modal = document.getElementById("createProjectModal");

//    // Open the modal
//    openModalBtn.addEventListener("click", function () {
//        modal.style.display = "block";
//    });

//    // Close the modal (global function for close button)
//    window.closeModal = function () {
//        modal.style.display = "none";
//    };

//    // Close modal when clicking outside
//    window.addEventListener("click", function (event) {
//        if (event.target === modal) {
//            modal.style.display = "none";
//        }
//    });
//});

///*Edit project modal*/
//function openEditModal(projectId) {
//    // 1. Make an AJAX/fetch call to retrieve the Edit form
//    fetch(`/Project/Edit/${projectId}`, {
//        method: "GET",
//        headers: {
//            "X-Requested-With": "XMLHttpRequest"
//        }
//    })
//        .then(response => {
//            if (!response.ok) {
//                throw new Error("Network response was not OK");
//            }
//            return response.text();
//        })
//        .then(html => {
//            // 2. Load the returned HTML into #editProjectContainer
//            document.getElementById("editProjectContainer").innerHTML = html;

//            // 3. Show the modal
//            const editProjectModal = document.getElementById("editProjectModal");
//            editProjectModal.style.display = "flex";

//            // 4. Initialize modal handlers for the edit form
//            initializeImageModalHandlers();
//        })
//        .catch(error => {
//            console.error("Failed to load edit form:", error);
//        });
//}

//// Optionally close the edit modal
//function closeEditModal() {
//    const editProjectModal = document.getElementById("editProjectModal");
//    editProjectModal.style.display = "none";
//}

///*Create Project modal add members search*/

//document.addEventListener("DOMContentLoaded", () => {
//    const memberSearchInput = document.getElementById("memberSearchInput");
//    const memberSearchResults = document.getElementById("memberSearchResults");
//    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
//    const memberInputsContainer = document.getElementById("memberInputsContainer");

//    if (!memberSearchInput) return;

//    memberSearchInput.addEventListener("input", async () => {
//        const query = memberSearchInput.value.trim();

//        if (query.length < 2) {
//            memberSearchResults.innerHTML = "";
//            return;
//        }

//        try {
//            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
//            if (!response.ok) {
//                console.error("Member search failed:", response.status);
//                return;
//            }

//            const members = await response.json();
//            memberSearchResults.innerHTML = "";

//            members.forEach(member => {
//                const li = document.createElement("li");
//                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
//                li.classList.add("search-result");

//                li.addEventListener("click", () => {
//                    addMemberAsChip(member);
//                });

//                memberSearchResults.appendChild(li);
//            });
//        } catch (err) {
//            console.error("Error searching members:", err);
//        }
//    });

//    function addMemberAsChip(member) {
//        const hiddenInput = document.createElement("input");
//        hiddenInput.type = "hidden";
//        hiddenInput.name = "SelectedMemberIds";
//        hiddenInput.value = member.id.toString();
//        memberInputsContainer.appendChild(hiddenInput);

//        const chip = document.createElement("span");
//        chip.className = "chip";
//        chip.textContent = `${member.firstName} ${member.lastName}`;

//        const removeX = document.createElement("span");
//        removeX.className = "remove-x";
//        removeX.textContent = "x";
//        removeX.addEventListener("click", () => {
//            memberInputsContainer.removeChild(hiddenInput);
//            selectedChipsContainer.removeChild(chip);
//        });

//        chip.appendChild(removeX);
//        selectedChipsContainer.appendChild(chip);

//        memberSearchInput.value = "";
//        memberSearchResults.innerHTML = "";
//    }
//});

///*Create Project modal add members search*/

//document.addEventListener("DOMContentLoaded", () => {
//    const memberSearchInput = document.getElementById("memberSearchInput");
//    const memberSearchResults = document.getElementById("memberSearchResults");
//    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
//    const memberInputsContainer = document.getElementById("memberInputsContainer");

//    if (!memberSearchInput) return;

//    memberSearchInput.addEventListener("input", async () => {
//        const query = memberSearchInput.value.trim();

//        if (query.length < 2) {
//            memberSearchResults.innerHTML = "";
//            return;
//        }

//        try {
//            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
//            if (!response.ok) {
//                console.error("Member search failed:", response.status);
//                return;
//            }

//            const members = await response.json();
//            memberSearchResults.innerHTML = "";

//            members.forEach(member => {
//                const li = document.createElement("li");
//                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
//                li.classList.add("search-result");

//                li.addEventListener("click", () => {
//                    addMemberAsChip(member);
//                });

//                memberSearchResults.appendChild(li);
//            });
//        } catch (err) {
//            console.error("Error searching members:", err);
//        }
//    });

//    function addMemberAsChip(member) {
//        const hiddenInput = document.createElement("input");
//        hiddenInput.type = "hidden";
//        hiddenInput.name = "SelectedMemberIds";
//        hiddenInput.value = member.id.toString();
//        memberInputsContainer.appendChild(hiddenInput);

//        const chip = document.createElement("span");
//        chip.className = "chip";
//        chip.textContent = `${member.firstName} ${member.lastName}`;

//        const removeX = document.createElement("span");
//        removeX.className = "remove-x";
//        removeX.textContent = "x";
//        removeX.addEventListener("click", () => {
//            memberInputsContainer.removeChild(hiddenInput);
//            selectedChipsContainer.removeChild(chip);
//        });

//        chip.appendChild(removeX);
//        selectedChipsContainer.appendChild(chip);

//        memberSearchInput.value = "";
//        memberSearchResults.innerHTML = "";
//    }
//});

///*Create Project modal add members search*/

//document.addEventListener("DOMContentLoaded", () => {
//    const memberSearchInput = document.getElementById("memberSearchInput");
//    const memberSearchResults = document.getElementById("memberSearchResults");
//    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
//    const memberInputsContainer = document.getElementById("memberInputsContainer");

//    if (!memberSearchInput) return;

//    memberSearchInput.addEventListener("input", async () => {
//        const query = memberSearchInput.value.trim();

//        if (query.length < 2) {
//            memberSearchResults.innerHTML = "";
//            return;
//        }

//        try {
//            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
//            if (!response.ok) {
//                console.error("Member search failed:", response.status);
//                return;
//            }

//            const members = await response.json();
//            memberSearchResults.innerHTML = "";

//            members.forEach(member => {
//                const li = document.createElement("li");
//                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
//                li.classList.add("search-result");

//                li.addEventListener("click", () => {
//                    addMemberAsChip(member);
//                });

//                memberSearchResults.appendChild(li);
//            });
//        } catch (err) {
//            console.error("Error searching members:", err);
//        }
//    });

//    function addMemberAsChip(member) {
//        const hiddenInput = document.createElement("input");
//        hiddenInput.type = "hidden";
//        hiddenInput.name = "SelectedMemberIds";
//        hiddenInput.value = member.id.toString();
//        memberInputsContainer.appendChild(hiddenInput);

//        const chip = document.createElement("span");
//        chip.className = "chip";
//        chip.textContent = `${member.firstName} ${member.lastName}`;

//        const removeX = document.createElement("span");
//        removeX.className = "remove-x";
//        removeX.textContent = "x";
//        removeX.addEventListener("click", () => {
//            memberInputsContainer.removeChild(hiddenInput);
//            selectedChipsContainer.removeChild(chip);
//        });

//        chip.appendChild(removeX);
//        selectedChipsContainer.appendChild(chip);

//        memberSearchInput.value = "";
//        memberSearchResults.innerHTML = "";
//    }
//});

///*Create Project modal add members search*/

//document.addEventListener("DOMContentLoaded", () => {
//    const memberSearchInput = document.getElementById("memberSearchInput");
//    const memberSearchResults = document.getElementById("memberSearchResults");
//    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
//    const memberInputsContainer = document.getElementById("memberInputsContainer");

//    if (!memberSearchInput) return;

//    memberSearchInput.addEventListener("input", async () => {
//        const query = memberSearchInput.value.trim();

//        if (query.length < 2) {
//            memberSearchResults.innerHTML = "";
//            return;
//        }

//        try {
//            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
//            if (!response.ok) {
//                console.error("Member search failed:", response.status);
//                return;
//            }

//            const members = await response.json();
//            memberSearchResults.innerHTML = "";

//            members.forEach(member => {
//                const li = document.createElement("li");
//                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
//                li.classList.add("search-result");

//                li.addEventListener("click", () => {
//                    addMemberAsChip(member);
//                });

//                memberSearchResults.appendChild(li);
//            });
//        } catch (err) {
//            console.error("Error searching members:", err);
//        }
//    });

//    function addMemberAsChip(member) {
//        const hiddenInput = document.createElement("input");
//        hiddenInput.type = "hidden";
//        hiddenInput.name = "SelectedMemberIds";
//        hiddenInput.value = member.id.toString();
//        memberInputsContainer.appendChild(hiddenInput);

//        const chip = document.createElement("span");
//        chip.className = "chip";
//        chip.textContent = `${member.firstName} ${member.lastName}`;

//        const removeX = document.createElement("span");
//        removeX.className = "remove-x";
//        removeX.textContent = "x";
//        removeX.addEventListener("click", () => {
//            memberInputsContainer.removeChild(hiddenInput);
//            selectedChipsContainer.removeChild(chip);
//        });

//        chip.appendChild(removeX);
//        selectedChipsContainer.appendChild(chip);

//        memberSearchInput.value = "";
//        memberSearchResults.innerHTML = "";
//    }
//});

///*Create Project modal add members search*/

//document.addEventListener("DOMContentLoaded", () => {
//    const memberSearchInput = document.getElementById("memberSearchInput");
//    const memberSearchResults = document.getElementById("memberSearchResults");
//    const selectedChipsContainer = document.getElementById("selectedChipsContainer");
//    const memberInputsContainer = document.getElementById("memberInputsContainer");

//    if (!memberSearchInput) return;

//    memberSearchInput.addEventListener("input", async () => {
//        const query = memberSearchInput.value.trim();

//        if (query.length < 2) {
//            memberSearchResults.innerHTML = "";
//            return;
//        }

//        try {
//            const response = await fetch("/Member/Search?term=" + encodeURIComponent(query));
//            if (!response.ok) {
//                console.error("Member search failed:", response.status);
//                return;
//            }

//            const members = await response.json();
//            memberSearchResults.innerHTML = "";

//            members.forEach(member => {
//                const li = document.createElement("li");
//                li.textContent = `${member.firstName} ${member.lastName} (${member.email})`;
//                li.classList.add("search-result");

//                li.addEventListener("click", () => {
//                    addMemberAsChip(member);
//                });

//                memberSearchResults.appendChild(li);
//            });
//        } catch (err) {
//            console.error("Error searching members:", err);
//        }
//    });

//    function addMemberAsChip(member) {
//        const hiddenInput = document.createElement("input");
//        hiddenInput.type = "hidden";
//        hiddenInput.name = "SelectedMemberIds";
//        hiddenInput.value = member.id.toString();
//        memberInputsContainer.appendChild(hiddenInput);

//        const chip = document.createElement("span");
//        chip.className = "chip";
//        chip.textContent = `${member.firstName} ${member.lastName}`;

//        const removeX = document.createElement("span");
//        removeX.className = "remove-x";
//        removeX.textContent = "x";
//        removeX.addEventListener("click", () => {
//            memberInputsContainer.removeChild(hiddenInput);
//            selectedChipsContainer.removeChild(chip);
//        });

//        chip.appendChild(removeX);
//        selectedChipsContainer.appendChild(chip);

//        memberSearchInput.value = "";
//        memberSearchResults.innerHTML = "";
//    }
//});