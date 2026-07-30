import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";


function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");

  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const {login} = useAuth();

  const [searchParams] = useSearchParams();

  const expired = searchParams.get("expired")==="true";



  const handleSubmit = async(e)=>{

    e.preventDefault();

    setError("");

    setLoading(true);


    try{

      const response = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );


      const {
        token,
        name,
        email:userEmail
      } = response.data;


      login(
        token,
        name,
        userEmail
      );


      navigate("/dashboard");


    }catch(err){

      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );

    }
    finally{

      setLoading(false);

    }

  };



return(

<div className="page page-center">


<div
className="card page-narrow"
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
fontSize:"42px",
marginBottom:"10px"
}}
>
🤖
</div>


<h1
style={{
fontSize:"32px",
marginBottom:"10px"
}}
>
PrepAI
</h1>


<p>
AI powered mock interview practice
</p>


</div>



{
expired &&
<div className="alert alert-error">
Your session expired. Please login again.
</div>
}



{
error &&
<div className="alert alert-error">
{error}
</div>
}



<form onSubmit={handleSubmit}>


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

placeholder="Enter password"

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
"Logging in..."
:
"Login"
}


</button>



</form>




<p
style={{
textAlign:"center",
marginTop:"25px"
}}
>

Don't have an account?

{" "}

<Link to="/register">
Create one
</Link>


</p>



</div>


</div>

)

}


export default Login;