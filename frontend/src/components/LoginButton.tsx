export default function LoginButton() {
  const login = () => {
    // use VITE_API_URL from environment variables
    const baseURL = import.meta.env.VITE_API_URL;
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <button
      onClick={login}
      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded font-medium"
    >
      Sign in with Google
    </button>
  );
}
