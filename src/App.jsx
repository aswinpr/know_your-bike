import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [result, setResult] = useState("");

  function startPrediction() {
    if (!name) {
      alert("Please enter your name");
      return;
    }

    setShowPayment(true);
  }

  async function getPrediction(){

setResult("🔮 Reading your bike destiny...");

try{

const response = await fetch("/api/predict",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({
name,
age
})
});

const data = await response.json();

console.log("API response:", data);

setResult(data.prediction);

}catch(error){

console.error(error);
setResult("Prediction failed. Try again.");

}

}

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>🔮 Future Bike Predictor</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Age (optional)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <button onClick={startPrediction}>Predict My Bike 🔮</button>

      {showPayment && (
        <div style={{ marginTop: "30px" }}>
          <h3>Pay ₹10 to unlock prediction</h3>

          <img src="/upi_qr.png" width="200" />

          <br />
          <br />

          <button onClick={getPrediction}>I Paid</button>
        </div>
      )}

      <h2 style={{ marginTop: "40px", whiteSpace: "pre-line" }}>{result}</h2>
    </div>
  );
}

export default App;
