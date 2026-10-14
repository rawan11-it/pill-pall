import React from 'react';
import { useAuth } from '../context/AuthContext';

interface WelcomeScreenProps {
  onEnterApp?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = () => {
  const { loginWithGoogle, continueAsGuest, loading, authError, clearError } = useAuth();

  return (
    <div className="bg-[#F5F5DC] text-[#1b1c1c] min-h-screen font-sans overflow-x-hidden antialiased relative flex flex-col justify-center items-center">
      {/* Decorative background elements matching Image 3 */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-[#87CEEB] opacity-15 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-[#87CEEB] opacity-15 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 py-8 max-w-md w-full mx-auto animate-fadeIn">
        {/* Header / Logo */}
        <header className="w-full flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-[#e0bfbf]/40 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <span
              className="material-symbols-outlined text-[#87CEEB] text-4xl"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              pill
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-[#570013] mb-1 tracking-tight">
            Pill Pal
          </h1>
          <p className="text-[16px] text-[#584141] text-center font-medium">
            أهلاً بك في صديق الدواء
          </p>
        </header>

        {/* Nurturing Illustration from Image 3 */}
        <div className="w-full mb-8 flex justify-center">
          <div className="w-64 h-64 rounded-full overflow-hidden bg-white shadow-md border-4 border-[#F5F5DC] p-2 transition-transform hover:scale-102">
            <img
              className="w-full h-full object-cover rounded-full"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBixe8J3hgBEGn6GnmrwLzg7K1FXJFG1nL0VSwdVsIqY1AuUDrShoCGhsjMipPC-TuyPl4aK-p1thNGVwCUHGpsayqf6bIhsJyhM05a3X63nHpP4bHNbtAEYDOAtWZdIT-JnZ3A-9EFf7Zjzhs2XoilupB1EMnX8jUyf1ASh_akHuFavm0zNtcDtZ8p8zz3GhlZiq2pusbE8EEDiC5rcYCcxQWHE5NNgUlHjctleI2VIvB--r7ddPlbnQ"
              alt="Pill Pal - أم تعطي الدواء لطفلها برعاية ومحبة"
            />
          </div>
        </div>

        {/* Auth Error Banner if present */}
        {authError && (
          <div className="w-full mb-4 p-3 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center justify-between border border-[#ba1a1a]/30">
            <span>{authError}</span>
            <button onClick={clearError} className="text-[#93000a] font-bold px-1.5">✕</button>
          </div>
        )}

        {/* Primary Action Button: Google Sign-in */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => loginWithGoogle()}
            disabled={loading}
            className="w-full bg-[#87CEEB] hover:bg-[#77c4e4] active:scale-98 text-[#1b1c1c] font-bold text-[15px] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow-sm transition-all duration-150 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#1b1c1c] border-t-transparent rounded-full animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>تسجيل الدخول باستخدام Google</span>
              </>
            )}
          </button>

          <button
            onClick={() => continueAsGuest()}
            disabled={loading}
            className="w-full bg-white/70 hover:bg-white text-[#570013] font-semibold text-[14px] py-2.5 px-4 rounded-xl border border-[#c2c6d8]/40 transition-all text-center cursor-pointer disabled:opacity-50"
          >
            المتابعة كزائر واستكشاف التطبيق
          </button>
        </div>
      </main>
    </div>
  );
};
