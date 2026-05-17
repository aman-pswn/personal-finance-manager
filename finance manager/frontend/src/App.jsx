import { useEffect, useState } from "react";
import {
  createTransaction,
  deleteTransaction,
  getTransactions
} from "./api";

const initialForm = {
  title: "",
  amount: "",
  type: "INCOME",
  category: "",
  transactionDate: new Date().toISOString().slice(0, 10),
  notes: ""
};

function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function getSummary(transactions) {
  return transactions.reduce(
    (acc, item) => {
      const amount = Number(item.amount);
      if (item.type === "INCOME") {
        acc.income += amount;
      } else {
        acc.expenses += amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      const payload = {
        ...form,
        amount: Number(form.amount)
      };
      const created = await createTransaction(payload);
      setTransactions((current) => [created, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteTransaction(id);
      setTransactions((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const summary = getSummary(transactions);

  return (
    <div className="app-shell">
      <div className="backdrop"></div>
      <main className="layout">
        <section className="hero">
          <div>
            <span className="eyebrow">Personal Finance Hub</span>
            <h1>Manage income and expenses with a simple live dashboard.</h1>
            <p>
              Track everyday transactions, monitor balance, and keep your
              spending story in one place.
            </p>
          </div>

          <div className="summary-grid">
            <article className="summary-card balance">
              <span>Current Balance</span>
              <strong>{currency(summary.balance)}</strong>
            </article>
            <article className="summary-card income">
              <span>Total Income</span>
              <strong>{currency(summary.income)}</strong>
            </article>
            <article className="summary-card expense">
              <span>Total Expenses</span>
              <strong>{currency(summary.expenses)}</strong>
            </article>
          </div>
        </section>

        <section className="content-grid">
          <section className="panel form-panel">
            <div className="panel-heading">
              <h2>Add Transaction</h2>
              <p>Create a new income or expense entry.</p>
            </div>

            <form onSubmit={handleSubmit} className="transaction-form">
              <label>
                Title
                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value
                    }))
                  }
                  placeholder="Salary, Groceries, Rent"
                />
              </label>

              <div className="split">
                <label>
                  Amount
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        amount: event.target.value
                      }))
                    }
                    placeholder="0.00"
                  />
                </label>

                <label>
                  Type
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        type: event.target.value
                      }))
                    }
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </label>
              </div>

              <div className="split">
                <label>
                  Category
                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value
                      }))
                    }
                    placeholder="Salary, Food, Utilities"
                  />
                </label>

                <label>
                  Date
                  <input
                    required
                    type="date"
                    value={form.transactionDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        transactionDate: event.target.value
                      }))
                    }
                  />
                </label>
              </div>

              <label>
                Notes
                <textarea
                  rows="4"
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      notes: event.target.value
                    }))
                  }
                  placeholder="Optional details about this transaction"
                />
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Transaction"}
              </button>
            </form>
          </section>

          <section className="panel list-panel">
            <div className="panel-heading">
              <h2>Recent Transactions</h2>
              <p>Your latest financial activity appears here.</p>
            </div>

            {error ? (
              <div className="status error">
                <div>{error}</div>
                <button type="button" className="retry-button" onClick={loadTransactions}>
                  Retry connection
                </button>
              </div>
            ) : null}
            {loading ? <div className="status">Loading transactions...</div> : null}

            {!loading && transactions.length === 0 ? (
              <div className="empty-state">
                No transactions yet. Add your first record to begin tracking.
              </div>
            ) : null}

            <div className="transaction-list">
              {transactions.map((item) => (
                <article key={item.id} className="transaction-card">
                  <div>
                    <div className="transaction-topline">
                      <h3>{item.title}</h3>
                      <span
                        className={
                          item.type === "INCOME" ? "pill income" : "pill expense"
                        }
                      >
                        {item.type}
                      </span>
                    </div>
                    <p>{item.category}</p>
                    <small>
                      {item.transactionDate}
                      {item.notes ? ` | ${item.notes}` : ""}
                    </small>
                  </div>

                  <div className="transaction-side">
                    <strong>{currency(item.amount)}</strong>
                    <button type="button" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
