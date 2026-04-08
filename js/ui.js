/**
 * UI Rendering and Event Handling Logic
 */
const UI = {
    // Shared Modal logic
    showModal(title, bodyHtml) {
        document.getElementById('modal-body').innerHTML = `
            <div class="modal-details">
                <h2>${title}</h2>
                ${bodyHtml}
            </div>
        `;
        document.getElementById('modal-container').classList.remove('hidden');
    },

    closeModal() {
        document.getElementById('modal-container').classList.add('hidden');
        document.getElementById('modal-body').innerHTML = '';
    },

    async renderTugas() {
        const listContainer = document.getElementById('tugas-list');
        if (!listContainer) return;

        const tasks = await DB.getAllTugas();
        listContainer.innerHTML = '';

        if (tasks.length === 0) {
            listContainer.innerHTML = '<p class="text-center" style="color:var(--text-muted)">Belum ada tugas. Silakan tambahkan tugas baru.</p>';
            return;
        }

        tasks.forEach(task => {
            const el = document.createElement('div');
            el.className = 'tugas-card';
            el.innerHTML = `
                <div class="tugas-info">
                    <h3>${task.judul}</h3>
                    <div class="tugas-meta">
                        <span><i class="fas fa-tag"></i> ${task.kategori}</span> | 
                        <span><i class="fas fa-calendar"></i> ${task.tanggal}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="app.viewTugas('${task.id}')"><i class="fas fa-eye"></i> Lihat</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteTugas('${task.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            listContainer.appendChild(el);
        });
    },

    async renderRangkuman() {
        const listContainer = document.getElementById('rangkuman-list');
        if (!listContainer) return;

        const matari = await DB.getAllRangkuman();
        listContainer.innerHTML = '';

        if (matari.length === 0) {
            listContainer.innerHTML = '<p class="text-center" style="color:var(--text-muted)">Belum ada rangkuman. Silakan tambahkan materi baru.</p>';
            return;
        }

        matari.forEach(m => {
            const el = document.createElement('div');
            el.className = 'rangkuman-card';

            // Limit desc preview
            const descPreview = m.deskripsi.length > 100 ? m.deskripsi.substring(0, 100) + '...' : m.deskripsi;

            el.innerHTML = `
                <div>
                    <h3>${m.judul}</h3>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
                        <span><i class="fas fa-tag"></i> ${m.kategori}</span> | 
                        <span><i class="fas fa-calendar"></i> ${m.tanggal}</span>
                    </div>
                </div>
                <p class="rangkuman-excerpt">${descPreview}</p>
                <div class="card-actions" style="margin-top: 15px;">
                    <button class="btn btn-primary btn-pink btn-sm" onclick="app.viewRangkuman('${m.id}')" style="width: 100%">Baca Lengkap</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteRangkuman('${m.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            listContainer.appendChild(el);
        });
    },

    async renderGallery() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        const images = await DB.getGalleryImages();
        grid.innerHTML = '';

        if (images.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted)">Galeri kosong.</p>';
            return;
        }

        images.forEach(img => {
            const el = document.createElement('div');
            el.className = 'gallery-item';
            el.innerHTML = `
                <img src="${img.dataUrl}" alt="Gallery Image">
                <div class="gallery-actions">
                    <button class="btn btn-primary btn-sm" onclick="app.viewImage('${img.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteImage('${img.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            grid.appendChild(el);
        });
    },

    setupUploadForm() {
        const form = document.getElementById('upload-form');
        const radios = document.querySelectorAll('input[name="entry_type"]');
        const uploadFileGrp = document.getElementById('upload-file-group');
        const inputTextGrp = document.getElementById('input-text-group');

        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('input-file');
        const filePreview = document.getElementById('file-preview');

        let currentFileBase64 = null;
        let currentFileType = null;
        let currentFileName = null;

        // Toggle form fields based on entry type
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'tugas') {
                    uploadFileGrp.classList.remove('hidden');
                    inputTextGrp.classList.add('hidden');
                    document.getElementById('input-deskripsi').removeAttribute('required');
                } else {
                    uploadFileGrp.classList.add('hidden');
                    inputTextGrp.classList.remove('hidden');
                    document.getElementById('input-deskripsi').setAttribute('required', 'true');
                }
            });
        });

        // Basic Drag & Drop / File select logic
        const updateThumbnail = (file) => {
            if (!file) return;
            currentFileName = file.name;
            currentFileType = file.type;

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                currentFileBase64 = reader.result;

                filePreview.classList.remove('hidden');

                if (file.type.startsWith('image/')) {
                    filePreview.innerHTML = `
                        <img src="${reader.result}" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
                        <span style="flex-grow:1; overflow:hidden; text-overflow:ellipsis;">${file.name}</span>
                        <i class="fas fa-check" style="color: green;"></i>
                    `;
                } else if (file.type === 'application/pdf') {
                    filePreview.innerHTML = `
                        <i class="fas fa-file-pdf fa-2x" style="color: #ef5350;"></i>
                        <span style="flex-grow:1; overflow:hidden; text-overflow:ellipsis;">${file.name}</span>
                        <i class="fas fa-check" style="color: green;"></i>
                    `;
                }
            };
        };

        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput.click());

            dropZone.addEventListener('dragover', e => {
                e.preventDefault();
                dropZone.classList.add('drop-zone--over');
            });

            ['dragleave', 'dragend'].forEach(type => {
                dropZone.addEventListener(type, e => dropZone.classList.remove('drop-zone--over'));
            });

            dropZone.addEventListener('drop', e => {
                e.preventDefault();
                dropZone.classList.remove('drop-zone--over');
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    updateThumbnail(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', e => {
                if (fileInput.files.length) {
                    updateThumbnail(fileInput.files[0]);
                }
            });
        }

        // Form Submit
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();
                const type = document.querySelector('input[name="entry_type"]:checked').value;
                const judul = document.getElementById('input-judul').value;
                const kategori = document.getElementById('input-kategori').value;
                const tanggal = document.getElementById('input-tanggal').value;

                if (type === 'tugas') {
                    if (!currentFileBase64 && !app.editingId) {
                        alert('Silakan upload file (PDF/Gambar) terlebih dahulu!');
                        return;
                    }
                    
                    const updateData = { judul, kategori, tanggal };
                    if (app.editingId) updateData.id = app.editingId;
                    
                    if (currentFileBase64) {
                        updateData.fileName = currentFileName;
                        updateData.fileType = currentFileType;
                        updateData.fileData = currentFileBase64;
                    } else if (app.editingId) {
                        // Keep old file if not replaced during edit
                        const oldTugas = await DB.getTugas(app.editingId);
                        if(oldTugas) {
                            updateData.fileName = oldTugas.fileName;
                            updateData.fileType = oldTugas.fileType;
                            updateData.fileData = oldTugas.fileData;
                        }
                    }

                    await DB.saveTugas(updateData);
                    alert(app.editingId ? 'Tugas berhasil diupdate!' : 'Tugas berhasil disimpan!');
                    app.editingId = null;
                    app.navigate('tugas');
                } else {
                    const deskripsi = document.getElementById('input-deskripsi').value;
                    const updateData = { judul, kategori, tanggal, deskripsi };
                    if (app.editingId) updateData.id = app.editingId;

                    await DB.saveRangkuman(updateData);
                    alert(app.editingId ? 'Materi berhasil diupdate!' : 'Materi berhasil disimpan!');
                    app.editingId = null;
                    app.navigate('rangkuman');
                }
            };
        }
    }
};
