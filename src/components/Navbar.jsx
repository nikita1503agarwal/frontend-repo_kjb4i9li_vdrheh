import { Link, NavLink } from 'react-router-dom'

const linkBase = 'px-3 py-2 rounded-md text-sm font-medium transition-colors'
const inactive = 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
const active = 'text-white bg-blue-600 hover:bg-blue-700'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">U</div>
            <span className="font-semibold text-gray-800">UMKM Predictor</span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
              Dashboard
            </NavLink>
            <NavLink to="/predict" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
              Predict
            </NavLink>
            <NavLink to="/reports" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
              Monitor Report
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => `${linkBase} ${isActive ? active : inactive}`}>
              Profil
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
