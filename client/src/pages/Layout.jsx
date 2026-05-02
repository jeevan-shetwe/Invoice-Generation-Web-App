import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Package,
  LayoutTemplate,
  LogOut,
  Plus,
  Menu,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SIDEBAR_CSS = `
  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOverlay {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .sidebar-mobile  { animation: slideIn 0.25s ease; }
  .sidebar-overlay { animation: fadeOverlay 0.2s ease; }

  @media (max-width: 768px) {
    .desktop-sidebar       { display: none !important; }
    .mobile-topbar         { display: flex !important; }
    .mobile-topbar-spacer  { display: block !important; }
  }
  @media (min-width: 769px) {
    .desktop-sidebar       { 
      display: flex !important; 
      width: 72px; 
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    .desktop-sidebar:hover { 
      width: 240px; 
    }
    .sb-hide {
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
      pointer-events: none;
    }
    .desktop-sidebar:hover .sb-hide {
      opacity: 1;
      pointer-events: auto;
    }
    .sb-nav-item {
      padding: 10px 14px !important;
    }
    .sb-btn-text {
      display: none;
    }
    .desktop-sidebar:hover .sb-btn-text {
      display: inline;
    }
  }
`;

const navItems = [
  { name: "Invoices", path: "/", icon: FileText },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Products", path: "/products", icon: Package },
  { name: "Templates", path: "/templates", icon: LayoutTemplate },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

const SidebarContent = ({ location, handleLogout, user, onClose }) => {
  const initials = (user?.companyName || user?.email || "U")
    .charAt(0)
    .toUpperCase();
  const mobileMode = !!onClose;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div
        style={{
          padding: "20px 18px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: mobileMode ? "space-between" : "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              flexShrink: 0,
              background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(91,138,111,0.35)",
            }}
          >
            <span
              style={{ color: "#fff", fontWeight: "800", fontSize: "18px" }}
            >
              I
            </span>
          </div>
          <span
            className="sb-hide"
            style={{
              fontWeight: "800",
              fontSize: "18px",
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            InvoiceGen
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#6b7280",
            }}
          >
            <X size={22} />
          </button>
        )}
      </div>

      {/* New Invoice CTA */}
      <div style={{ padding: "16px 12px 8px" }}>
        <Link
          to="/create-invoice"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
            color: "#fff",
            borderRadius: "10px",
            padding: "12px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(91,138,111,0.3)",
            height: "44px",
            boxSizing: "border-box",
          }}
        >
          <Plus size={20} style={{ flexShrink: 0 }} />
          <span className="sb-btn-text" style={{ whiteSpace: "nowrap" }}>
            New Invoice
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "#9ca3af",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "8px 8px 6px",
            margin: 0,
          }}
        >
          Main Menu
        </p>
        {navItems.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              onClick={onClose}
              className="sb-nav-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                fontWeight: isActive ? "600" : "500",
                fontSize: "14px",
                textDecoration: "none",
                color: isActive ? "#5b8a6f" : "#4b5563",
                background: isActive ? "#eef2ff" : "transparent",
                transition: "all 0.15s",
                height: "42px",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon
                size={20}
                style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}
              />
              <span className="sb-hide">{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div
        style={{ padding: "12px 12px 16px", borderTop: "1px solid #f3f4f6" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px",
            borderRadius: "10px",
            background: "#f9fafb",
            marginBottom: "8px",
            height: "48px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              flexShrink: 0,
              background: user?.logoUrl
                ? "#fff"
                : "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "700",
              fontSize: "13px",
              overflow: "hidden",
              border: user?.logoUrl ? "1px solid #e5e7eb" : "none",
            }}
          >
            {/* {user?.logoUrl ? (
              <img
                src={`http://localhost:5000${user.logoUrl}`}
                alt="Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              initials
            )} */}


            {user?.logoUrl ? (
  <img 
    src={user.logoUrl.startsWith('http') ? user.logoUrl : `http://localhost:5000${user.logoUrl}`} 
    alt="Logo" 
    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
  />
) : (
  initials
)}
          </div>
          <div className="sb-hide" style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: "600",
                color: "#111827",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.companyName || "My Company"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#9ca3af",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background: "transparent",
            color: "#ef4444",
            fontWeight: "500",
            fontSize: "14px",
            transition: "background 0.15s",
            height: "42px",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <LogOut size={20} style={{ flexShrink: 0 }} />
          <span className="sb-hide">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <style>{SIDEBAR_CSS}</style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#f8f9fc",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* ── Desktop Sidebar (always visible ≥ 769px) ── */}
        <aside
          className="desktop-sidebar"
          style={{
            background: "#fff",
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SidebarContent
            location={location}
            handleLogout={handleLogout}
            user={user}
            onClose={null}
          />
        </aside>

        {/* ── Mobile Top Bar ── */}
        <div
          className="mobile-topbar"
          style={{
            display: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 16px",
            height: "56px",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "linear-gradient(135deg, #5b8a6f, #7a9e7d)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ color: "#fff", fontWeight: "800", fontSize: "14px" }}
              >
                I
              </span>
            </div>
            <span
              style={{ fontWeight: "800", fontSize: "16px", color: "#111827" }}
            >
              InvoiceGen
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: "6px",
              color: "#374151",
            }}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* ── Mobile Slide-out Drawer ── */}
        {mobileOpen && (
          <>
            {/* Overlay */}
            <div
              className="sidebar-overlay"
              onClick={() => setMobileOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
                zIndex: 200,
                backdropFilter: "blur(2px)",
              }}
            />
            {/* Drawer */}
            <div
              className="sidebar-mobile"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: "280px",
                background: "#fff",
                zIndex: 201,
                boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <SidebarContent
                location={location}
                handleLogout={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                user={user}
                onClose={() => setMobileOpen(false)}
              />
            </div>
          </>
        )}

        {/* ── Main Content ── */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Spacer pushes content below the fixed mobile top bar */}
          <div
            className="mobile-topbar-spacer"
            style={{ height: "56px", display: "none" }}
          />
          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              margin: "0 auto",
              flex: 1,
              boxSizing: "border-box",
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
