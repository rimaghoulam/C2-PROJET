<?php
namespace App\Http\Controllers\MAIN;

use Illuminate\Support\Facades\DB;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


use App\Http\Controllers\Controller;
use App\Http\Controllers\MAIN\Functions;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request; 
use Illuminate\Http\Response;
use Session;
use Redirect;
use Dompdf\Dompdf;
use Mail;

use App\Images;
use Image;

class MainController extends Controller
{
    
     protected $Functions;
    public function __construct(Functions $Functions)
    {
        $this->Functions = $Functions;
    }
    

   
    
     public function Check_Login($request){
        $username = $request->input('username');$password = $request->input('password');
      
        $password=md5($password);$generate_token=null;
		$login = $this->Functions->if_user_exist($username,$password);
		return response(json_encode($login))
		->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Register_User($request){
       $name = $request->input('name');$username = $request->input('username');$email = $request->input('email');$pass = $request->input('pass');$pass = md5($pass); $gender = $request->input('gender');$country_code_1 = $request->input('country_code_1');$phone = $request->input('phone');$phone= $country_code_1." ".$phone;$country_code_2 = $request->input('country_code_2');$office_number= $request->input('office_number');$office_number= $country_code_2." ".$office_number;$job = $request->input('job');$newsletter = $request->input('newsletter');
	   $insert_user = $this->Functions->register_user($name,$username,$email,$pass,$gender,$phone,$office_number,$job,$newsletter);
	   return response(json_encode($insert_user))
		->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');

    }
    
    public function activate_account($request){
       $token = $request->input('token');
	   $insert_user = $this->Functions->activate_account($token);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Forget_Password($request){
        $email = $request->input('email');
        $forget_pass = $this->Functions->forget_password($email);
        return response(json_encode($forget_pass))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
       
    public function Update_Password($request){
        $email = $request->input('email'); $newpass = $request->input('newpass');$token = $request->input('token');
        $update_password = $this->Functions->update_password($email,$newpass,$token);
        return response(json_encode($update_password))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
       
    public function Get_User_Detail($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $user_detail = $this->Functions->get_user_detail($userid,$token);
        return response(json_encode($user_detail))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Update_User_Detail($request){
       $userid = $request->input('userid');$token = $request->input('token');
       $name = $request->input('name');
       $country_code_1 = $request->input('country_code_1');
       $phone = $request->input('phone');$phone= $country_code_1." ".$phone;
       $country_code_2 = $request->input('country_code_2');
       $office_number= $request->input('office_number');$office_number= $country_code_2." ".$office_number;
       $job = $request->input('job');$department = $request->input('department'); $department_spec = $request->input('department_spec');
       
	   $insert_user = $this->Functions->update_user($userid,$token,$name,$phone,$office_number,$job,$department,$department_spec);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Job_Details_Byid($request){
          $userid = $request->input('userid'); $token = $request->input('token'); $jobid = $request->input('jobid');
          $get_job_details_byid = $this->Functions->get_job_details_byid($userid,$token,$jobid);
          return response(json_encode($get_job_details_byid))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Post_Comment($request){
          $userid = $request->input('userid'); $token = $request->input('token'); $msg = $request->input('msg'); $jobid = $request->input('jobid'); $reply = $request->input('reply');$isp = $request->input('isprivate');
          $post_comment = $this->Functions->post_comment($userid,$token,$msg,$jobid,$reply,$isp);
          return response(json_encode($post_comment))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Post_Comment_Notifications($request){
          $userid = $request->input('userid'); $token = $request->input('token');$msg= $request->input('msg');$jobid= $request->input('jobid'); $reply = $request->input('reply');$isp = $request->input('isprivate');$message_id = $request->input('message_id');
          $post_comment = $this->Functions->post_comment_notifications($userid,$token,$msg,$jobid,$reply,$isp,$message_id);
          return response(json_encode($post_comment))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Count_Comments_By_Jobid($request){
          $userid = $request->input('userid'); $token = $request->input('token'); $jobid = $request->input('jobid');
          $get_count_comments_by_jobid = $this->Functions->get_count_comments_by_jobid($userid,$token,$jobid);
          return response(json_encode($get_count_comments_by_jobid))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Notifications($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_notifications = $this->Functions->get_notifications($userid,$token);
          return response(json_encode($get_notifications))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Click_Notification($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $click_notification = $this->Functions->click_notification($userid,$token);
          return response(json_encode($click_notification))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function get_job_discussion($request){
        $userid = $request->input('userid'); $token = $request->input('token');$jobid = $request->input('jobid');$private = $request->input('private');
        $get_job_discussion = $this->Functions->get_job_discussion($userid,$token,$jobid,$private);
        return response(json_encode($get_job_discussion))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        
    }
    
    public function check_reset_token($request){
        $token = $request->input('token'); $email = $request->input('email');
        $check_reset_token = $this->Functions->check_reset_token($token,$email);
        return response(json_encode($check_reset_token))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        
    }
    
    public function Update_Admin_New_User($request){
        $token = $request->input('token');$username = $request->input('username'); $email = $request->input('email');$gender = $request->input('gender');$pass = $request->input('pass'); $phone = $request->input('phone');$office_number = $request->input('office_number');$job = $request->input('job');
        $country_code_1 = $request->input('country_code_1');
       $phone = $request->input('phone');$phone= $country_code_1." ".$phone;
       $country_code_2 = $request->input('country_code_2');$newsletter = $request->input('newsletter');
       $office_number= $request->input('office_number');$office_number= $country_code_2." ".$office_number;$department = $request->input('department');$department_spec = $request->input('department_spec');
        $update = $this->Functions->update_admin_new_user($token,$username,$email,$gender,$pass,$phone,$office_number,$job,$department,$department_spec,$newsletter);
	    return response(json_encode($update))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function change_password($request){
        $token = $request->input('token'); $userid = $request->input('userid');$oldpass = $request->input('oldpass');$newpass = $request->input('newpass');
        $change_password = $this->Functions->change_password($userid,$token,$oldpass,$newpass);
        return response(json_encode($change_password))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        
    }
    
    public function discussion_attachment($request){
         
        $userid = $request->input('userid'); $token = $request->input('token');
        $comment = $request->input('commentid'); $job = $request->input('jobid');
        $isp = $request->input('isprivate');$file_name = $request->input('fileName');
        
        
        $job_status= DB::table('job')
                            ->select('job_status')
                            ->where("job_id","=", $job)
                            ->get();
                            
            $job_status = $job_status[0]->job_status;
 
$path=$_FILES['file']['name'];
$type = pathinfo($path, PATHINFO_EXTENSION);
$image=addslashes($_FILES['file']['tmp_name']);
$image= file_get_contents($image);
$image= base64_encode($image);
$base64 = 'data:image/' . $type . ';base64,' . $image;



  
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
        //     if(true){
        $insert = DB::table('comments')->insertGetId([
                                            'user_id' => $userid,
                                            'message' => $base64,
                                            'file_name' => $file_name,
                                            'job_id' => $job,
                                            'job_status' => $job_status,
                                            'reply' => $comment,
                                            'is_private' => $isp,
                                            'comment_type' => "media",
                                            'created_date' => $date,
                                        ]);
        
        
        $resp = DB::table('comments')
                ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                ->select('comments.*','basic_user.*')
                ->where("comment_id","=", $insert)
                ->get();
       
        return $resp;
        
        
     }
    
    
    public function Request_Meeting($request){
        $title = $request->input('title');$name = $request->input('name'); $email = $request->input('email'); $phone = $request->input('phone'); $time = $request->input('time');
        $request_meeting = $this->Functions->request_meeting($title,$name,$email,$phone,$time);
	    return response(json_encode($request_meeting))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function contact_us_submit($request){
        $name = $request->input('name'); $email = $request->input('email'); $phone = $request->input('phone'); $subject = $request->input('subject');
        $message = $request->input('message');
        $contact_us_submit = $this->Functions->contact_us_submit($subject,$name,$email,$phone,$message);
	    return response(json_encode($contact_us_submit))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function download_job_pdf($request){
        $job_id = $request->input('jobid');
        $download_job_pdf = $this->Functions->download_job_pdf($job_id);
	    return response(json_encode($download_job_pdf))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
}