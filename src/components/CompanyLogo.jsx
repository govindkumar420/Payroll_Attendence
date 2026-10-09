import logo from "../data/nexapay-logo.png";

const CompanyLogo = ({ size = "md", className = "", style = {} }) => {
  const heights = {
    xs: 26,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 82
  };
  const height = heights[size] || heights.md;

  return (
    <img
      className={`company-logo ${className}`}
      src={logo}
      alt="Payroll NEXAPAY"
      style={{
        display: "block",
        height: `${height}px`,
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        flexShrink: 0,
        ...style
      }}
    />
  );
};

export { CompanyLogo };
