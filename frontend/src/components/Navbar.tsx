import LoginButton from './LoginButton'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="https://www.youtube.com/s/desktop/fe2f8c56/img/favicon_144x144.png"
            className="h-7"
            alt="YouTube"
          />
          <span className="font-semibold text-lg">YouTube Studio</span>
        </div>

        {/* Right: Login */}
        <LoginButton />
      </div>
    </header>
  )
}
