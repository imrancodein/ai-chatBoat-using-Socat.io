 require('dotenv').config()
const app=require('./src/app')
const { createServer } = require("http");
const { Server, Socket } = require("socket.io");
const generateResponse=require('./src/services/ai.service')

const httpServer = createServer(app);
const io = new Server(httpServer, { 

  cors:{
    origin:'https://ai-chatboat-using-socat-io-1.onrender.com'
  }


 });
const chatHistory=[
  {
    role:'user',
    parts:[
      {text:'who is the pm of india 2019'}
    ]
  },
  {
    role:'model',
    parts:[
      {
        text:'The Prime Minister of India in 2019 was **Narendra Modi**'

      },
    ],
  }
]


io.on("connection", (socket) => {
  console.log('A User connected');

  socket.on("disconnect",()=>{
  console.log('Messaage disconnected');


  });

  socket.on('ai-message',async(data)=>{       //'ai-message' ek listener hai 
    console.log('Message Received',data);

    chatHistory.push({
      role:'user',
      parts:[{text:data}]
    });
    const response=await generateResponse(chatHistory)
    console.log("Ai Response:-", response);
    socket.emit('ai-message-response',response) //'ai-message-response' event fire  hai jo forntend par data ko send karta hai
    
      
    
  })
  
})


httpServer.listen(3000,()=>{
    console.log('server is running at port 3000');
    
})
