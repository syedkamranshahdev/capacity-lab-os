"use client";

// components/ui/AuthLoadingScreen.tsx
// Shown while Supabase session is being resolved on first load.
// Prevents flash of unauthenticated content.

export function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#FDF8F3] via-[#F8F1EA] to-[#F4ECE4]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] to-[#4B3326] shadow-[0_12px_30px_rgba(111,78,55,0.28)]">
          <span className="font-serif text-2xl text-white">L</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#B08968]"
              style={{
                animation: "pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}