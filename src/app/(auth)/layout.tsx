interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="relative bg-black text-white flex min-h-svh flex-col items-center justify-center p-6 md:p-16">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,255,180,0.15),transparent_70%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-[conic-gradient(at_top_left,rgba(0,255,150,0.25),transparent)] opacity-50 blur-3xl animate-glow" />

      <div className="relative w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default Layout;
