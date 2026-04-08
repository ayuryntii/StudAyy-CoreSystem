/**
 * DB Wrapper to interact with LocalForage (IndexedDB fallback)
 */

const DB = {
    tugas: localforage.createInstance({ name: "app_db", storeName: "tugas" }),
    rangkuman: localforage.createInstance({ name: "app_db", storeName: "rangkuman" }),
    gallery: localforage.createInstance({ name: "app_db", storeName: "gallery" }),

    // ==== TUGAS ====
    async saveTugas(data) {
        const id = data.id || 'tugas_' + Date.now();
        data.id = id;
        await this.tugas.setItem(id, data);
        return id;
    },

    async getAllTugas() {
        const results = [];
        await this.tugas.iterate((value) => {
            results.push(value);
        });
        return results.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
    },

    async getTugas(id) {
        return await this.tugas.getItem(id);
    },

    async deleteTugas(id) {
        await this.tugas.removeItem(id);
    },

    // ==== RANGKUMAN ====
    async saveRangkuman(data) {
        const id = data.id || 'rangkuman_' + Date.now();
        data.id = id;
        await this.rangkuman.setItem(id, data);
        return id;
    },

    async getAllRangkuman() {
        const results = [];
        await this.rangkuman.iterate((value) => {
            results.push(value);
        });
        return results.sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal));
    },

    async getRangkuman(id) {
        return await this.rangkuman.getItem(id);
    },

    async deleteRangkuman(id) {
        await this.rangkuman.removeItem(id);
    },

    // ==== GALLERY ====
    async saveToGallery(b64, type = "image/jpeg") {
        const id = 'img_' + Date.now();
        const data = { id, dataUrl: b64, type, timestamp: Date.now() };
        await this.gallery.setItem(id, data);
        return id;
    },

    async getGalleryImages() {
        const results = [];
        await this.gallery.iterate((value) => {
            results.push(value);
        });
        return results.sort((a,b) => b.timestamp - a.timestamp);
    },
    
    async deleteGalleryImage(id) {
        await this.gallery.removeItem(id);
    }
};
