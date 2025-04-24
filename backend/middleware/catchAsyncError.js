export default (controlFunction) =>(req,res,next)=>{
    Promise.resolve(controlFunction(req,res,next)) .catch(next)
}