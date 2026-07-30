import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterview } from "../services/interviewApi";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";


const DOMAINS = [

  {
    value:"JAVA",
    label:"Java Development",
    desc:"Core Java, OOP, Collections & Spring Boot concepts",
    icon:"☕"
  },

  {
    value:"DSA",
    label:"Data Structures & Algorithms",
    desc:"Problem solving, algorithms & coding patterns",
    icon:"🧠"
  },

  {
    value:"WEB_DEVELOPMENT",
    label:"Web Development",
    desc:"React, JavaScript, HTML & CSS fundamentals",
    icon:"🌐"
  }

];



function DomainSelect(){

  const [loadingDomain,setLoadingDomain] = useState(null);

  const [error,setError] = useState("");

  const navigate = useNavigate();

  const {user}=useAuth();



  const handleSelect = async(domain)=>{


    setError("");

    setLoadingDomain(domain);



    try{


      const response = await startInterview(domain);


      const {
        interviewId,
        question
      } = response.data;



      navigate(

        `/interview/${interviewId}`,

        {
          state:{
            question,
            domain
          }
        }

      );



    }

    catch(err){


      const message =
      err.response?.data?.message ||
      "Failed to start interview. Please try again.";


      setError(message);

      setLoadingDomain(null);

    }

  };



return (

<>

<NavBar/>


<div className="page">


<h1>
Choose Your Interview Domain
</h1>


<p style={{
marginBottom:"35px",
fontSize:"18px"
}}>

Hi {user?.name?.split(" ")[0]}, select a domain and start your AI-powered mock interview.

</p>



{
error &&

<div className="alert-error">

{error}

</div>

}



<div
style={{
display:"flex",
flexDirection:"column",
gap:"18px"
}}
>



{

DOMAINS.map((d)=>{


const isLoading =
loadingDomain===d.value;


const disabled =
loadingDomain!==null;



return (

<button

key={d.value}

className="domain-card"


disabled={disabled}


onClick={()=>handleSelect(d.value)}



style={{

opacity:

disabled && !isLoading

?

0.5

:

1

}}


>



<div

style={{

display:"flex",

alignItems:"center",

gap:"18px"

}}

>


<div className="domain-icon">

{d.icon}

</div>



<div>

<h3 style={{
margin:0,
fontSize:"20px"
}}>

{d.label}

</h3>


<p style={{
marginTop:"6px",
fontSize:"14px"
}}>

{d.desc}

</p>


</div>


</div>



{

isLoading

?

<span className="spinner"/>

:

<span style={{
fontSize:"28px",
color:"#6366f1"
}}>
→
</span>

}


</button>

)


})

}



</div>




{

loadingDomain &&

<p style={{
marginTop:"25px",
textAlign:"center"
}}>

Generating your first question with AI...

</p>

}



</div>


</>

)

}


export default DomainSelect;