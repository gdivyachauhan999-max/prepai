import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";


function Register(){

const [name,setName]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [error,setError]=useState("");

const [success,setSuccess]=useState(false);

const [loading,setLoading]=useState(false);


const navigate=useNavigate();



const handleSubmit=async(e)=>{

e.preventDefault();

setError("");

setLoading(true);


try{


await api.post(
"/auth/register",
{
name,
email,
password
}
);


setSuccess(true);


setTimeout(()=>{

navigate("/login");

},1500);



}catch(err){

setError(
err.response?.data?.message ||
"Registration failed."
);

}
finally{

setLoading(false);

}

};



return(

<div className="page page-center">


<div
className="card"
style={{
width:"100%",
maxWidth:"430px"
}}
>


<div
style={{
textAlign:"center",
marginBottom:"35px"
}}
>


<div
style={{
fontSize:"42px"
}}
>
🚀
</div>


<h1
style={{
fontSize:"32px"
}}
>
Create Account
</h1>


<p>
Start practicing with AI interviews
</p>


</div>




{
error &&
<div className="alert alert-error">
{error}
</div>
}



{
success &&
<div className="alert alert-success">
Account created! Redirecting...
</div>
}





<form onSubmit={handleSubmit}>


<div className="field">

<label>
Full Name
</label>


<input

className="input"

value={name}

onChange={(e)=>setName(e.target.value)}

placeholder="Enter your name"

required

/>

</div>





<div className="field">

<label>
Email
</label>


<input

className="input"

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

placeholder="Enter your email"

required

/>

</div>





<div className="field">

<label>
Password
</label>


<input

className="input"

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

placeholder="Minimum 8 characters"

minLength={8}

required

/>

</div>




<button

className="btn btn-primary btn-block btn-lg"

disabled={loading}

>


{
loading
?
"Creating..."
:
"Create Account"
}



</button>



</form>





<p
style={{
textAlign:"center",
marginTop:"25px"
}}
>

Already have account?

{" "}

<Link to="/login">
Login
</Link>


</p>




</div>


</div>

)

}


export default Register;