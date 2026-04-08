/**
 * Main Application and Router Logic
 */

const app = {
    // Current active route
    currentRoute: 'home',

    // Simple Map of templates
    routes: ['home', 'tugas', 'rangkuman', 'upload', 'camera', 'gallery', 'about'],

    init() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const overlay = document.querySelector('.menu-overlay');

        // Setup navigation events
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);

                // Close mobile menu if open
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        });

        // Hamburger menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }

        // Close menu on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        // Modal Close
        document.querySelector('.modal-close').addEventListener('click', () => {
            UI.closeModal();
        });

        // Close modal on outside click
        document.getElementById('modal-container').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-container')) {
                UI.closeModal();
            }
        });

        // Live Uptime Script
        const updateUptime = () => {
            const upEl = document.getElementById('sys-uptime');
            if (!upEl) return;
            let totalSeconds = Math.floor((new Date() - new Date().setHours(0, 0, 0, 0)) / 1000);
            const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            upEl.innerText = `${hours}:${minutes}:${seconds}`;
        };
        setInterval(updateUptime, 1000);
        updateUptime();

        // Default navigation
        this.navigate('home');
    },

    navigate(route, context = null) {
        if (!this.routes.includes(route)) return;

        // Stop Camera if navigating away
        if (this.currentRoute === 'camera' && typeof CameraTools.stopCamera === 'function') {
            CameraTools.stopCamera();
        }

        this.currentRoute = route;

        // Toggle global effects based on route
        if (route === 'camera') {
            document.body.classList.add('camera-mode-active');
        } else {
            document.body.classList.remove('camera-mode-active');
        }

        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-links a[data-route="${route}"]`)?.classList.add('active');

        // Fetch template
        const template = document.getElementById(`tpl-${route}`);
        const contentArea = document.getElementById('app-content');

        if (template) {
            // Clone template content and append
            contentArea.innerHTML = '';
            contentArea.appendChild(template.content.cloneNode(true));

            // Execute specific logic for the page
            this.runLogicForRoute(route, context);
        }
    },

    runLogicForRoute(route, context = null) {
        switch (route) {
            case 'tugas':
                UI.renderTugas().then(async () => {
                    // Populate categories
                    const tasks = await DB.getAllTugas();
                    const categories = [...new Set(tasks.map(t => t.kategori))];
                    const selCat = document.getElementById('filter-kategori-tugas');
                    if (selCat) {
                        selCat.innerHTML = '<option value="all">Semua Kategori</option>' +
                            categories.map(c => `<option value="${c}">${c}</option>`).join('');
                    }

                    // Combined Filters
                    const applyFilters = () => {
                        const searchVal = document.getElementById('search-tugas')?.value.toLowerCase() || '';
                        const catVal = document.getElementById('filter-kategori-tugas')?.value || 'all';

                        document.querySelectorAll('#tugas-list .tugas-card').forEach(card => {
                            const title = card.querySelector('h3').innerText.toLowerCase();
                            const catText = card.querySelector('.tugas-meta span:nth-child(1)').innerText.trim();

                            const matchSearch = title.includes(searchVal);
                            const matchCat = (catVal === 'all') || (catText === catVal);

                            card.style.display = (matchSearch && matchCat) ? 'flex' : 'none';
                        });
                    };

                    document.getElementById('search-tugas')?.addEventListener('input', applyFilters);
                    document.getElementById('filter-kategori-tugas')?.addEventListener('change', applyFilters);
                });
                break;
            case 'rangkuman':
                UI.renderRangkuman();
                break;
            case 'upload':
                UI.setupUploadForm();
                // Set default date to today
                const dateInput = document.getElementById('input-tanggal');
                if (dateInput) {
                    dateInput.valueAsDate = new Date();
                }

                // Pre-check right radio context
                if (context === 'rangkuman') {
                    const radio = document.querySelector('input[name="entry_type"][value="rangkuman"]');
                    if (radio) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                    }
                }
                break;
            case 'camera':
                CameraTools.init();
                break;
            case 'gallery':
                UI.renderGallery();
                break;
        }
    },

    // ==== ACTIONS ====
    async deleteTugas(id) {
        if (confirm('Hapus tugas ini?')) {
            await DB.deleteTugas(id);
            UI.renderTugas();
        }
    },

    async deleteRangkuman(id) {
        if (confirm('Hapus materi materi ini?')) {
            await DB.deleteRangkuman(id);
            UI.renderRangkuman();
        }
    },

    async editTugas(id) {
        const task = await DB.getTugas(id);
        if (!task) return;
        this.editingId = id;
        this.navigate('upload');

        const radio = document.querySelector('input[name="entry_type"][value="tugas"]');
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));

        document.getElementById('input-judul').value = task.judul;
        document.getElementById('input-kategori').value = task.kategori;
        document.getElementById('input-tanggal').value = task.tanggal;
    },

    async editRangkuman(id) {
        const m = await DB.getRangkuman(id);
        if (!m) return;
        this.editingId = id;
        this.navigate('upload');

        const radio = document.querySelector('input[name="entry_type"][value="rangkuman"]');
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));

        document.getElementById('input-judul').value = m.judul;
        document.getElementById('input-kategori').value = m.kategori;
        document.getElementById('input-tanggal').value = m.tanggal;
        document.getElementById('input-deskripsi').value = m.deskripsi;
    },

    async deleteImage(id) {
        if (confirm('Hapus foto ini dari galeri?')) {
            await DB.deleteGalleryImage(id);
            UI.renderGallery();
        }
    },

    async viewTugas(id) {
        const task = await DB.getTugas(id);
        if (!task) return;

        let fileHtml = '';
        if (task.fileType === 'application/pdf') {
            fileHtml = `
                <div class="file-download-box">
                    <i class="fas fa-file-pdf fa-4x" style="color: #ef5350;"></i>
                    <p style="margin: 10px 0;">${task.fileName}</p>
                    <a href="${task.fileData}" download="${task.fileName}" class="btn btn-primary"><i class="fas fa-download"></i> Download PDF</a>
                </div>
            `;
        } else if (task.fileType.startsWith('image/')) {
            fileHtml = `
                <div style="text-align:center;">
                    <img src="${task.fileData}" class="preview-image">
                    <br><br>
                    <a href="${task.fileData}" download="${task.fileName}" class="btn btn-primary"><i class="fas fa-download"></i> Download Gambar</a>
                </div>
            `;
        }

        const html = `
            <div class="modal-meta">
                Kategori: <strong>${task.kategori}</strong> | Tenggat Waktu: <strong>${task.tanggal}</strong>
            </div>
            ${fileHtml}
        `;
        UI.showModal('Detail Tugas: ' + task.judul, html);
    },

    async viewRangkuman(id) {
        const m = await DB.getRangkuman(id);
        if (!m) return;

        const html = `
            <div class="modal-meta">
                Kategori: <strong>${m.kategori}</strong> | Tanggal: <strong>${m.tanggal}</strong>
            </div>
            <div class="modal-desc">${m.deskripsi}</div>
        `;
        UI.showModal(m.judul, html);
    },

    async viewImage(id) {
        const items = await DB.getGalleryImages();
        const img = items.find(i => i.id === id);
        if (!img) return;

        const dateStr = new Date(img.timestamp).toLocaleString();
        const html = `
            <div class="modal-meta">Diambil: ${dateStr}</div>
            <div style="text-align:center;">
                <img src="${img.dataUrl}" class="preview-image" style="max-height: 70vh;">
                <br><br>
                <a href="${img.dataUrl}" download="foto_${img.timestamp}.jpg" class="btn btn-primary btn-blue"><i class="fas fa-download"></i> Download</a>
            </div>
        `;
        UI.showModal('Preview Foto', html);
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
