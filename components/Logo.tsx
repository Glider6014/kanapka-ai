interface LogoProps {
  mobileFontSize: string;
  desktopFontSize: string;
}

export const Logo: React.FC<LogoProps> = ({
  mobileFontSize,
  desktopFontSize,
}) => {
  return (
    <a
      href="/"
      className={`font-bold bg-gradient-to-r from-purple-700 to-orange-500 bg-clip-text text-transparent ${mobileFontSize} md:${desktopFontSize}`}
    >
      Kanapka AI
    </a>
  );
};
