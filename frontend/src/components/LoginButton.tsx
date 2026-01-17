export default function LoginButton() {
  const login = () => {
    window.location.href = 'http://localhost:5000/auth/google'
  }

  return (
    <button
      onClick={login}
      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-medium"
    >
      Sign in with Google
    </button>
  )
}
