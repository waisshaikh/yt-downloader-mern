import app from "./app.js";

const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send("API is running ");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});