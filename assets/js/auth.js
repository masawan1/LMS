/**
 * auth.js
 * Simpan sesi user di sessionStorage (hilang otomatis kalau tab ditutup,
 * lebih aman daripada localStorage yang bertahan selamanya).
 */

const Auth = {
  KEY: 'lms_session',

  simpanSesi(user) {
    sessionStorage.setItem(this.KEY, JSON.stringify(user));
  },

  ambilSesi() {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  },

  hapusSesi() {
    sessionStorage.removeItem(this.KEY);
  },

  /** Panggil di atas tiap halaman dashboard untuk jaga-jaga akses tanpa login.
   *  roleYangDiizinkan bisa berupa satu string ('siswa') atau array
   *  ['siswa', 'admin'] kalau halamannya boleh diakses lebih dari satu role
   *  (contoh: halaman materi/games yang juga dipakai admin buat pratinjau). */
  wajibLogin(roleYangDiizinkan) {
    const user = this.ambilSesi();
    if (!user) {
      window.location.href = '../index.html';
      return null;
    }
    if (roleYangDiizinkan) {
      const daftarRole = Array.isArray(roleYangDiizinkan) ? roleYangDiizinkan : [roleYangDiizinkan];
      if (!daftarRole.includes(user.role)) {
        window.location.href = '../index.html';
        return null;
      }
    }
    return user;
  },

  logout() {
    this.hapusSesi();
    window.location.href = '../index.html';
  }
};
