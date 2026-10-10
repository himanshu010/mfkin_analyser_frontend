import ThemeSelector from "./ThemeSelector.jsx";

// On phones the theme switch lives here, out of the crowded header.
const Footer = () => (
  <footer className="mx-auto flex max-w-[96rem] flex-col gap-4 px-4 pt-2 pb-8 text-xs text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
    <p>
      Returns are computed from NAV history. AUM and ratios come from Kuvera when available. Not
      investment advice.
    </p>
    <div className="flex items-center gap-3 sm:hidden">
      <span>Theme</span>
      <ThemeSelector />
    </div>
  </footer>
);

export default Footer;
