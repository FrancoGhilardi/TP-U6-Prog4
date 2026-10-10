interface NavbarProps {
  title: string;
}

const Navbar = ({ title }: NavbarProps) => {
  return (
    <header className="bg-slate-900 shadow">
      <nav className="mx-auto flex h-14 max-w-5xl items-center px-6">
        <span className="text-lg font-semibold text-white">{title}</span>
      </nav>
    </header>
  );
};

export default Navbar;
