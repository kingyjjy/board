const express = require('express');

const router = express.Router();

//mysql연결
const mysqlConnObj = require('../config/mysql');
const conn = mysqlConnObj.init();
mysqlConnObj.open(conn); //연결 출력

// 기본주소 설정
router.get('/',(req,res)=>{
    const sql = "select num, title, writer, date_format(wdate, '%y년 %m월 %d일 %T') as nowdate, hit from ndboard order by num desc";
    conn.query(sql, (err ,row, fields) => {
        if(err)
            console.log(err);
        else{
            console.dir(row);
            res.render('index', {title:"게시판 목록" , row:row});
        }
    });
    //res.render('index', {title:"게시판 목록"}); //page 실행
});
router.get('/write',(req,res)=>{ //글쓰기 
    res.render('write', {title:"게시판 글쓰기"});
});
router.get('/read',(req,res)=>{
    res.render('read',{title:"글 상세보기"});
})

module.exports = router; //router내보내기