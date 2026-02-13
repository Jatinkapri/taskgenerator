import { useState, useEffect } from "react";
import { getStatus } from "./api";

function Status() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await getStatus();
      setStatus(res.data);
    };
    load();
  }, []);

  const Indicator = ({ label, value }) => (
    <div style={{ marginBottom: 10 }}>
      <strong>{label}: </strong>
      <span style={{
        color: value === "ok" || value === "configured" ? "green" : "red"
      }}>
        {value}
      </span>
    </div>
  );

  if (!status) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h1>System Status</h1>
      <Indicator label="Backend" value={status.backend} />
      <Indicator label="Database" value={status.database} />
      <Indicator label="LLM" value={status.llm} />
      <br />
      <a href="/">← Back to Home</a>
    </div>
  );
}

export default Status;
