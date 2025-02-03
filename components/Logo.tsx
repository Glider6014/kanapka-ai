interface LogoProps {
  className: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <a
      href='/'
      className={`font-bold bg-gradient-to-r from-start-prim to-end-prim bg-clip-text text-transparent ${className}`}
    >
      Kanapka AI
    </a>
  );
};

export default Logo;
