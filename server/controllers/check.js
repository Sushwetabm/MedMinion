
async function checkuserfunc(req, res) {
   
    const isUser=req.cookies?.pid;
    return res.status(200).json({ isUser:isUser===undefined?false:true });
  }


  module.exports = {
checkuserfunc
  };
