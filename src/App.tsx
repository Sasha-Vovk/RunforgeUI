import { Sidebar } from "./components/sidebar/Sidebar";
import styles from "./App.module.css";
import { RunsPage } from "./pages/runs-page";

export default function App() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <main className={styles.main}>
        <RunsPage />
      </main>
    </div>
  );
}
