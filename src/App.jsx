import { useState } from "react";

function App() {

const [name,setName] = useState("");
const [age,setAge] = useState("");
const [result,setResult] = useState("");
const [showPayment,setShowPayment] = useState(false);

function startPrediction(){

if(!name){
alert("Enter your name");
return;
}

setShowPayment(true);

}

async function getPrediction(){

setResult("🔮 Reading your bike destiny...");

const response = await fetch("/api/predict",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
age
})
});

const data = await response.json();

const prediction = data.candidates[0].content.parts[0].text;

setResult(prediction);

}

return (

<div style={{textAlign:"center",marginTop:"100px"}}>

<h1>🔮 Future Bike Predictor</h1>

<input
placeholder="Enter your name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<br/><br/>

<input
placeholder="Age (optional)"
value={age}
onChange={(e)=>setAge(e.target.value)}
/>

<br/><br/>

<button onClick={startPrediction}>
Predict My Bike 🔮
</button>

{showPayment && (

<div style={{marginTop:"20px"}}>

<h3>Pay ₹10 to view your bike</h3>

<img src="/upi_qr.jpg" width="200"/>

<br/><br/>

<button onClick={getPrediction}>
I Paid
</button>

</div>

)}

<h2 style={{whiteSpace:"pre-line"}}>
{result}
</h2>

</div>

);

}

export default App;