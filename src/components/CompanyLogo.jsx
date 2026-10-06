import { jsx, jsxs } from "react/jsx-runtime";
const CompanyLogo = ({
  size = "md",
  showText = false,
  textColor,
  subtextColor,
  className = ""
}) => {
  const getDimensions = () => {
    switch (size) {
      case "xs":
        return { width: 28, height: 28, fontSize: 10, titleSize: 11, subSize: 8 };
      case "sm":
        return { width: 38, height: 38, fontSize: 13, titleSize: 13, subSize: 9 };
      case "md":
        return { width: 50, height: 50, fontSize: 16, titleSize: 15, subSize: 10 };
      case "lg":
        return { width: 72, height: 72, fontSize: 22, titleSize: 18, subSize: 11 };
      case "xl":
        return { width: 88, height: 88, fontSize: 26, titleSize: 22, subSize: 12 };
    }
  };
  const dim = getDimensions();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `company-logo-container ${className}`,
      style: { display: "inline-flex", alignItems: "center", gap: size === "xs" || size === "sm" ? "8px" : "14px" },
      children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            width: dim.width,
            height: dim.height,
            viewBox: "0 0 100 100",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: { flexShrink: 0, filter: "drop-shadow(0 2px 5px rgba(43, 122, 158, 0.25))" },
            children: [
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "46", stroke: "#2b7a9e", strokeWidth: "1.8", strokeDasharray: "3 2", opacity: "0.8" }),
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "43", stroke: "#16a085", strokeWidth: "1", opacity: "0.6" }),
              /* @__PURE__ */ jsx("circle", { cx: "50", cy: "50", r: "39", fill: "url(#rsGradBg)" }),
              /* @__PURE__ */ jsx("path", { d: "M 20 62 C 14 50, 16 35, 26 24 C 23 33, 23 46, 30 55 Z", fill: "#2b7a9e", opacity: "0.65" }),
              /* @__PURE__ */ jsx("path", { d: "M 16 48 C 12 40, 15 30, 22 24 C 20 31, 21 40, 24 46 Z", fill: "#16a085", opacity: "0.75" }),
              /* @__PURE__ */ jsx("path", { d: "M 23 35 C 19 28, 24 20, 31 17 C 29 23, 29 30, 30 35 Z", fill: "#2b7a9e", opacity: "0.8" }),
              /* @__PURE__ */ jsx("path", { d: "M 80 62 C 86 50, 84 35, 74 24 C 77 33, 77 46, 70 55 Z", fill: "#2b7a9e", opacity: "0.65" }),
              /* @__PURE__ */ jsx("path", { d: "M 84 48 C 88 40, 85 30, 78 24 C 80 31, 79 40, 76 46 Z", fill: "#16a085", opacity: "0.75" }),
              /* @__PURE__ */ jsx("path", { d: "M 77 35 C 81 28, 76 20, 69 17 C 71 23, 71 30, 70 35 Z", fill: "#2b7a9e", opacity: "0.8" }),
              /* @__PURE__ */ jsx(
                "text",
                {
                  x: "50%",
                  y: "56%",
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fill: "url(#rsTextGrad)",
                  fontSize: "35",
                  fontFamily: "'Cinzel', 'Trajan Pro', 'Cinzel Decorative', 'Georgia', serif",
                  fontWeight: "900",
                  letterSpacing: "-1.5",
                  children: "RS"
                }
              ),
              /* @__PURE__ */ jsx("path", { d: "M 18 74 Q 50 87 82 74 Q 50 92 18 74 Z", fill: "url(#rsRibbonGrad)", stroke: "#1b5a7a", strokeWidth: "0.7" }),
              /* @__PURE__ */ jsxs("defs", { children: [
                /* @__PURE__ */ jsxs("radialGradient", { id: "rsGradBg", cx: "50%", cy: "50%", r: "50%", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#f0f9ff" }),
                  /* @__PURE__ */ jsx("stop", { offset: "65%", stopColor: "#e0f2fe" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#bae6fd" })
                ] }),
                /* @__PURE__ */ jsxs("linearGradient", { id: "rsTextGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#0284c7" }),
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#0369a1" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#0c4a6e" })
                ] }),
                /* @__PURE__ */ jsxs("linearGradient", { id: "rsRibbonGrad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#0284c7" }),
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "#14b8a6" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: "#0284c7" })
                ] })
              ] })
            ]
          }
        ),
        showText && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.15 }, children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontWeight: 900,
                fontSize: `${dim.titleSize}px`,
                color: textColor || "var(--text-primary)",
                letterSpacing: "0.4px",
                fontFamily: "'Inter', system-ui, sans-serif"
              },
              children: "RIDDHI SIDDHI ENTERPRISES"
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontSize: `${dim.subSize}px`,
                color: subtextColor || "var(--text-muted)",
                letterSpacing: "0.8px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginTop: "2px"
              },
              children: "Workforce & Payroll Operations"
            }
          )
        ] })
      ]
    }
  );
};
export {
  CompanyLogo
};
