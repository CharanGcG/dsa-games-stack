import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ mode = "login", onClose }) => {
  const { login, register } = useAuth();
  const [activeMode, setActiveMode] = useState(mode);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const isRegister = activeMode === "register";

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(form);
        toast.success("Account created");
      } else {
        await login(form);
        toast.success("Welcome back");
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-5 text-white shadow-2xl"
      >
        <div className="mb-5 flex rounded-lg border border-gray-700 bg-gray-950 p-1">
          <button
            type="button"
            onClick={() => setActiveMode("login")}
            className={`w-1/2 rounded-md px-3 py-2 text-sm font-semibold ${
              !isRegister ? "bg-blue-600" : "text-gray-300 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("register")}
            className={`w-1/2 rounded-md px-3 py-2 text-sm font-semibold ${
              isRegister ? "bg-blue-600" : "text-gray-300 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {isRegister && (
          <label className="mb-3 block text-sm font-semibold text-gray-200">
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-blue-500"
              minLength={3}
              maxLength={24}
              required
            />
          </label>
        )}

        <label className="mb-3 block text-sm font-semibold text-gray-200">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-blue-500"
            required
          />
        </label>

        <label className="mb-5 block text-sm font-semibold text-gray-200">
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-700 bg-black px-3 py-2 text-white outline-none focus:border-blue-500"
            minLength={8}
            required
          />
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 rounded-lg border border-gray-600 px-4 py-2 font-semibold text-gray-200 hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {loading ? "Working..." : isRegister ? "Create" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthModal;
