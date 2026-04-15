import React, { useState, useRef, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PipelineOverview from "./components/PipelineOverview";
import LeadsTable from "./components/LeadsTable";
import KanbanBoard from "./components/KanbanBoard";
import IngestLead from "./components/IngestLead";
import LinkedInScrape from "./components/LinkedInScrape";
import Settings from "./components/Settings";

export default function App() {
  const [page, setPage] = useState("overview");
  const [refreshTick, setRefreshTick] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Each panel can register its own refetch fn here
  const refetchRef = useRef(null);

  const handleRefresh = useCallback(() => {
    if (refetchRef.current) {
      refetchRef.current();
      setLastUpdated(new Date().toISOString());
    } else {
      setRefreshTick(t => t + 1);
    }
  }, []);

  const PAGES = {
    overview: <PipelineOverview key={refreshTick} onRefreshRef={refetchRef} />,
    leads:    <LeadsTable       key={refreshTick} onRefreshRef={refetchRef} />,
    kanban:   <KanbanBoard      key={refreshTick} onRefreshRef={refetchRef} />,
    ingest:   <IngestLead />,
    scrape:   <LinkedInScrape />,
    settings: <Settings />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={page} onNav={(p) => { refetchRef.current = null; setPage(p); }} />
      <div style={{ marginLeft: 64, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header
          page={page}
          onRefresh={handleRefresh}
          loading={loading}
          lastUpdated={lastUpdated}
        />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {PAGES[page] || null}
        </main>
      </div>
    </div>
  );
}
