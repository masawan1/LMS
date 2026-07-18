/**
 * api.js
 * Semua komunikasi ke backend Apps Script lewat sini.
 * GANTI API_URL di bawah setiap kali deploy ulang backend.
 */

const API_URL = 'https://script.google.com/macros/s/AKfycbzaPXbCT9q0ogEeMDQjN6mNKeSi5YefYtwEgbKhZfo-qCD4ajlajLeYBtJh-HceOZQhtA/exec';

const Api = {
  /** Request GET - untuk semua aksi baca data */
  async get(action, params = {}) {
    const query = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${API_URL}?${query}`);
    return res.json();
  },

  /** Request POST - untuk semua aksi tulis data.
   *  PENTING: Content-Type text/plain (bukan application/json) supaya
   *  browser tidak kirim preflight OPTIONS yang tidak didukung Apps Script. */
  async post(action, payload = {}) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });
    return res.json();
  },

  getMapel: () => Api.get('getMapel'),
  getMateri: (idMapel) => Api.get('getMateri', { id_mapel: idMapel }),
  getGames: (idMapel) => Api.get('getGames', { id_mapel: idMapel }),
  getRekapNilai: (idMapel) => Api.get('getRekapNilai', { id_mapel: idMapel || '' }),

  login: (nis, password) => Api.post('login', { nis, password }),
  buatUser: (data) => Api.post('buatUser', data),
  submitProgress: (nis, idRef, tipeRef, poin) =>
    Api.post('submitProgress', { nis, id_ref: idRef, tipe_ref: tipeRef, poin_didapat: poin }),
  tambahMateri: (data) => Api.post('tambahMateri', data),
  tambahGame: (data) => Api.post('tambahGame', data),
  verifikasiNilai: (nis, idMapel, nilaiFinal) =>
    Api.post('verifikasiNilai', { nis, id_mapel: idMapel, nilai_final: nilaiFinal })
};
