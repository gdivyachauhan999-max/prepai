import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/interviewApi";
import NavBar from "../components/NavBar";


function StatCard({label,value}){

return(

<div className="card">

<p style={{
fontSize:"14px",
fontWeight:600
}}>
{label}
</p>

<h2 style={{
fontSize:"34px",
marginTop:"12px",
color:"#6c63ff"
}}>
{value}
</h2>

</div>

)

}



function Dashboard(){

const {user}=useAuth();

const navigate=useNavigate();


const [summary,setSummary]=useState(null);

const [loading,setLoading]=useState(true);

const [error,setError]=useState("");



useEffect(()=>{

getDashboardSummary()

.then(res=>setSummary(res.data))

.catch(()=>setError("Could not load dashboard."))

.finally(()=>setLoading(false));


},[]);



return(

<>

<NavBar active="dashboard"/>


<div className="page">


<div
className="card"
style={{
marginBottom:"35px",
background:
"linear-gradient(135deg,#eef2ff,#ffffff)"
}}
>

<h1>
Welcome back, {user?.name?.split(" ")[0]} 👋
</h1>

<p>
Ready to improve your interview skills today?
</p>


<button

className="btn btn-primary btn-lg"

onClick={()=>navigate("/domain-select")}

style={{
marginTop:"25px"
}}

>
Start Mock Interview
</button>


</div>



{error &&
<div className="alert alert-error">
{error}
</div>
}



{
loading ?

<p>Loading dashboard...</p>

:

summary &&

<>


<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",
gap:"20px"
}}
>

<StatCard

label="Total Interviews"

value={summary.totalInterviews}

/>


<StatCard

label="Average Score"

value={
summary.averageScore
?
`${summary.averageScore.toFixed(1)} / 10`
:
"—"
}

/>


</div>



{
summary.byDomain &&
<div
className="card"
style={{
marginTop:"30px"
}}
>

<h2>
Performance by Domain
</h2>


{
Object.entries(summary.byDomain)
.map(([domain,score])=>(

<div
key={domain}
style={{
display:"flex",
justifyContent:"space-between",
padding:"14px 0",
borderBottom:"1px solid #eee"
}}
>

<span>
{domain.replace("_"," ")}
</span>

<strong>
{score.toFixed(1)} / 10
</strong>


</div>

))
}


</div>
}


</>

}



</div>


</>

)

}


export default Dashboard;