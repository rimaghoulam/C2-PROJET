<?php
namespace App\Http\Controllers\MAIN;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request; 
use Illuminate\Http\Response;
use App\Http\Requests;
use DateTime;
use Mail;
use Hash;
use Dompdf\Dompdf;

use Str;
use Pusher;

class Functions extends Controller
{
    
    public function if_user_exist($username,$password){
        
         $username=strtolower($username);
         $generate_token = $this->generate_login_token($username,$password); 
        
         $search_results = DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->join('roles', 'roles.role_id', '=', 'user_role.user_role_role_id')
                            ->select("basic_user.user_id","basic_user.user_email","basic_user.user_name","basic_user.user_username","basic_user.user_active","basic_user.created_date","basic_user.updated_date","user_role.user_role_id","user_role.user_role_role_id","user_role.user_role_userid","user_role.active","roles.role_id","roles.name")
                            ->where("user_username","=", $username)->where("user_password","=", $password)
                            ->orWhere("user_email","=", $username)->where("user_password","=", $password)
                            ->get();
                            
                            
         $search_results = $search_results->map(function($user) use ($generate_token) {
            $user->token = $generate_token;
            return $user;
             
         });
         
         if($search_results[0]->user_active==0){
             $id=$search_results[0]->user_id;
             $email=$search_results[0]->user_email;
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
            $generate_token = $this->generate_token();
            
             DB::table('account_activation')->insert([
                      'id_user' => $id,'email' => $email,'token' => $generate_token ,'date' => $date, 'submit' => 0,
        ]);
        
        
        $temp= $this->get_notification_template(32);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
        //working
             
         }
         
         
        $user_id= $search_results[0]->user_id;
        $user_role= $search_results[0]->user_role_role_id;
        $industry=array();
        
        if($user_role == 3){
            
            $industry = DB::table('basic_user')
                            ->join('industry_users', 'industry_users.user_id', '=', 'basic_user.user_id')
                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'industry_users.industry_id')
                            ->select("*")
                            ->where("industry_users.user_id","=", $user_id)
                            ->get();
        }

