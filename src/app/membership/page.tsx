
export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          JS Mart
        </h1>
        <p className="max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
          Membership
        </p>
      </div>
    </div>
  );
}
