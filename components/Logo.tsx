interface LogoProps {
  className: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <a
      href="/"
      className={`font-bold bg-gradient-to-r from-start-prim to-end-prim bg-clip-text text-transparent ${className}`}
    >
      Kanapka AI
    </a>
  );
};
