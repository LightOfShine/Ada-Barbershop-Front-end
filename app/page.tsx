'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fetching ke Backend
      const response = await fetch('https://ada-backend-service.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.token) {
        // Ambil Token JWT dan simpan di Storage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Arahkan ke Dashboard
        router.push('/dashboard');
      } else {
        alert('Login Gagal: ' + (data.message || 'Terjadi kesalahan.'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Gagal menghubungi Backend. Pastikan koneksi internet stabil!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white font-sans text-slate-900">

      {/* ─── LEFT PANEL: Form ─── */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-[360px] flex flex-col justify-center h-full">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[30px] font-bold text-[#111827] tracking-tight">Login</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nama Field */}
            {/*             <div>
              <label htmlFor="nama" className="block text-[12px] font-medium text-[#4B5563] mb-1.5">
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan Nama"
                className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[13px] text-slate-900 bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div> */}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[12px] font-medium text-[#4B5563] mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[13px] text-slate-900 bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[12px] font-medium text-[#4B5563] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full h-[44px] px-4 border border-[#E5E7EB] rounded-[8px] text-[13px] text-slate-900 bg-white placeholder:text-[#9CA3AF] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[44px] mt-1 bg-[#1E65E2] hover:bg-blue-700 text-white rounded-[8px] text-[14px] font-semibold transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-full h-[1px] bg-[#F3F4F6]"></div>
            <span className="relative bg-white px-3 text-[11px] font-normal text-[#9CA3AF]">or</span>
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            {/* Google */}
            <button className="flex-1 h-[42px] bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-[8px] flex items-center justify-center gap-2 text-[12px] font-medium text-[#374151] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            {/* Apple */}
            {/*             <button className="flex-1 h-[42px] bg-white border border-[#E5E7EB] hover:bg-slate-50 rounded-[8px] flex items-center justify-center gap-2 text-[12px] font-medium text-[#374151] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Sign in with Apple
            </button> */}
          </div>

          {/* Footer */}
          <div className="text-center text-[12px] text-[#4B5563]">
            Have an account?{' '}
            <Link href="/register" className="text-[#1E65E2] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL: Illustration ─── */}
      <div className="hidden md:flex w-1/2 h-full relative bg-[#F4F7FF] overflow-hidden items-center justify-center">

        {/* The Graphic Blue Base */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] flex items-end justify-center pointer-events-none">
          <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax slice" className="w-full h-full object-cover">
            <path d="M-200,600 Q500,-100 1200,600 Z" fill="#0066FF" />
            <path d="M-100,600 Q500,-20 1100,600" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <path d="M0,600 Q500,40 1000,600" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
            <path d="M100,600 Q500,100 900,600" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="10" />
            <path d="M200,600 Q500,160 800,600" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M-150,600 Q500,60 1150,600" fill="none" stroke="#2563EB" strokeWidth="60" opacity="0.4" />
          </svg>
        </div>

        {/* Floating Phones Mockup */}
        <div className="relative z-10 w-[85%] h-[85%] max-w-[650px] max-h-[700px] flex items-center justify-center mt-[5%] hover:scale-105 transition-transform duration-700">
          {/* Menggunakan object-contain agar gambarnya tidak terpotong dan responsif */}
          <Image
            src="/phone-mockup-actual.png"
            alt="Ada Barbershop Mobile App Overview"
            fill
            style={{ objectFit: 'contain' }}
            priority
            quality={100}
            className="filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.35)] mix-blend-normal"
          />
        </div>

      </div>

    </div>
  );
}
