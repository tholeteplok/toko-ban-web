export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Pengaturan</h1>

      {/* Informasi Akun */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Informasi Akun</h2>
        <p className="text-gray-600">Nama: Admin Toko</p>
        <p className="text-gray-600">Role: Admin</p>
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          Ganti Password
        </button>
      </div>

      {/* Pengaturan Toko */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Pengaturan Toko</h2>
        <p className="text-gray-600">Nama Toko: Toko Ban Jaya</p>
        <p className="text-gray-600">Alamat: Jl. Ban No. 123</p>
        <p className="text-gray-600">Telepon: 0812-3456-7890</p>
        <button className="mt-3 px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800">
          Ubah Info Toko
        </button>
      </div>

      {/* Preferensi */}
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Preferensi Aplikasi</h2>
        <p className="text-gray-600">Tema: Merah Pastel</p>
        <p className="text-gray-600">Bahasa: Indonesia</p>
      </div>

      {/* Logout */}
      <div className="text-right">
        <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
}
