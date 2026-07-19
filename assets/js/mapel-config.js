/**
 * mapel-config.js
 * Aturan mapel yang boleh muncul untuk tiap kelas siswa.
 *
 * Sesuai kebutuhan sekolah:
 *  - Kelas X TSM 1 dan X TSM 2  -> Informatika (MP01) + Koding dan Kecerdasan Artifisial (MP02)
 *  - Kelas X PSPT               -> Informatika (MP01) + Dasar-Dasar Program Keahlian (MP03)
 *
 * Kalau nanti ada kelas baru yang belum diatur di ATURAN, sistem akan
 * menampilkan SEMUA mapel secara default -- supaya tidak ada siswa yang
 * tiba-tiba tidak bisa lihat mapel apa pun cuma karena kelasnya belum
 * didaftarkan di sini.
 *
 * NB: pencocokan nama kelas pakai regex "mengandung", jadi tidak peduli
 * huruf besar/kecil atau variasi spasi (mis. "X TSM 1", "x tsm 2").
 */
const MapelConfig = {
  ATURAN: [
    { cocok: (kelas) => /pspt/i.test(kelas), mapel: ['MP01', 'MP03'] },
    { cocok: (kelas) => /tsm/i.test(kelas), mapel: ['MP01', 'MP02'] }
  ],

  /** Kembalikan daftar id_mapel yang boleh dilihat kelas ini, atau null = semua boleh. */
  mapelUntukKelas(kelas) {
    if (!kelas) return null;
    const aturan = this.ATURAN.find((a) => a.cocok(kelas));
    return aturan ? aturan.mapel : null;
  },

  /** Filter array mapel (hasil Api.getMapel()) sesuai kelas siswa. */
  filterMapel(daftarMapel, kelas) {
    const izin = this.mapelUntukKelas(kelas);
    if (!izin) return daftarMapel;
    return daftarMapel.filter((m) => izin.includes(m.id_mapel));
  },

  /** true kalau id_mapel tertentu boleh diakses kelas ini. */
  bolehAkses(idMapel, kelas) {
    const izin = this.mapelUntukKelas(kelas);
    if (!izin) return true;
    return izin.includes(idMapel);
  }
};
