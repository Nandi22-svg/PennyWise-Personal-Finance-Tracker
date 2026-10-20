import { useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("transactions") || "[]");
  });
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  function saveTransactions(updated) {
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  }

  function addTransaction(e) {
    e.preventDefault();

    if (!description.trim() || Number(amount) <= 0) return;

    const transaction = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: Number(amount),
      type,
      date: new Date().toLocaleDateString("en-ZA"),
    };

    saveTransactions([transaction, ...transactions]);
    setDescription("");
    setAmount("");
  }

  function deleteTransaction(id) {
    saveTransactions(transactions.filter((item) => item.id !== id));
  }

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(value);

  return (
    <div className="app">
      <header>
        <h1>PennyWise</h1>
        <p>Your personal finance tracker</p>
      </header>

      <section className="summary">
        <div className="balance">
          <h3>Current Balance</h3>
          <h2>{formatMoney(balance)}</h2>
        </div>
        <div className="income">
          <h3>Total Income</h3>
          <h2>{formatMoney(income)}</h2>
        </div>
        <div className="expenses">
          <h3>Total Expenses</h3>
          <h2>{formatMoney(expenses)}</h2>
        </div>
      </section>

      <section className="panel">
        <h2>Add Transaction</h2>
        <form onSubmit={addTransaction}>
          <input
            type="text"
            placeholder="Description (e.g. Groceries)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Amount in Rands"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button type="submit">Add Transaction</button>
        </form>
      </section>

      <section className="panel">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet. Add your first one!</p>
        ) : (
          <ul>
            {transactions.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.description}</strong>
                  <small>{item.date}</small>
                </div>
                <span className={item.type}>
                  {item.type === "income" ? "+" : "-"}
                  {formatMoney(item.amount)}
                </span>
                <button
                  className="delete"
                  onClick={() => deleteTransaction(item.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;