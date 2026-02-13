
import { useState, useEffect } from "react";
import { generateSpec, getHistory } from "./api";

function App() {
  const [form, setForm] = useState({
    goal: "",
    users: "",
    constraints: "",
    template: "web"
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.goal || !form.users) {
      alert("Goal and Users are required");
      return;
    }

    setLoading(true);
    try {
      const res = await generateSpec(form);
      setResult(res.data);
      loadHistory();
    } catch (err) {
      alert("Error generating plan");
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    const res = await getHistory();
    setHistory(res.data);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Tasks Generator</h1>

      <a href="/status" style={{ float: "right" }}>
        View System Status
      </a>

      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <input
          placeholder="Goal"
          onChange={e => setForm({ ...form, goal: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Users"
          onChange={e => setForm({ ...form, users: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          placeholder="Constraints"
          onChange={e => setForm({ ...form, constraints: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <select
          onChange={e => setForm({ ...form, template: e.target.value })}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <option value="web">Web</option>
          <option value="mobile">Mobile</option>
          <option value="internal">Internal Tool</option>
        </select>

        <button onClick={handleSubmit} style={{ padding: "10px 20px" }}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h2>User Stories</h2>
          <ul>
            {result.user_stories.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>

          <h2>Tasks</h2>
          {Object.keys(result.tasks).map(group => (
            <div key={group} style={{ marginBottom: 15 }}>
              <h3>{group.toUpperCase()}</h3>
              <ul>
                {result.tasks[group].map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Last 5 Specs</h2>
      <ul>
        {history.map(item => (
          <li key={item.id}>
            Spec #{item.id} — {new Date(item.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
