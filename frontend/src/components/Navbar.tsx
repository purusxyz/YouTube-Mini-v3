import LoginButton from './LoginButton'
import { FaYoutube } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <FaYoutube className="text-red-600 text-2xl" />
          <span className="font-semibold text-lg">YouTube Companion</span>
        </div>

        {/* Right: Login */}
        <LoginButton />
      </div>
    </header>
  )
}
