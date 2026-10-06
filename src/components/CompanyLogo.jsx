import logo from "../data/logo.webp";

const CompanyLogo = ({ size = "md", className = "" }) => {
  const heights = {
    xs: 28,
    sm: 38,
    md: 50,
    lg: 72,
    xl: 88
  };
  const height = heights[size] || heights.md;

  return (
    <img
      className={`company-logo ${className}`}
      src={logo}
      alt="Gnosis Ventures"
      style={{
        display: "block",
        width: `${height * 2.64}px`,
        height: `${height}px`,
        objectFit: "contain",
        flexShrink: 0
      }}
    />
  );
};

export { CompanyLogo };
