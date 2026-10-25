// Konfigurasi form CMS untuk Pendidikan dan Sertifikat.
// Tipe field: "text", "textarea", "number", "image".

export const EDUCATION_CONFIG = {
  heading: "Kelola Pendidikan",
  table: "education",
  primaryKey: "institution",
  secondaryKey: "degree",
  fields: [
    { name: "institution", label: "Nama institusi", type: "text", required: true, placeholder: "Universitas Sains dan Teknologi Indonesia" },
    { name: "degree", label: "Gelar / jurusan", type: "text", required: true, placeholder: "S.Kom — Teknik Informatika" },
    { name: "period", label: "Periode", type: "text", placeholder: "2022 — 2026" },
    { name: "description", label: "Keterangan (IPK, konsentrasi, skripsi, organisasi, dll)", type: "textarea" },
    { name: "sort_order", label: "Urutan tampil (angka besar = di atas)", type: "number" },
  ],
};

export const CERTIFICATES_CONFIG = {
  heading: "Kelola Sertifikat",
  table: "certificates",
  primaryKey: "title",
  secondaryKey: "issuer",
  fields: [
    { name: "title", label: "Nama sertifikat", type: "text", required: true },
    { name: "issuer", label: "Penerbit", type: "text", required: true, placeholder: "Hacktiv8, Dicoding, Coursera, dll" },
    { name: "issued_date", label: "Tanggal terbit", type: "text", placeholder: "Mei 2026" },
    { name: "credential_url", label: "Link kredensial / verifikasi (opsional)", type: "text" },
    { name: "image_url", label: "Gambar sertifikat (opsional)", type: "image" },
    { name: "sort_order", label: "Urutan tampil (angka besar = di atas)", type: "number" },
  ],
};
