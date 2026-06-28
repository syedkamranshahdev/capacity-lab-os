export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      
      {/* top */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-[#E9DED3]" />

          <div className="h-10 w-64 rounded-2xl bg-[#EFE5DB]" />
        </div>

        <div className="h-12 w-12 rounded-2xl bg-[#EFE5DB]" />
      </div>

      {/* hero */}
      <div className="h-[240px] rounded-[2.5rem] bg-gradient-to-br from-[#F1E8DE] to-[#E8DDD1]" />

      {/* cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-[2rem] bg-[#F4ECE4]"
          />
        ))}
      </div>

      {/* content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-72 rounded-[2rem] bg-[#F4ECE4]" />

        <div className="h-72 rounded-[2rem] bg-[#F4ECE4]" />
      </div>
    </div>
  );
}