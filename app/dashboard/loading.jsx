
  
  export default function Loading({message}) {
    return (
     <div style={{display:'flex',zIndex:'1',justifyContent:'center',width:'100%',textAlign:'center'}}>
        <div style={{margin:"20%",fontSize:'24px',width:"20rem"}}>
          <p>{message}...</p>
        </div>
     </div>
    );
  }