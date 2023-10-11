const express = require('express');

const router = express.Router();

//mysql연결
const mysqlConnObj = require('../config/mysql');
const conn = mysqlConnObj.init();
mysqlConnObj.open(conn); //연결 출력

// 기본주소 설정
router.get('/',(req,res)=>{
    const sql = "select * from ndboard order by orNum desc, grNum asc";
    //const date = "date_format(wdate, '%y년 %m월 %d일 %T') as nowdate";
    conn.query(sql, (err ,row, fields) => {
        if(err)
            console.log(err);
        else{
            let odate;
            for(let rs of row){
                // let layer=0;
                // if(rs.grLayer >0){
                //     for(let i=0; i<=rs.grLayer; i++){
                //         layer += 20; 
                //     }
                // }
                rs.grLayer*=30;
                // rs.grLayer=layer;
                odate=new Date(rs.wdate);
                rs.wdate = `${odate.getFullYear()}-${odate.getMonth()+1}-${odate.getDate()}`;
            }
            console.log(row);
            res.render('index', {title:"게시판 목록" , row:row});
        }
    });
    //res.render('index', {title:"게시판 목록"}); //page 실행
});
router.get('/write',(req,res)=>{ //글쓰기 
    res.render('write', {title:"게시판 글쓰기"});
});
router.post('/write',(req,res)=>{ //글쓴거 전송
    const rs = req.body;
    let sql = `insert into ndboard(orNum,grNum,writer,userid,userpass,title,contents) values(?,?,?,?,?,?,?)`;
    conn.query(sql,[
        0,1,rs.writer,'guest',rs.pass,rs.title,rs.content
    ],(err,res,fields)=>{
        if(err){
        console.log(err);
        }else{
            console.log(res.insertId) //오토인크리먼트값
            sql = "update ndboard set ? where num = "+res.insertId; //insertId 값에 맞는곳에 ? 넣기
            conn.query(sql,{orNum: res.insertId},(err,res,fields)=>{
                if(err)
                    console.log(err);
                else{
                    console.log("업데이트 성공");
                }
            });
            
        }
    });
    res.redirect('/');
});
router.get('/read/:num',(req,res)=>{ //글 상세보기
    const {num} = req.params;
    const sql = "select * from ndboard where num=?";
    conn.query(sql,[num],(err,row,fields)=>{
        if(err)
            console.log(err);
        else{
            let odate;
            for(let rs of row){
                odate=new Date(rs.wdate);
                rs.wdate = `${odate.getFullYear()}-${odate.getMonth()+1}-${odate.getDate()}`;
            
            }
           res.render('read',{title:"글 상세보기", row});
        }
    });
     
});
router.get('/edit/:num',(req,res)=>{ //글 수정
    const {num} = req.params;
    const sql = "select * from ndboard where num=?";
    conn.query(sql,[num],(err,row,fields)=>{
        if(err)
            console.log(err);
        else{
            res.render('edit',{title:"글 수정하기", row});
        }
    });
});
router.post('/edit/:num',(req,res)=>{//글 수정한거 보내기
    const {num}=req.params;
    const rs = req.body;
    const sql = "update ndboard set ? where num = ?";
    conn.query(sql,[{
        title:rs.title,
        contents:rs.content
    }, num],(err,res,fields)=>{
        if(err)
            console.log(err);
        else{
            console.log("update성공");
        }
    });
    res.redirect('/read/'+num);
});
router.post('/pwdlogin', (req,res)=>{
    const {num, pass, title, content } = req.body;
    let sql = "select * from ndboard where num=? and userpass = ?";
    conn.query(sql,[num, pass],(err,row,fields)=>{
        if(err){
            console.log(err);
        }else{
            if(row.length > 0){
                sql = "update ndboard set ? where num = ?";
                conn.query(sql,[{
                    title:title,
                    contents:content
                }, num],(err,fields)=>{
                    if(err){
                        res.send('0');
                        console.log(err);
                    }else{
                        res.send('1');
                        console.log('수정성공');
                    }
                });

            }else{
               res.send('0');
            }
        }
    });
});
router.get('/delete/:num',(req,res)=>{
    //const {num}=req.params;
    const {num,pass} = req.body;
    let sql = "select * from ndboard where num=? and userpass = ?";
    conn.query(sql,[num, pass],(err,row,fields)=>{
        if(err){
            console.log(err);
        }else{
            if(row.length > 0){
                sql = "delete from ndboard where num = ?";
                conn.query(sql,[{
                    title:title,
                    contents:content
                }, num],(err,fields)=>{
                    if(err){
                        res.send('0');
                        console.log(err);
                    }else{
                        res.send('1');
                        console.log('삭제성공');
                    }
                });

            }else{
               res.send('0');
            }
        }
    });
   
})

module.exports = router; //router내보내기