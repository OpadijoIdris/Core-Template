import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tighter">TEMPLATESTORE</h3>
          <p className="text-gray-400 font-medium">Exquisite jewelry and timepieces crafted for your unique story. Timeless elegance, modern precision.</p>
        </div>

        <div>
          <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-500">Navigation</h4>
          <ul className="space-y-3 text-gray-400 font-bold text-sm">
            <li><Link href="/products" className="hover:text-white transition-colors">Shop Collections</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
            <li><Link href="/admin" className="hover:text-white transition-colors">Administrative Core</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase tracking-widest text-xs mb-6 text-blue-500">Communication</h4>
          <p className="text-gray-400 font-bold text-sm">Inquiries: support@templatestore.com</p>
          <p className="text-gray-400 font-bold text-sm mt-2">Status: Operations Online</p>
        </div>
      </div>

      <div className="text-center mt-16 pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
        © {new Date().getFullYear()} TemplateStore Luxury. Finalized for Excellence.
      </div>
    </footer>
  );
}
