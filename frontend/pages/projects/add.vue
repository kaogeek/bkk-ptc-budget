<template>
    <NavBar />
    <div class="container" style="margin-top:94px;">
        <p style="font-size:36px;font-weight:100;" class="text-center">แบบฟอร์มโครงการ</p>
        <div class="row">
            <div class="card">
                <div class="card-body">
                    <form action="#" method="post">
                        <div class="row mb-3">
                            <label for="projectname" class="col-sm-2 col-form-label">ชื่อโครงการ</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="projectname" placeholder="ชื่อโครงการ" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectresponsible" class="col-sm-2 col-form-label">หน่วยงานรับผิดชอบ</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="projectresponsible"
                                    placeholder="หน่วยงานรับผิดชอบ" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectbudgetyear" class="col-sm-2 col-form-label">ปีงบประมาณ</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="projectbudgetyear" placeholder="ปีงบประมาณ"
                                    required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectbudgetyear" class="col-sm-2 col-form-label">ประเภทโครงการ</label>
                            <div class="col-sm-10">

                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectscope" class="col-sm-2 col-form-label">1. หลักการและเหตุผล</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectpurpose" class="col-sm-2 col-form-label">2. วัตถุประสงค์</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">3. เป้าหมาย</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectdetail" class="col-sm-2 col-form-label">4. ลักษณะโครงการ</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">5. ระยะเวลาและสถานที่ดำเนินการ</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">6. แผนปฏิบัติการ</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">6. แผนปฏิบัติการ</label>
                            <div class="col-sm-10">
                               <input type="file" class="form-control">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectbudgetamount" class="col-sm-2 col-form-label">7. งบประมาณ</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="projectbudgetamount"
                                    placeholder="งบประมาณ" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">8. ความเสี่ยงของโครงการและแนวทางการบริหารความเสี่ยง</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                           
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">9. ประโยชน์ที่คาดว่าจะได้รับ</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                           
                        </div>
                        <div class="row mb-3">
                            <label for="projectgoal" class="col-sm-2 col-form-label">10. การติดตามประเมินผล</label>
                            <div class="col-sm-10">
                                <Editor api-key="811i50spa7vcrktduyzcd6684wjg8g2vsrm0sephs5g1qqaq" :init="{
                                    plugins: 'lists link image table code help wordcount textpattern'
                                }" />
                            </div>
                           
                        </div>
                        <div class="row">
                            <div class="text-center">
                                <button type="submit" class="btn btn-success btn-lg mb-1 pull-right"
                                    style="background:#EF4D4E;;border-radius: 4px;color:#FFFFFF;border-color:#EF4D4E;font-size:14px;">ยื่นแบบฟอร์มโครงการ</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Editor from '@tinymce/tinymce-vue'
</script>