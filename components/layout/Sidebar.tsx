import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Navigation</h2>
        <nav className="space-y-2">
          <Link href="/" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded">Agent Chat</Link>
          <Link href="/marketplace" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded">Marketplace</Link>
          <Link href="/wallet" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded">Wallet</Link>
          <Link href="/settings" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded">Settings</Link>
          <Link href="/subscribe" className="block py-2 px-3 text-gray-700 hover:bg-gray-200 rounded">Subscribe</Link>
        </nav>
      </div>
    </aside>
  );
}
