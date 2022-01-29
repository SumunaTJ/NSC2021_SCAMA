import React from "react";
import './App.css';

export default function Disclam() {

    const con = (e) => {
        e.preventDefault();
        window.location.href = "/login";
    }
  

  return (
    <div className="container">
      <div className="card cardhide5">
        <div className="card-body">
          <div className="row">
              <h4><b>ข้อตกลงในการใช้ซอฟต์แวร์ (Disclaimer)</b></h4>
              <h5 style={{textIndent: '60px', textAlign: 'left', padding: '30px', lineHeight: '35px'}}>ซอฟต์แวร์นี้เป็นผลงานที่พัฒนาขึ้นโดยนางสาวปรีชญา วรรณภูมิ นางสาวสุมุนา ไทยเจีย และนางสาวสรัลนุช ตรงต่อศักดิ์ <br></br>จากมหาวิทยาลัยมหิดลภายใต้การดูแลของ ดร.อัคร สุประทักษ์ ภายใต้โครงการ ซากะมะ: เว็บไซต์ที่สามารถซ่อนคิวอาร์โค้ดไว้ในรูปภาพ ซึ่งสนับสนุนโดย สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ โดยมีวัตถุประสงค์เพื่อส่งเสริมให้นักเรียนและนักศึกษาได้เรียนรู้และฝึกทักษะในการพัฒนาซอฟต์แวร์ ลิขสิทธิ์ของซอฟต์แวร์นี้จึงเป็นของผู้พัฒนา ซึ่งผู้พัฒนาได้อนุญาตให้สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ เผยแพร่ซอฟต์แวร์นี้ตาม “ต้นฉบับ” โดยไม่มีการแก้ไขดัดแปลงใดๆ ทั้งสิ้น ให้แก่บุคคลทั่วไปได้ใช้เพื่อประโยชน์ส่วนบุคคลหรือประโยชน์ทางการศึกษาที่ไม่มีวัตถุประสงค์ในเชิงพาณิชย์ โดยไม่คิดค่าตอบแทนการใช้ซอฟต์แวร์ ดังนั้น สำนักงานพัฒนาวิทยาศาสตร์และเทคโนโลยีแห่งชาติ จึงไม่มีหน้าที่ในการดูแล บำรุงรักษา จัดการอบรมการใช้งาน หรือพัฒนาประสิทธิภาพซอฟต์แวร์ รวมทั้งไม่รับรองความถูกต้องหรือประสิทธิภาพการทำงานของซอฟต์แวร์ ตลอดจนไม่รับประกันความเสียหายต่างๆ อันเกิดจากการใช้ซอฟต์แวร์นี้ทั้งสิ้น</h5>
          </div>
          
          <br></br>
          
          
          <button type="button" className="btn btn-primary" onClick={con} >ACCEPT</button>

        </div>

      </div>

      <br>
      </br>

    </div>
  );
}