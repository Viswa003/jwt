const express =require('express');
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const nodemon=require('nodemon');
const jwt=require('jsonwebtoken');

const app=express();
const port=3000;
const secretKey='abc@123';

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'viswa'
});

connection.connect((err)=>{
    if(err){
        console.error('Error connecting to mysql: ',err);
        return ;
    }
    console.log('Connected to mysql');
});

const authenticateToken=(req,res,next)=>{
    const token=req.header('Authorization');
    console.log(token);
    if( !token || !token.startsWith('Bearer')){
        return res.sendStatus(401).json({message:'Unauthorized'});
    }
    const tokenValue=token.split(' ')[1];
    jwt.verify(tokenValue,secretKey,(err,user)=>{
        if(err) return res.status(403).json({message:'Forbidden'});
        req.user=user;
        next();
    });
}

app.use(bodyParser.json());

app.post('/login',(req,res)=>{
    const {username,password}=req.body;
    if(username==='admin' && password==='admin'){
        const user={username:'admin'};
        const accessToken=jwt.sign(user,secretKey,{expiresIn:'1h'});
        res.json({accessToken});
    }
    else{
        res.status(401).json({message:'Invalid credentials'})
    }
})

app.get('/getAllStudentInfo',authenticateToken,(req,res)=>{
    connection.query('select * from student_info',(err,results)=>{
        if(err) throw err;
        res.json(results);
    });
});

app.get('/getSpecifiedStudentInfo/:id',authenticateToken,(req,res)=>{
    const stdId=req.params.id;
    connection.query('select * from student_info where id=?',[stdId],(err,results)=>{
        if(err) throw err;
        res.json(results[0]);
    });
});

app.post('/addStudent',authenticateToken,(req,res)=>{
    const {id,name,age}=req.body;
    connection.query('insert into student_info values(?,?,?)',[id,name,age],(err,results)=>{
        if(err) throw err;
        res.json({id,name,age});
    });
});

app.put('/updateStudentInfo/:id',authenticateToken,(req,res)=>{
    const stdId=req.params.id;
    const {name,age}=req.body;
    connection.query('update student_info set name=?, age=? where id=?',[name,age,stdId],(err)=>{
        if(err) throw err;
        res.json({id:stdId ,name,age});
    });
});

app.delete('/deleteStudentInfo/:id',authenticateToken,(req,res)=>{
    const stdId=req.params.id;
    connection.query('delete from student_info where id=?',[stdId],(err)=>{
        if(err) throw err;
        res.json({message:'Student info deleted successfully',id:stdId});
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
