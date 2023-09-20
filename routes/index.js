const express = require('express');

const router = express.Router();

// 기본주소 설정
router.get('/',(req,res)=>{
    res.render('index', {title:"게시판 목록"}); //page 실행
});
router.get('/write',(req,res)=>{ //글쓰기 
    res.render('write', {title:"게시판 글쓰기"});
});

module.exports = router; //router내보내기