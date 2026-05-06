import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

function Layout({ children, role }) {
  return (
    <div className="app-shell">
      <Sidebar role={role} />
      <main className="main-area">
        <TopBar role={role} />
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}

export default Layout;