        $res = array($search_results,$industry);
		return $res;
		 
     }
     
    public function activate_account($token){
   
        $resp="";
   
        $rows = DB::table('account_activation')
                ->join('basic_user', 'basic_user.user_id', '=', 'account_activation.id_user')
                ->select('account_activation.*','basic_user.user_username')
                ->where("token","=",$token)->get();
        
        $username= $rows[0]->user_username;
        
        if(count($rows)==1){
            
               
    foreach ($rows as $row) {
    $email=$row->email;
    $sub=$row->submit;
    if($sub==1){$resp=array(0,"Account Already Activated","الرمز غير متوفر");}
        else{
            
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
             
            DB::table('account_activation')->where('token', $token)->update(['submit' => 1]);
            DB::table('basic_user')->where('user_email', $email)->update(['user_active' => 1]);
            
            //notification
            $user_id = DB::table('basic_user')
                            ->select('*')
                            ->where("user_email","=", $email)
                            ->where("user_active","=", 1)
                            ->get();
            $name=$user_id[0]->user_name;
            $username=$user_id[0]->user_username;
            
            $password=$user_id[0]->user_password;
            $login = $this->if_user_exist($username,$password); 
        
        //    $temp= $this->get_notification_template(23);
        //    $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
        //    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
         //   $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
           //working
            
            
       /*     DB::table('notifications')->insert([
                      'notification_user_id' => $user_id[0]->user_id,
                      'notification_job_id' => NULL ,
                      'notification_msg' => $msg,
                      'notification_date' => $date,
                      'notification_status' => 1,
                      'notification_type' => "welcome",
            ]); */
             
            
         
        //    $send_email =  $this->send_email($email_template,$email,$email_subject) ;
            
         
            $resp=array(1,"Account Activated Successfully!", "!تم تفعيل الحساب بنجاح" ,$username,$login);

        }
        
         }
            
        }
        else{$resp=array(0,"Token Not Available","الرمز غير متوفر" , $username); 
        }
        return $resp;
    }
     
    public function register_user($name,$username,$email,$pass,$gender,$phone,$office_number,$job,$newsletter){
        $username=strtolower($username);
        $if_exist=$this->if_new_user_exist($username,$email,$phone);
        
        if($if_exist[0]==0 & $if_exist[1]==0 & $if_exist[2]==0){
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
            $generate_token = $this->generate_token();
        
        $id=  DB::table('basic_user')->insertGetId([
            'user_name' => $name,'user_email' => $email,'user_username' => $username,'user_password' => $pass,'user_gender' => $gender,'user_mobile' => $phone,'user_office_number' => $office_number,'user_role' => $job,'user_active' => 0,'newsletter' => $newsletter,'created_date' => $date,'updated_date' => $date,
        ]);
            
        DB::table('user_role')->insert([
                      'user_role_userid' => $id,'user_role_role_id' => 3,'active' => 1,'created_date' => $date,'updated_date' => null,
        ]);
        
        DB::table('account_activation')->insert([
                      'id_user' => $id,'email' => $email,'token' => $generate_token ,'date' => $date, 'submit' => 0,
        ]);
        
        $arr = array($id,$name,3);
        
        $temp= $this->get_notification_template(32);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
        //working
        
        
        if($newsletter==1){$insert_mail_chimp=$this->mailchimp_new_subscriber($email,$name) ;}
        
        
        
        
        return $arr;
        }
        else{  return $if_exist;  }
                 
    }
    
    public function mailchimp_new_subscriber($email,$name){
     
     $dataCenter="us6";
     $listId="555cb54ca3";
     $data=array();
     $data['email']=$email;
     $memberId = md5(strtolower($data['email']));
     $data['status']="subscribed";
     $data['firstname']=$name;
     $apiKey="1d26d109059d5067f6ea13183bd54b86-us6";
     $url = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listId . '/members/' . $memberId;
     $json = json_encode([
        'email_address' => $data['email'],
        'status'        => $data['status'], // "subscribed","unsubscribed","cleaned","pending"
        'merge_fields'  => [
            'FNAME'     => $data['firstname'],
            'LNAME'     => $data['firstname']
        ]
    ]);

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $json);                                                                                                                 

    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
     
        
    }
    
    public function send_email($template,$email1,$subj){
       
       $res="";
       try {
           $data=array("temp"=>$template);
Mail::send('email_template.email_template', $data, function($message) use ($email1,$subj){
              $message->to($email1, $email1)->subject($subj);
              $message->from('info@levanhub.com','CNAM Portal');
                
            });
             $res= "done";
 // Catch the error
 } catch(\Swift_TransportException $e){
    if($e->getMessage()) {
       $res= "done";
    }    
 }
    return $res;

    }
    
    public function send_comment_email($template,$email1,$subj){
        $res="";
        try {

                
            });
             $res= "done";
 // Catch the error
 } catch(\Swift_TransportException $e){
    if($e->getMessage()) {
   $res= "done";
    }             
 }

    return $res;

    }
    
    public function generate_token(){
         $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 15; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    
    $times=time();
             
    return $randomString;
    }
    
    public function forget_password($email){
        $res="";
        $search_results = DB::table('basic_user')
                            ->select('*')
                            ->where("user_email","=", $email)
                            ->get();
                            
       if( count($search_results) == 1 ) {
           
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
            $generate_token = $this->generate_token();
         
            DB::table('reset_password')->insert([
                      'email' => $email,'token' => $generate_token ,'created_at' => $date, 'submit' => 0,
            ]);
            
            
            
            $link="http://localhost:3000/?reset_token=$generate_token&email=$email";
        
        $temp= $this->get_notification_template(24);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
            
            $res="ok";
       }
       
       else {$res= "not ok";}
       return $res;
    }
    
    public function generate_login_token($username,$password){
         $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 15; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    
    $search_results = DB::table('basic_user')
                            ->select("user_username")
                            ->where("user_username","=", $username)
                            ->orWhere("user_email","=", $username)
                            ->get();
    $username1=$search_results[0]->user_username;
    
    $times=time();
    $update = DB::table('basic_user')
    ->where('user_username','=', $username1)
    ->where('user_password','=', $password)
    ->update(['login_token' => md5($randomString) , 'login_at' =>$times]);
              
    return $randomString;
    }
    
    public function get_user_detail($userid,$token){
        $search_results="";
         $check_token_time= $this->check_user_token_time($userid, $token) ;
         $token=md5($token);
         if($check_token_time){
             $search_results = DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->join('roles', 'roles.role_id', '=', 'user_role.user_role_role_id')
                            ->select('basic_user.user_gender','basic_user.newsletter','basic_user.user_name',"basic_user.user_mobile","basic_user.user_office_number",'basic_user.user_email','basic_user.user_role','basic_user.user_gender','basic_user.user_department')
                            ->where("user_id","=", $userid)->where("login_token","=", $token)->get();
            
         }else{$search_results="token error";}
        return $search_results;
    }
    
    public function update_user($userid,$token,$name,$phone,$office_number,$job,$department,$department_spec){
        $update="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);
         if($check_token_time){
             
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
             
            $email= DB::table('basic_user')
                    ->select('user_email')
                    ->where("user_id","=", $userid)->where("login_token","=", $token)
                    ->get();
            $email= $email[0]->user_email;
            
            $update = DB::table('basic_user')->where('user_id','=', $userid)->where('login_token','=', $token)->update(['user_name' => $name , 'user_mobile' =>$phone,'user_office_number'=>$office_number,'user_role'=>$job]);
            
            if($department != NULL){
                if($department==50){
                    $userid= DB::table('basic_user')->select('user_id')->where('user_id','=', $userid)->where('login_token','=', $token)->get(); $userid= $userid[0]->user_id;
                    $department_id=  DB::table('option_list')->insertGetId(['slug' => 'departments','option_value_e' => $department_spec,'option_value_a' => $department_spec,'inserted_by' => $userid,'created_date' => $date,]);
                    $update= DB::table('basic_user')->where('user_id','=', $userid)->where('login_token','=', $token)->update(['user_department' => $department_id]);
                }
                else{
                    $update= DB::table('basic_user')->where('user_id','=', $userid)->where('login_token','=', $token)->update(['user_department' => $department]);
                }
            }
         
            $temp= $this->get_notification_template(25);
            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
         
         
         }else{$update="token error";}
         
         return $update;
    }
    
    public function get_job_details_byid($userid,$token,$jobid){
        $result="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        $role=0;
            if($check_token_time){
                
                $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
              }
                
                if($role==3){$check_user_of_job= $this->check_user_of_job($userid,$jobid);}
                $check_user_assigned_job= $this->check_user_assigned_job($userid,$jobid);
                
                
                if($role==4 || ($role==3 && $check_user_of_job) || ($role==1 && $check_user_assigned_job) ) {
                
                $check_type = DB::table('job')
                                ->select('job_type')
                                ->where("job_id","=", $jobid)
                                ->get();
                             
                           
                if(count($check_type)==1){
                
                    $type = $check_type[0]->job_type;
                    if($type=='challenge'){
                
                        $search_results = DB::table('job')
                                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('basic_user.user_name','industry_details.industry_details_company_name','job.job_user_id','job.job_type','job.job_status','job.created_date','job.updated_date','challenges.challenge_name','challenges.challenge_description','challenges.challenge_type','challenges.challenge_approach_spec','challenges.challenge_approach','challenges.challenge_time','challenges.challenge_comp_affected','challenges.challenge_comp_affected_spec','challenges.challenge_hear','challenges.challenge_cost','challenges.challenge_cost_spec')
                                        ->where("job_id","=", $jobid)
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                        $documents = DB::table('challenges_documents')
                                        ->select('challenges_documents.document_path','challenges_documents.document_name')
                                        ->where("job_id","=", $jobid)
                                        ->where("active","=", "1")
                                        ->get();
                        
                        $if_assigned = DB::table('assign_job')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                        ->select('basic_user.user_name','basic_user.user_id','basic_user.user_department')
                                        ->where("job_id","=", $jobid)
                                        ->get();
                    
                        $result=array();
                        array_push($result, $search_results);
                        
                        if(count($documents)>0){ array_push($result, $documents); } else{$documents=array(); array_push($result, $documents);}
                        
                        if(count($if_assigned)==1){ 
                            $if_assigned = $if_assigned->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                            array_push($result, $if_assigned);
                            
                        } else{$if_assigned=array(); array_push($result, $if_assigned);}
                        
                    }
                    else if($type=='internship'){
                        
                        $search_results = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('basic_user.user_name','industry_details.industry_details_company_name','job.job_user_id','job.job_type','job.job_status','job.created_date','job.updated_date','internship.internship_job_id','internship.internship_job_title','internship.internship_department','internship.internship_start_date','internship.internship_end_date','internship.internship_outline','internship.internship_institution_name','internship.internship_location','internship.internship_prior_work_experience','internship.internship_required_document','internship.internship_compensation_salary','internship.internship_brief_description','internship.internship_categorie_students','internship.student_major','internship.internship_length','internship.internship_link','internship.contact_details','internship.internship_locations')
                                        ->where("job_id","=", $jobid)
                                        ->where("job_active","=", "1")
                                        ->get();
                        
                        $empty_doc=array();                
                          
                        $if_assigned = DB::table('assign_job')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                        ->select('basic_user.user_name','basic_user.user_id','basic_user.user_department')
                                        ->where("job_id","=", $jobid)
                                        ->get();
                        
                        if(count($if_assigned)==1){
                            $if_assigned = $if_assigned->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                            
                            $result=array($search_results,$empty_doc,$if_assigned);
                        }
                        else{        
                            $if_assigned=array();
                            $result=array($search_results,$empty_doc,$if_assigned);
                        }
                       
                    }else{$result="error role";}
        
        
                }else{$result="error role";} 
                }else{$result="error role";}
                
            }else{$result="token error";}
            return $result;
        }
        
    public function post_comment($userid,$token,$msg,$jobid,$reply,$isp){
        $resp="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
         //   $options = array('cluster' => 'ap2','useTLS' => true);
         //   $pusher = new Pusher\Pusher('68291c08c4fcab3045a9','e40d6307a4f7e1f72fa1','1208784',$options);
         //   $pusher->trigger('my-channel', 'my-event', $data);
            
            date_default_timezone_set("Asia/Beirut");$date = date("Y/m/d H:i:s");
            
            
            if($reply==0){}
            else{
                $resp = DB::table('comments')->select('is_private')->where("comment_id","=", $reply)->get();
                $isp=$resp[0]->is_private;
                
                
            }
            
            $job_status= DB::table('job')
                            ->select('job_status')
                            ->where("job_id","=", $jobid)
                            ->get();
                            
            $job_status = $job_status[0]->job_status;
            
            $insert = DB::table('comments')->insertGetId(['user_id' => $userid,'message' => $msg,'job_id' => $jobid ,'job_status' => $job_status, 'reply' => $reply,'is_private' => $isp,'comment_type' => "text",'created_date' => $date,]);
            
            $resp = DB::table('comments')
                    ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                    ->select('comments.comment_id','comments.reply','comments.message','comments.is_private','comments.comment_type','basic_user.user_name','comments.created_date','comments.file_name')
                    ->where("comment_id","=", $insert)
                    ->get();
                    
        }else{$resp="token error";}
        return ($resp);
        }
        
    public function post_comment_notifications($userid,$token,$msg,$jobid,$reply,$isp,$message_id){
       $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            date_default_timezone_set("Asia/Beirut");$date = date("Y/m/d H:i:s");
            
            $user= DB::table('basic_user')
                    ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                    ->select('basic_user.user_name','user_role.user_role_role_id')
                    ->where("user_id","=", $userid)
                    ->get();
            $user_name=$user[0]->user_name;
            $user_role=$user[0]->user_role_role_id;
            
            $job= DB::table('job')
                        ->select('job_user_id','job_type')
                        ->where("job_id","=", $jobid)
                        ->get();
                        
            $job_type=$job[0]->job_type;
            
            if($job_type=='challenge'){
                $notification_type="challenge";
                $name = DB::table('job')
                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                        ->select('challenges.challenge_name')
                        ->where('job.job_id','=',$jobid)
                        ->get();
                
                $challenge_name=$name[0]->challenge_name;
                
                $in_temp= $this->get_notification_template(14);
                $in_email_subject = $in_temp[0]->email_subject;eval("\$in_email_subject = \"$in_email_subject\";");
                $in_email_template = $in_temp[0]->email_template;eval("\$in_email_template = \"$in_email_template\";");
                $industry_msg= $in_temp[0]->notification_message;eval("\$industry_msg = \"$industry_msg\";");
                
                $admintemp= $this->get_notification_template(15);
                $ad_email_subject = $admintemp[0]->email_subject;eval("\$ad_email_subject = \"$ad_email_subject\";");
                $ad_email_template = $admintemp[0]->email_template;eval("\$ad_email_template = \"$ad_email_template\";");
                $admin_msg = $admintemp[0]->notification_message;eval("\$admin_msg = \"$admin_msg\";");
                
                $re_temp= $this->get_notification_template(16);
                $re_email_subject = $re_temp[0]->email_subject;eval("\$re_email_subject = \"$re_email_subject\";");
                $re_email_template = $re_temp[0]->email_template;eval("\$re_email_template = \"$re_email_template\";");
                $reply_msg= $re_temp[0]->notification_message;eval("\$reply_msg = \"$reply_msg\";");
                
                
            }
            else if($job_type=='internship'){
                $notification_type="internship";
                $name = DB::table('job')
                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                        ->select('internship.internship_job_title')
                        ->where('job.job_id','=',$jobid)
                        ->get();
                        
                $internship_job_title= $name[0]->internship_job_title;
                
                $in_temp= $this->get_notification_template(11);
                $in_email_subject = $in_temp[0]->email_subject;eval("\$in_email_subject = \"$in_email_subject\";");
                $in_email_template = $in_temp[0]->email_template;eval("\$in_email_template = \"$in_email_template\";");
                $industry_msg= $in_temp[0]->notification_message;eval("\$industry_msg = \"$industry_msg\";");
                
                $admintemp= $this->get_notification_template(12);
                $ad_email_subject = $admintemp[0]->email_subject;eval("\$ad_email_subject = \"$ad_email_subject\";");
                $ad_email_template = $admintemp[0]->email_template;eval("\$ad_email_template = \"$ad_email_template\";");
                $admin_msg = $admintemp[0]->notification_message;eval("\$admin_msg = \"$admin_msg\";");
                
                $re_temp= $this->get_notification_template(13);
                $re_email_subject = $re_temp[0]->email_subject;eval("\$re_email_subject = \"$re_email_subject\";");
                $re_email_template = $re_temp[0]->email_template;eval("\$re_email_template = \"$re_email_template\";");
                $reply_msg= $re_temp[0]->notification_message;eval("\$reply_msg = \"$reply_msg\";");
            
                
            }
               
            $user_of_job=$job[0]->job_user_id;
            $assigned= DB::table('assign_job')
                            ->select('user_id')
                            ->where("job_id","=", $jobid)
                            ->get();
            
            if($reply==0){
                
                if(count($assigned)==1){
                    $user_assigned= $assigned[0]->user_id;
                    if($userid==$user_of_job){
                        $notify_industry=false;
                        $notify_admin=true;
                        $notify_assigned=true;
                    }
                    else if($userid==$user_assigned){
                        if($isp=='yes'){
                            $notify_industry=false;
                            $notify_admin=true;
                            $notify_assigned=false;
                        }else{
                            $notify_industry=true;
                            $notify_admin=true;
                            $notify_assigned=false;
                        }
                    }
                    else if($user_role==4){
                        if($isp=='yes'){
                            $notify_industry=false;
                            $notify_admin=false;
                            $notify_assigned=true;
                        }else{
                            $notify_industry=true;
                            $notify_admin=false;
                            $notify_assigned=true;
                        }
                    }
                }
                else{
                    if($userid==$user_of_job){
                        $notify_industry=false;
                        $notify_admin=true;
                        $notify_assigned=false;
                    }
                    else if($user_role==4){
                        $notify_industry=true;
                        $notify_admin=false;
                        $notify_assigned=false;
                    }
                }
            
                if($notify_industry){
                    DB::table('notifications')->insert([
                          'notification_user_id' => $user_of_job,
                          'notification_job_id' => $jobid ,
                          'notification_msg' => $industry_msg,
                          'notification_date' => $date,
                          'notification_status' => 1,
                          'notification_type' => $notification_type,
                          'action_type' => "discussions",
                    ]);
                    
                    $user_email= DB::table('basic_user')
                                ->select('user_email')
                                ->where("user_id","=", $user_of_job)
                                ->get();
                    $email=$user_email[0]->user_email;
                    
                    $send_email =  $this->send_email($in_email_template,$email,$in_email_subject) ;
                }
                
                if($notify_admin){
                    DB::table('admin_notifications')->insert([
                      'admin_notification_user_id' => $userid,
                      'admin_notification_job_id' => $jobid ,
                      'admin_notification_msg' => $admin_msg,
                      'admin_notification_date' => $date,
                      'admin_notification_status' => 1,
                      'admin_notification_type' => $notification_type,
                      'action_type' => "discussions",
                    ]);
                    
                    $admins= DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->select('user_email')
                            ->where("user_role.user_role_role_id","=", 4)
                            ->get();
                    
                    foreach($admins as $admin){
                        $email=$admin->user_email;
                        $send_email =  $this->send_email($ad_email_template,$email,$ad_email_subject) ;
                    }
    
                }
                
                if($notify_assigned){
                    DB::table('notifications')->insert([
                          'notification_user_id' => $user_assigned,
                          'notification_job_id' => $jobid ,
                          'notification_msg' => $industry_msg,
                          'notification_date' => $date,
                          'notification_status' => 1,
                          'notification_type' => $notification_type,
                          'action_type' => "discussions",
                    ]);
                    
                    $user_email= DB::table('basic_user')
                                ->select('user_email')
                                ->where("user_id","=", $user_assigned)
                                ->get();
                    $email=$user_email[0]->user_email;
                    
                    $send_email =  $this->send_email($in_email_template,$email,$in_email_subject) ;
                }
                
            }else{
                $reply = DB::table('comments')
                        ->select('user_id')
                        ->where("comment_id","=", $reply)
                        ->get();
                $user_reply=$reply[0]->user_id;
                
                $check_role= $this->return_user_role($user_reply);
                if(count($check_role)==1){ $role=$check_role[0]->user_role_role_id;}
                
                if($user_reply==$userid){
                }else{
                    if($role==4){
                        DB::table('admin_notifications')->insert([
                          'admin_notification_user_id' => $user_reply,
                          'admin_notification_job_id' => $jobid ,
                          'admin_notification_msg' => $reply_msg,
                          'admin_notification_date' => $date,
                          'admin_notification_status' => 1,
                          'admin_notification_type' => $notification_type,
                          'action_type' => "discussions",
                        ]);
                        //return $role;
                    }
                    else{
                        DB::table('notifications')->insert([
                          'notification_user_id' => $user_reply,
                          'notification_job_id' => $jobid ,
                          'notification_msg' => $reply_msg,
                          'notification_date' => $date,
                          'notification_status' => 1,
                          'notification_type' => $notification_type,
                          'action_type' => "discussions",
                        ]);
                        
                        $user_email= DB::table('basic_user')
                                    ->select('user_email')
                                    ->where("user_id","=", $user_reply)
                                    ->get();
                        $email=$user_email[0]->user_email;
                      
                        $send_email =  $this->send_email($re_email_template,$email,$re_email_subject) ;
                    }
                }
            }
            return "done";
        }
    }
        
    public function get_count_comments_by_jobid($userid,$token,$jobid){
        $count_comments="";
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
                
                $count_private_comments = DB::table('comments')
                            ->select('*')
                            ->where("job_id","=", $jobid)
                            ->where("is_private","=", "yes")
                            ->count();
                            
                $count_public_comments = DB::table('comments')
                            ->select('*')
                            ->where("job_id","=", $jobid)
                            ->where("is_private","=", "no")
                            ->count();
                
                $count_comments= array($count_private_comments,$count_public_comments);
                
            }else{$count_comments="token error";}
            return $count_comments;
        }
        
    public function check_user_token_time ($id, $token){
        
         $token= md5($token) ;
         $times= time();
         
         $search_results = DB::table('basic_user')
                            ->select('*')
                            ->where("user_id","=", $id)
                            ->where("login_token","=", $token)
                            ->get();
                            
       if( count($search_results) == 1 ) {
            $timestamp= $search_results[0]->login_at;
            if($times - $timestamp < 60*60  ) return true;
            else return false;
       }
        
		 
     }
     
    public function get_notifications($userid,$token){
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token);
        
        if($check_token_time){
            $last_notifications= DB::table('notifications')
                        ->select("*")
                        ->where("notification_user_id","=", $userid)
                        ->orderBy('notification_date', 'desc')
                        ->limit(10)
                        ->get();
            
            $unread_notifications= DB::table('notifications')
                        ->select("*")
                        ->where("notification_user_id","=", $userid)
                        ->where("notification_status","=", 1)
                        ->orderBy('notification_date', 'desc')
                        ->get();
                    
            $count_unread=count($unread_notifications);
                
            $all_notifications= DB::table('notifications')
                        ->select("*")
                        ->where("notification_user_id","=", $userid)
                        ->orderBy('notification_date', 'desc')
                        ->get();
                        
            $res= array($count_unread,$last_notifications,$all_notifications);
        
        }else{$res="token error";}
        return $res;
    }
    
    public function click_notification($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token);
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    $update= DB::table('admin_notifications')->update(['admin_notification_status' => 0]);  
                }
                else{
                    $update= DB::table('notifications')->where("notification_user_id","=", $userid)->update(['notification_status' => 0]);  
                }
            }
        
        }else{return"token error";}
    }
        
    public function if_new_user_exist($username,$email,$phone){   
        $data=array();$count=0;$emai=0;$user=0;$mobile=0;
    
        $users1 = DB::table('basic_user')->where("user_email","=",$email)->get();
        if(count($users1)>0){$emai=1;}
        
        $user2 = DB::table('basic_user')->where("user_mobile","=",$phone)->get();
        if(count($user2)>0){$mobile=1;}
        
        $users3 = DB::table('basic_user')->where("user_username","=",$username)->get();
        if(count($users3)>0){$user=1;}
       
       
        $data1=array($emai,$user,$mobile);
 
        return array($emai,$user,$mobile);
		
	}
	
	public function if_admin_new_user_exist($username,$phone){   
        $data=array();$user=0;$mobile=0;

        $user1 = DB::table('basic_user')->where("user_mobile","=",$phone)->get();
        if(count($user1)>0){$mobile=1;}
        
        $users2 = DB::table('basic_user')->where("user_username","=",$username)->get();
        if(count($users2)>0){$user=1;}
       
        $data1=array($user,$mobile);
 
        return array($user,$mobile);
		
	}

    public function check_reset_token($token,$email){
        $res="";
        $rows = DB::table('reset_password')
                            ->select('*')
                            ->where("email","=", $email)
                            ->where("token","=", $token)
                            ->where("submit","=", 0)
                            ->get();
        
       if(count($rows)==1){$res="ok";}
       else{$res="not ok";}
        return $res;

    }
    
    public function update_password($email,$new_pass,$token){
       $update="";
        $new_pass=md5($new_pass);
        
           $rows = DB::table('reset_password')
                            ->select('*')
                            ->where("email","=", $email)
                            ->where("token","=", $token)
                            ->where("submit","=", 0)
                            ->get();
        
       if(count($rows)==1){
           
           $update= DB::table('basic_user')->where('user_email', $email)->update(['user_password' => $new_pass]);
           $update= DB::table('reset_password')->where('email', $email)->where('token', $token)->update(['submit' => 1]);
           
            $temp= $this->get_notification_template(26);
            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
           
       }else{$update="error";}
        return $update;
    }
    
    public function get_job_discussion($userid,$token,$jobid,$private){
         $comments="";
         $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
                
                if($private=="yes"){
                    $comments = DB::table('comments')
                            ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                            ->select('comments.comment_id','comments.reply','comments.message','comments.is_private','comments.comment_type','basic_user.user_name','comments.created_date','comments.file_name')
                            ->where("job_id","=", $jobid)
                            ->orderBy('comment_id', 'asc')
                            ->get();
                }
                else{
                    $comments = DB::table('comments')
                            ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                            ->select('comments.comment_id','comments.reply','comments.message','comments.is_private','comments.comment_type','basic_user.user_name','comments.created_date','comments.file_name')
                            ->where("job_id","=", $jobid)
                            ->where("is_private","=", $private)
                            ->orderBy('comment_id', 'asc')
                            ->get();
                }
           
            }else{$comments= "token error";}
            return $comments;
        }
        
    public function check_user_of_job($userid,$jobid){
        $res="";
        $user_industry_id = $this->get_industry_id_by_user_id($userid);
        $industry_id=$user_industry_id[0]->industry_id;
        $search_results = DB::table('job')
                            ->select("*")
                            ->where("job_id","=", $jobid)
                            ->where("job_user_id","=", $userid)
                            ->where("job_industry_id","=", $industry_id)
                            ->where("job_active","=", "1")
                            ->get();
		
		if(count($search_results)==1){
		    $res= true;
		}else{$res= false;}
		return $res;
    }
    
    public function check_user_assigned_job($userid,$jobid){
       $res="";
        $search_results = DB::table('assign_job')
                            ->select("*")
                            ->where("job_id","=", $jobid)
                            ->where("user_id","=", $userid)
                            ->get();
		
		if(count($search_results)==1){
		    $res= true;
		}else{$res= false;}
		return $res;
    }
    
    public function return_user_role($user_id){
         
         $search_results = DB::table('user_role')
                            ->select("user_role_role_id")
                            ->where("user_role_userid","=", $user_id)->where("active","=", 1)->get();
		 return $search_results;
         
     }
     
    public function get_industry_id_by_user_id($id){
          $search_results = DB::table('industry_users')
                            ->select("industry_id")
                            ->where("user_id","=", $id)
                            ->get();
		 return $search_results;
     }
     
    public function change_password($userid,$token,$oldpass,$newpass){
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
             $oldpass=md5($oldpass);$newpass=md5($newpass);
             $user_id = DB::table('basic_user')
                            ->select('user_id')
                            ->where("user_id","=", $userid)
                            ->where("user_password","=", $oldpass)
                            ->get();
                            
                            
                if(count($user_id)==1){
                    
                    
                    DB::table('basic_user')->where('user_id', $userid)->update(['user_password' => $newpass]);
                    
                }
                else{return"wrong password";}
                       
            }
    } 
     
    public function update_admin_new_user($token,$username,$email,$gender,$pass,$phone,$office_number,$job,$department,$department_spec,$newsletter){
        $login="";
        $if_exist=$this->if_admin_new_user_exist($username,$phone);
        if($if_exist[0]==0 & $if_exist[1]==0){
            $pass=md5($pass);
            
            $rows = DB::table('users_from_admin_activation')
                    ->join('basic_user','basic_user.user_id','=','users_from_admin_activation.id_user')
                    ->select('*')
                    ->where("users_from_admin_activation.user_email","=", $email)
                    ->where("users_from_admin_activation.token","=", $token)
                    ->where("users_from_admin_activation.submit","=", 0)
                    ->where("basic_user.user_active","!=", 2)
                    ->get();
    
            if(count($rows)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                            
                $update= DB::table('basic_user')->where('user_email', $email)->update(['user_username' => $username,'user_gender' => $gender,'user_password' => $pass,'user_mobile' => $phone,'user_office_number' => $office_number,'user_role' => $job,'user_active' => 1,'updated_date' => $date,'newsletter' => $newsletter]);
                $update= DB::table('users_from_admin_activation')->where('user_email', $email)->where('token', $token)->update(['submit' => 1]);
                
                if($department != NULL){
                    if($department==50){
                        $userid= DB::table('basic_user')->select('user_id')->where('user_email', $email)->get(); $userid= $userid[0]->user_id;
                        $department_id=  DB::table('option_list')->insertGetId(['slug' => 'departments','option_value_e' => $department_spec,'option_value_a' => $department_spec,'inserted_by' => $userid,'created_date' => $date,]);
                        $update= DB::table('basic_user')->where('user_email', $email)->update(['user_department' => $department_id]);
                    }
                    else{
                        $update= DB::table('basic_user')->where('user_email', $email)->update(['user_department' => $department]);
                    }
                }
                
                //notification
                //email
                
                $user_id = DB::table('basic_user')
                                ->select('*')
                                ->where("user_email","=", $email)
                                ->where("user_active","=", 1)
                                ->get();
             
                $email=$user_id[0]->user_email;
                $username=$user_id[0]->user_username;
                $name=$user_id[0]->user_name;
            
                $temp= $this->get_notification_template(89);
                $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                
                $msg= $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                
                DB::table('notifications')->insert([
                          'notification_user_id' => $user_id[0]->user_id,
                          'notification_job_id' => NULL ,
                          'notification_msg' => $msg,
                          'notification_date' => $date,
                          'notification_status' => 1,
                          'notification_type' => "welcome",
                          'action_type' => "welcome",
                ]);
                
                
                   $user_id = DB::table('basic_user')
                            ->select('*')
                            ->where("user_email","=", $email)
                            ->where("user_active","=", 1)
                            ->get();
            $name=$user_id[0]->user_name;
            $username=$user_id[0]->user_username;
            
            $password=$user_id[0]->user_password;
            $login = $this->if_user_exist($username,$password); 
            
            }else{$login="activation token error";}
        }else{$login= $if_exist ;}
        return $login;
    }
    
    public function request_meeting($title,$name,$email,$phone,$time){
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
                
        DB::table('request_meeting')->insert([
                  'request_title' => $title,
                  'request_user_name' => $name ,
                  'request_user_email' => $email,
                  'request_user_phone' => $phone,
                  'request_meeting_time' => $time,
                  'created_date' => $date,
        ]);
        
        $temp= $this->get_notification_template(27);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
        
        $temp= $this->get_notification_template(28);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,'maroun.karam@greynab.com',$email_subject) ;

    }
    
    public function contact_us_submit($subject,$name,$email,$phone,$message){
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
                
        DB::table('contact_us_form')->insert([
                  'contact_name' => $name,
                  'contact_email' => $email,
                  'contact_phone' => $phone,
                  'contact_subject' => $subject,
                  'contact_body' => $message ,
                  'created_date' => $date,
        ]);
        
        $temp= $this->get_notification_template(27);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
        
        $ad_temp= $this->get_notification_template(39);
        $ad_email_subject = $ad_temp[0]->email_subject;eval("\$ad_email_subject = \"$ad_email_subject\";");
        $ad_email_template = $ad_temp[0]->email_template;eval("\$ad_email_template = \"$ad_email_template\";");
        $send_email =  $this->send_email($ad_email_template,'maroun.karam@greynab.com',$ad_email_subject) ;
    }
    
    public function get_notification_template($id){
        $msg = DB::table('notification_template')
                ->select('*')
                ->where("notification_id","=", $id)
                ->get();
        return $msg;
    }
    
    public function download_job_pdf($job_id){
        $file="";
         $check_type = DB::table('job')
                                ->select('job_type')
                                ->where("job_id","=", $job_id)
                                ->where("job_active","=", "1")
                                ->get();
                             
                    
                            
                if(count($check_type)==1){
                
                    $type = $check_type[0]->job_type;
                    if($type=='challenge'){
                        $challenge = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                    ->select('job.*','challenges.*','basic_user.*','industry_details.*')
                                    ->where('job.job_id', $job_id)
                                    ->where("job.job_active","=", "1")
                                    ->get();
                                    
                        $assigned_to= DB::table('basic_user')
                                    ->join('assign_job', 'assign_job.user_id', '=', 'basic_user.user_id')
                                    ->select('basic_user.user_name')
                                    ->where('assign_job.job_id', $job_id)
                                    ->get();
                        if(count($assigned_to)>0){$assigned_to= $assigned_to[0]->user_name;}
                        else{$assigned_to="Not Assigned";}
                                    
                        $challenge_name=$challenge[0]->challenge_name;
                        $challenge_type=$challenge[0]->challenge_type;
                        $challenge_description=$challenge[0]->challenge_description;
                        $challenge_approach=$challenge[0]->challenge_approach;
                        $challenge_approach_spec=$challenge[0]->challenge_approach_spec;    $approach1= $challenge_approach.' , '.$challenge_approach_spec;
                        $time=$challenge[0]->challenge_time;
                        $affected=$challenge[0]->challenge_comp_affected;
                        $affected_spec=$challenge[0]->challenge_comp_affected_spec;   $affected1= $affected.' , '.$affected_spec;
                        $cost=$challenge[0]->challenge_cost;
                        $cost_spec=$challenge[0]->challenge_cost_spec;   $cost1= $cost.' , '.$cost_spec;
                        $hear=$challenge[0]->challenge_hear;
                        
                        $job_status=$challenge[0]->job_status;
                        $created_date=$challenge[0]->created_date;
                        $name=$challenge[0]->user_name;
                        
                        $industryname=$challenge[0]->industry_details_company_name;
                        $industry_website=$challenge[0]->industry_details_company_website;
                        $industry_email=$challenge[0]->industry_details_company_email;
                        $industry_age=$challenge[0]->industry_details_company_age;
                        $industry_country=$challenge[0]->industry_details_company_address_country;
                        $industry_headquarter=$challenge[0]->industry_details_headquarter;
                        $industry_address1=$challenge[0]->industry_details_company_address_line1;
                        $industry_address2=$challenge[0]->industry_details_company_address_line2;
                        $industry_type=$challenge[0]->industry_details_industry_type;
                        $company_type=$challenge[0]->industry_details_company_type;
                        $nbr_employee=$challenge[0]->industry_details_company_number_employee;
                        $primary_product=$challenge[0]->industry_details_company_primary_product;
                        $main_customer=$challenge[0]->industry_details_company_main_customer;
                        $created_date= $challenge[0]->created_at;
                          
                        $title="$challenge_name";
                        
                        $main_string="";
                            $mains = explode(",", $main_customer);
                            foreach($mains as $main) {
                                $main_name= DB::table('main_customers')->select('*')->where('id_main_customer', $main)->get();
                                if(count($main_name)>0){$main_string.=$main_name[0]->name_customer." - ";}
                            }$main_string=substr($main_string, 0, -2);
                        
                        $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                            
                            
                            
                        $headquarter_string="";
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                        $headquarter_string=$head_name[0]->option_value_e;
                        
                        
                        $company_string="";    
                            $companys = explode(",", $company_type);
                            foreach($companys as $comp) {
                                $comp_name= DB::table('option_list')->select('*')->where('option_id', $comp)->where('slug', 'company-type')->get();
                                if(count($comp_name)>0){$company_string.=$comp_name[0]->option_value_e." - ";}
                            }$company_string=substr($company_string, 0, -2);
                        
                        $employee_string="";    
                            $employee = explode(",", $nbr_employee);
                            foreach($employee as $employee) {
                                $employee_name= DB::table('option_list')->select('*')->where('option_id', $employee)->where('slug', 'number-employee')->get();
                                if(count($employee_name)>0){$employee_string.=$employee_name[0]->option_value_e." - ";}
                            }$employee_string=substr($employee_string, 0, -2);
                        
                        
                        $content='  
                                    <tr><th>Challenge Type</th><td>'.$challenge_type.'</td></tr>
                                    <tr><th>Challenge Description</th><td>'.$challenge_description.'</td></tr>
                                    <tr><th>Challenge Approach</th><td>'.$challenge_approach.' '.$challenge_approach_spec.'</td></tr>
                                    <tr><th>Time</th><td>'.$time.'</td></tr>
                                    <tr><th>Is the company affected?</th><td>'.$affected.' '.$affected_spec.'</td></tr>
                                    <tr><th>Job Status</th><td>'.$job_status.'</td></tr>
                                    <tr><th>Industry Referral</th><td>'.$hear.'</td></tr>
                                    <tr><th>Uploader</th><td>'.$name.'</td></tr>
                                    <tr><th>Assigned to</th><td>'.$assigned_to.'</td></tr>
                                    <tr><th>Created Date</th><td>'.$created_date.'</td></tr>';
                                  $fad=$industry_address1.' , '.$industry_address2;
                        $content2='  
                                    <tr><th>Industry Name</th><td>'.$industryname.'</td></tr>
                                    <tr><th>Industry Website</th><td>'.$industry_website.'</td></tr>
                                    <tr><th>Industry Email</th><td>'.$industry_email.'</td></tr>
                                    <tr><th>Industry Age</th><td>'.$industry_age.'</td></tr>
                                    <tr><th>Industry Country</th><td>'.$industry_country.'</td></tr>
                                    <tr><th>Industry Headquarter</th><td>'.$headquarter_string.'</td></tr>
                                    <tr><th>Industry Address</th><td>'.$industry_address1.' , '.$industry_address2.'</td></tr>
                                    <tr><th>Industry Type</th><td>'.$industry_string.'</td></tr>
                                    <tr><th>Company Type</th><td>'.$company_string.'</td></tr>
                                    <tr><th>Number of employee</th><td>'.$employee_sting.'</td></tr>
                                    <tr><th>Company Primary Product</th><td>'.$primary_product.'</td></tr>
                                    <tr><th>Company Main Customer</th><td>'.$main_string.'</td></tr>
                                    <tr><th>Created Date</th><td>'.$created_date.'</td></tr>';
                                    
                                    
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                        $path = 'https://kpp.aks.kaust.edu.sa/static/media/header_logo.e60267f9.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $data = file_get_contents($path);
                        $logo = 'data:image/' . $type . ';base64,' . base64_encode($data);
        
                        $html='<!DOCTYPE html>
                        <html>
                            <head>
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                            <style>
                                table, th, td {
                                  border: 1px solid black;
                                  border-collapse: collapse;
                                }
                                th, td {
                                  padding: 5px;
                                  text-align: left;
                                }
                            </style>
                            </head>
                            <body>
                                <div class="row">
                                    <img style="width:300px; height:auto;" src='.$logo.'/>
                                    <span style="float:right;">'.$today_date.'</span>
                                </div>
                                <div class="row">
                                    <h2>'.$title.'</h2>
                                    <table style="width:100%">
                                     '.$content.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>Industry informations</h2>
                                    <table style="width:100%">
                                     '.$content2.'
                                    </table>
                                </div>
                            </body>
                        </html>
                        ';
                        
                        $file_name="export.pdf";  
                        $dompdf = new DOMPDF();
                        $dompdf->set_paper('a4','landscape');
                        $dompdf->loadHtml($html);
                        $dompdf->render();
                        $output = $dompdf->output();
                        $file= base64_encode($output);
                    
                    }
                    else if($type=='internship'){
                        
                        $search_results = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('job.*','internship.*','industry_details.*')
                                        ->where("job_id","=", $job_id)
                                        ->where("job_active","=", "1")
                                        ->get();
                     
   if(count($search_results)==1){
                            $title = $search_results[0]->internship_job_title;
                            $lenght = $search_results[0]->internship_length;
                            $outline = $search_results[0]->internship_outline;
                            $department = $search_results[0]->internship_department;
                            $start = $search_results[0]->internship_start_date;
                            $end = $search_results[0]->internship_end_date;
                            $exp = $search_results[0]->internship_prior_work_experience;
                            $salary= $search_results[0]->internship_compensation_salary;
                            $contact_detail= $search_results[0]->contact_details;
                            $link= $search_results[0]->internship_link;
                             
                            $documents= $search_results[0]->internship_required_document;
                            $desc= $search_results[0]->internship_brief_description;
                             
                            $categorie = $search_results[0]->internship_categorie_students;
                            $major = $search_results[0]->student_major;
                             
                            $company_name = $search_results[0]->internship_institution_name;
                            $company_location = $search_results[0]->industry_details_company_address_country;
                             
                            $department_string="";
                            $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                            $department_string=$department_name[0]->option_value_e;
                             
                             date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kpp.aks.kaust.edu.sa/static/media/header_logo.e60267f9.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $data = file_get_contents($path);
                        $logo = 'data:image/' . $type . ';base64,' . base64_encode($data);
                        
                        
                        
                             $html='<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
    <title>Internship Information Template</title>
</head>

<body>
<div class="row">
                                    <img style="width:300px; height:auto;" src='.$logo.'/>
                                    <span style="float:right;">'.$today_date.'</span>
                                </div>
    <div class="container">

        <div class=" d-flex justify-content-center" style="text-align:center">
            <div class="h3 mt-3 text-decoration-underline">KAUST KPP Internship</div>
        </div>

        <div class="mt-5 d-flex"  >
            <div class="h5" >Name Of Institution/Company: '.$company_name.'</div>
            <div class="h5" >Location:'.$company_location.' </div>
        </div>

        <div class="mt-1" >
            <div class="h5">Internship Length:'.$lenght.'</div>
        </div>

        <div class="mt-1 d-flex">
            <div class="h5">Job Title:'.$title.' </div>
            <div class="h5">Department:'.$department_string.'</div>
        </div>

        <div class="mt-1" style="margin-top: 4px;">
            <div class=""> <span class="h6">Important note: </span> Important note: Internship positions should be STEM
                related (for more information please refer to KAUST’s study areas https://www.kaust.edu.sa/en).</div>
        </div>

        <div class="mt-1 p-2" style="padding:10px;border: 1px solid black;height: 40px;padding:10px">
            <div class="h6 text-decoration-underline">Expected start date:'.$start.'</div>
            <div>Expected end date:'.$end.'  </div>
        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Outline of the research or practical trading experience and the roles and responsibilities of the position:</div>

        <div class="mt-1 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$outline.'</div>
        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Category of students and major(s) most appropriate for the opportunity at your institution:</div>


        <div class="mt-1 p-2" style="border: 1px solid black;padding:10px">
            <div class="d-flex">
                <div>'.$categorie.'</div>
                <div>1-'.$major.'</div>
                
            </div>

        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Prior work experience or technical skills requirements: </div>
        <div class="mt-3 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$exp.'</div>
        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Compensation & Salary:</div>
        <div class="mt-3 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$salary.'</div>
        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Contact details of the person in your institution managing the administrative details like internship submissions , Visa request documentation and accomodation issues: </div>
        <div class="mt-3 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$contact_detail.'</div>
        </div>

        <div class="h6" style="margin-top:10px;margin-bottom:5px">Link used to submit internship application:</div>
        <div class="mt-3 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$link.'</div>
         
        </div>
        
        <div class="h6" style="margin-top:10px;margin-bottom:5px">Please list required documents to be included with student s application such as letter of recommendation from kaust faculty advisor, transcript, statement of purpose, etc.:</div>
        <div class="mt-3 p-2" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$documents.'</div>
        </div>

       

        <div class="h6" style="margin-top:10px;margin-bottom:5px">A brief description about your company</div>
        <div class="mt-3 p-2 mb-5" style="border: 1px solid black;padding:10px">
            <div class="h6 text-decoration-underline">'.$desc.'</div>
          
        </div>

    </div>







</body>

</html>';
       
       
       
       

        $dompdf = new DOMPDF();
        $dompdf->set_paper('a4','landscape');
        $dompdf->loadHtml($html);
        $dompdf->render();
        $output = $dompdf->output();
        $file= base64_encode($output);
                              
                                       }


                            $file="error";
                            
                            
                    
                    }else{$file="not internship";}
                }else{$file="no type";} 
        
        return $file;
    }
}