import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { submitAnswer } from "../services/interviewApi";


function Interview(){

const {id}=useParams();

const location=useLocation();

const navigate=useNavigate();


const [currentQuestion,setCurrentQuestion]=useState(
location.state?.question || null
);

const [domain]=useState(
location.state?.domain || ""
);


const [answerText,setAnswerText]=useState("");

const [feedback,setFeedback]=useState(null);

const [loading,setLoading]=useState(false);

const [error,setError]=useState("");




if(!currentQuestion){

return(

<div className="page page-center">

<div className="card">

<h2>
No Active Interview
</h2>

<p>
Please start a new interview.
</p>


<button

className="btn btn-primary"

onClick={()=>navigate("/domain-select")}

>

Start Interview

</button>


</div>

</div>

)

}





const handleSubmit=async(e)=>{

e.preventDefault();


if(!answerText.trim())
return;


setLoading(true);

setError("");


try{


const response=await submitAnswer(

id,

currentQuestion.id,

answerText

);



const {

feedback:newFeedback,

nextQuestion,

completed,

overallScore

}=response.data;



setFeedback(newFeedback);



if(completed){


setTimeout(()=>{


navigate(

`/interview/${id}/complete`,

{

state:{
overallScore,
domain
}

}

);


},1200);



}
else{


setTimeout(()=>{

setCurrentQuestion(nextQuestion);

setAnswerText("");

setFeedback(null);


},3000);


}



}catch(err){


setError(

err.response?.data?.message ||

"Something went wrong."

);


}

finally{

setLoading(false);

}



};





const progress =
(currentQuestion.orderIndex / 5) * 100;





return(

<div className="page">


<div
className="card"
style={{
marginBottom:"25px"
}}
>


<div
style={{
display:"flex",
justifyContent:"space-between",
marginBottom:"12px"
}}
>


<span>
Question {currentQuestion.orderIndex} / 5
</span>


<span>
{domain.replace("_"," ")}
</span>


</div>



<div
style={{
height:"8px",
background:"#e5e7eb",
borderRadius:"20px"
}}
>


<div

style={{

height:"100%",

width:`${progress}%`,

background:
"linear-gradient(90deg,#6c63ff,#00c6ff)",

borderRadius:"20px",

transition:"0.4s"

}}

/>


</div>


</div>





<div className="card">


<h1
style={{
fontSize:"30px"
}}
>
{currentQuestion.text}
</h1>



{
error &&

<div className="alert alert-error">

{error}

</div>

}





{
!feedback &&

<form onSubmit={handleSubmit}>


<textarea

className="input"

rows="8"

placeholder="Write your answer here..."

value={answerText}

onChange={(e)=>setAnswerText(e.target.value)}

disabled={loading}

/>



<button

className="btn btn-primary btn-lg"

style={{
marginTop:"20px"
}}

disabled={loading}

>


{
loading
?
"AI is evaluating..."
:
"Submit Answer"
}



</button>


</form>

}





{
feedback &&


<div
style={{
marginTop:"25px"
}}
>


<div

className="card"

style={{
background:"#f8fafc"
}}

>


<h2>
Score: {feedback.score}/10
</h2>


<p>
<strong>
Strengths:
</strong>

{" "}

{feedback.strengths}

</p>



<p>
<strong>
Weaknesses:
</strong>

{" "}

{feedback.weaknesses}

</p>



<p>
<strong>
Improvement Tip:
</strong>

{" "}

{feedback.improvementTip}

</p>


</div>



<p
style={{
textAlign:"center",
marginTop:"20px"
}}
>
Loading next question...
</p>



</div>


}



</div>


</div>


)

}


export default Interview;