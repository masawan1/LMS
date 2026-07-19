/**
 * materi-tracker.js
 * Sertakan script ini di SETIAP file materi (di dalam folder konten/)
 * supaya poin otomatis tercatat waktu siswa scroll sampai akhir halaman
 * -- tanpa perlu klik tombol "tandai selesai" secara manual.
 *
 * SYARAT supaya berfungsi:
 *  1. Materi dibuka dengan URL yang ada parameter ?id=...&poin=...&mapel=...
 *     (ini otomatis ditambahkan sistem waktu siswa klik "Baca" dari
 *     halaman daftar materi -- tidak perlu diatur manual)
 *  2. File materi HARUS include auth.js, api.js, lalu materi-tracker.js
 *     ini (urutan skrip harus persis begini)
 *  3. Taruh <div id="akhir-materi"></div> di baris PALING AKHIR konten
 *     (penanda "ini titik akhir bacaan")
 *  4. Elemen dengan class="back-link" akan otomatis diarahkan balik ke
 *     daftar materi yang benar (tidak perlu isi href manual)
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const idMateri = params.get('id');
  const poin = Number(params.get('poin') || 0);
  const idMapel = params.get('mapel');

  let sudahDikirim = false;

  function tampilkanToast(pesan) {
    const toast = document.createElement('div');
    toast.textContent = pesan;
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
      'background:#123832', 'color:#3fd6c0', 'border:1px solid #3fd6c0',
      'padding:12px 22px', 'border-radius:999px',
      "font-family:'JetBrains Mono',monospace", 'font-size:13px',
      'z-index:9999', 'box-shadow:0 8px 24px rgba(0,0,0,.4)', 'opacity:0',
      'transition:opacity .25s'
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.style.opacity = '1'; });
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3200);
  }

  async function kirimProgress() {
    if (sudahDikirim || !idMateri) return;
    if (typeof Auth === 'undefined' || typeof Api === 'undefined') return;

    const user = Auth.ambilSesi();
    if (!user) return; // belum login, jangan kirim apa-apa
    if (user.role !== 'siswa') return; // admin cuma pratinjau, jangan catat progress

    sudahDikirim = true;
    try {
      const res = await Api.submitProgress(user.nis, idMateri, 'materi', poin);
      if (res.success) {
        if (!res.duplikat) {
          tampilkanToast('\u2713 Selesai dibaca \u2014 ' + poin + ' poin didapat');
        }
      } else {
        sudahDikirim = false;
      }
    } catch (err) {
      sudahDikirim = false; // koneksi gagal, boleh dicoba lagi
    }
  }

  function pantauAkhirMateri() {
    const sentinel = document.getElementById('akhir-materi');
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      // fallback kalau browser lama / sentinel tidak ada
      window.addEventListener('scroll', function cek() {
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 40) {
          kirimProgress();
          window.removeEventListener('scroll', cek);
        }
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          kirimProgress();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(sentinel);
  }

  function pasangLinkKembali() {
    const user = (typeof Auth !== 'undefined') ? Auth.ambilSesi() : null;
    const isAdmin = user && user.role === 'admin';
    const tujuan = isAdmin
      ? ('../../admin/kelola-materi.html' + (idMapel ? '?mapel=' + encodeURIComponent(idMapel) : ''))
      : (idMapel
        ? '../../siswa/materi.html?mapel=' + encodeURIComponent(idMapel)
        : '../../siswa/dashboard.html');
    document.querySelectorAll('.back-link').forEach(function (el) {
      el.setAttribute('href', tujuan);
      el.removeAttribute('onclick');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    pasangLinkKembali();
    pantauAkhirMateri();
  });
})();
