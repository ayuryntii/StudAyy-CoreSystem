/**
 * Camera and Image Processing Logic
 */

const CameraState = {
    stream: null,
    cropper: null,
    currentImageB64: null
};

const CameraTools = {
    init() {
        const btnStart = document.getElementById('btn-start-camera');
        const btnCapture = document.getElementById('btn-capture');
        const btnRetake = document.getElementById('btn-retake');
        const btnSave = document.getElementById('btn-save-photo');

        const brightnessInput = document.getElementById('filter-brightness');
        const contrastInput = document.getElementById('filter-contrast');

        if (btnStart) btnStart.addEventListener('click', this.startCamera.bind(this));
        if (btnCapture) btnCapture.addEventListener('click', this.capturePhoto.bind(this));
        if (btnRetake) btnRetake.addEventListener('click', this.resetCamera.bind(this));
        if (btnSave) btnSave.addEventListener('click', this.savePhoto.bind(this));

        if (brightnessInput) brightnessInput.addEventListener('input', this.updateFilters.bind(this));
        if (contrastInput) contrastInput.addEventListener('input', this.updateFilters.bind(this));
    },

    async startCamera() {
        document.getElementById('camera-controls').classList.add('hidden');
        document.getElementById('camera-view').classList.remove('hidden');

        try {
            CameraState.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 } }
            });
            document.getElementById('videoElement').srcObject = CameraState.stream;
        } catch (err) {
            alert('Akses kamera ditolak atau tidak tersedia: ' + err);
            document.getElementById('camera-controls').classList.remove('hidden');
            document.getElementById('camera-view').classList.add('hidden');
        }
    },

    stopCamera() {
        if (CameraState.stream) {
            CameraState.stream.getTracks().forEach(track => track.stop());
            CameraState.stream = null;
        }
    },

    capturePhoto() {
        const video = document.getElementById('videoElement');
        const canvas = document.getElementById('canvasElement');

        // Match canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw frame
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Stop Camera
        this.stopCamera();

        // Switch to Edit View
        document.getElementById('camera-view').classList.add('hidden');
        document.getElementById('edit-view').classList.remove('hidden');

        const imgEl = document.getElementById('imageToEdit');
        imgEl.src = canvas.toDataURL('image/jpeg', 0.9);

        // Init Cropper
        if (CameraState.cropper) CameraState.cropper.destroy();
        CameraState.cropper = new Cropper(imgEl, {
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });
    },

    resetCamera() {
        document.getElementById('edit-view').classList.add('hidden');
        if (CameraState.cropper) {
            CameraState.cropper.destroy();
            CameraState.cropper = null;
        }
        this.startCamera();
    },

    async savePhoto() {
        if (!CameraState.cropper) return;

        const canvasCropped = CameraState.cropper.getCroppedCanvas({
            maxWidth: 1200,
            maxHeight: 1200,
        });

        const b64 = canvasCropped.toDataURL('image/jpeg', 0.85);

        // Save to DB
        await DB.saveToGallery(b64, 'image/jpeg');
        alert('Foto berhasil disimpan ke Galeri!');

        if (CameraState.cropper) {
            CameraState.cropper.destroy();
            CameraState.cropper = null;
        }

        // Navigate to Gallery
        app.navigate('gallery');
    }
};
