export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! Page Not Found</p>
        <a
          href="/"
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
