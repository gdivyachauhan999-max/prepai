import { useLocation,useNavigate,useParams } from "react-router-dom";


function InterviewComplete(){


const location=useLocation();

const navigate=useNavigate();

const {id}=useParams();



const score=location.state?.overallScore;

const domain=location.state?.domain;



const getColor=(score)=>{

if(score>=8)
return "#16a34a";

if(score>=5)
return "#f59e0b";

return "#dc2626";

};



return(

<div className="page page-center">


<div

className="card"

style={{

textAlign:"center",

maxWidth:"550px",

width:"100%"

}}

>


<div
style={{
fontSize:"55px"
}}
>
🎉
</div>



<p
style={{
fontWeight:700
}}
>
INTERVIEW COMPLETE
</p>



<h1>
{domain?.replace("_"," ")}
</h1>




<div
style={{
margin:"35px 0"
}}
>


<span

style={{

fontSize:"70px",

fontWeight:800,

color:getColor(score)

}}

>

{
score != null
?
score.toFixed(1)
:
"--"
}


</span>



<span
style={{
fontSize:"24px"
}}
>
 / 10
</span>



</div>





<div

style={{

display:"flex",

gap:"15px",

justifyContent:"center",

flexWrap:"wrap"

}}

>


<button

className="btn btn-secondary"

onClick={()=>navigate(`/history/${id}`)}

>

View Summary

</button>



<button

className="btn btn-primary"

onClick={()=>navigate("/dashboard")}

>

Dashboard

</button>


</div>



</div>


</div>


)


}


export default InterviewComplete;