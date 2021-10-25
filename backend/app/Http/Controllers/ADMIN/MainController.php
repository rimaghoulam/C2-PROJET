<?php
namespace App\Http\Controllers\ADMIN;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ADMIN\Functions;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request; 
use Illuminate\Http\Response;
use Session;
use Redirect;
use Dompdf\Dompdf;

class MainController extends Controller
{
    protected $Functions;
    public function __construct(Functions $Functions)
    {
        $this->Functions = $Functions;
    }
    
    public function Get_User_Info_Company($request){
          $myid = $request->input('myid'); $token = $request->input('token'); $userid = $request->input('userid');
          $get_user_info_company = $this->Functions->get_user_info_company($myid,$token,$userid);
          return response(json_encode($get_user_info_company))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function get_admin_dashboard($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $dashboard_page = $this->Functions->get_admin_dashboard($userid,$token);
	    return response(json_encode($dashboard_page))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_kaust_talents($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $dashboard_page = $this->Functions->get_kaust_talents($userid,$token);
	    return response(json_encode($dashboard_page))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function respond_challenge($request){
        $userid = $request->input('userid');$token = $request->input('token');$job_id = $request->input('job_id');$action = $request->input('action');
        $dashboard_page = $this->Functions->respond_challenge($userid,$token,$job_id,$action);
	    return response(json_encode($dashboard_page))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        
    }
    
    public function Get_Users_By_Industry_Id($request){
          $adminid = $request->input('adminid'); $token = $request->input('token');  $industryid = $request->input('industryid');
          $users_by_industry = $this->Functions->get_users_by_industry_id($adminid,$token,$industryid);
          return response(json_encode($users_by_industry))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Documents_By_Industry_Id($request){
          $adminid = $request->input('adminid'); $token = $request->input('token');  $id = $request->input('id');$type = $request->input('type');
          $docs_by_industry = $this->Functions->get_documents_by_industry_id($adminid,$token,$id,$type);
          return response(json_encode($docs_by_industry))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Jobs_By_Industry_Id($request){
          $adminid = $request->input('adminid'); $token = $request->input('token');  $industryid = $request->input('industryid');
          $jobs_by_industry = $this->Functions->get_jobs_by_industry_id($adminid,$token,$industryid);
          return response(json_encode($jobs_by_industry))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Discussion_By_Job_Id($request){
          $adminid = $request->input('adminid'); $token = $request->input('token');  $jobid = $request->input('jobid');
          $disc_by_job = $this->Functions->get_discussion_by_job_id($adminid,$token,$jobid);
          return response(json_encode($disc_by_job))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Get_All_Users($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $all_users = $this->Functions->get_all_users($userid,$token);
          return response(json_encode($all_users))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_User_Posted_Job($request){
        $adminid = $request->input('adminid'); $token = $request->input('token'); $userid = $request->input('userid');
        $get_user_posted_job = $this->Functions->get_user_posted_job($adminid,$token,$userid);
        return response(json_encode($get_user_posted_job))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
        
    public function Assign_Job($request){
          $adminid = $request->input('adminid'); $token = $request->input('token'); $userid = $request->input('userid'); $jobid = $request->input('challengeid'); $status = $request->input('status');
          $assign_job = $this->Functions->assign_job($adminid,$token,$userid,$jobid,$status);
          return response(json_encode($assign_job))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_All_Industry($request){
          $adminid = $request->input('adminid'); $token = $request->input('token');
          $get_all_industry = $this->Functions->get_all_industry($adminid,$token);
          return response(json_encode($get_all_industry))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_All_Documents($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_documents = $this->Functions->get_all_documents($userid,$token);
          return response(json_encode($get_all_documents))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Check_User_Activation_Token($request){
        $token = $request->input('token'); $email = $request->input('email');
        $get_token = $this->Functions->check_user_activation_token($token,$email);
        return response(json_encode($get_token))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
        
    public function Admin_Add_New_User($request){
          $adminid = $request->input('adminid'); $token = $request->input('token'); $name = $request->input('name'); $email = $request->input('email'); $industryid = $request->input('industryid'); 
          $add_new_user = $this->Functions->admin_add_new_user($adminid,$token,$name,$email,$industryid);
          return response(json_encode($add_new_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Delete_Document($request){
          $userid = $request->input('userid'); $token = $request->input('token'); $document_type = $request->input('documenttype'); $id_row = $request->input('idrow');
          $delete_document = $this->Functions->delete_document($userid,$token,$document_type,$id_row);
          return response(json_encode($delete_document))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function deactivate_user($request){
        $userid = $request->input('userid');$token = $request->input('token');$id_to_delete = $request->input('id_to_delete');
        $deactivate_user = $this->Functions->deactivate_user($userid,$token,$id_to_delete);
	    return response(json_encode($deactivate_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function upload_nda($request){
    /*    $rand=rand(1000,100000);$rand2=rand(1000,100000);$rand1=$rand*$rand2;
$filename = $rand1."-profile-".$_FILES['file']['name'];
$ffname=$_FILES['file']['name'];
$location = "uploads/nda/".$filename;
$uploadOk = 1;
$imageFileType = pathinfo($location,PATHINFO_EXTENSION);
$valid_extensions = array("pdf");
if( !in_array(strtolower($imageFileType),$valid_extensions) ) {$uploadOk = 0;}
if($uploadOk == 0){ echo 0;}else{
  
   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      echo $location;
   }else{
      echo 0;
   }
}
  */
$image=addslashes($_FILES['file']['tmp_name']);
//$image= addslashes($_FILES['image']['name']);
$image= file_get_contents($image);
$image= base64_encode($image);
  echo$image;
        
    }
    
    public function Get_Admin_User_Detail($request){
        $userid = $request->input('userid');$token = $request->input('token');$user = $request->input('user');
        $user_detail = $this->Functions->get_admin_user_detail($userid,$token,$user);
        return response(json_encode($user_detail))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Update_User_Detail($request){
       $userid = $request->input('userid');$token = $request->input('token');$id_to_edit = $request->input('id_to_edit');
       $name = $request->input('name');
       $country_code_1 = $request->input('country_code_1');
       $phone = $request->input('phone');$phone= $country_code_1." ".$phone;
       $country_code_2 = $request->input('country_code_2');
       $office_number= $request->input('office_number');$office_number= $country_code_2." ".$office_number;
       $job = $request->input('job');
       
	   
	   $insert_user = $this->Functions->update_user($id_to_edit,$userid,$token,$name,$phone,$office_number,$job);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Company_Detail($request){
        $userid = $request->input('userid');$token = $request->input('token');$user = $request->input('user');
        $user_detail = $this->Functions->get_company_detail($userid,$token,$user);
        return response(json_encode($user_detail))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Admin_Update_Company($request){
       $adminid = $request->input('adminid');$token = $request->input('token');
       $headquarter= $request->input('headquarter');$address1= $request->input('address1');$address2 = $request->input('address2');$caddress = $request->input('cAddress');$cemail = $request->input('cEmail');$cname = $request->input('cName');$cType= $request->input('cType');
       $customer = $request->input('customer');$employees = $request->input('employees');$file = $request->input('file');$iType = $request->input('iType');$link = $request->input('link');$product= $request->input('product');
       $social = $request->input('social');$userid = $request->input('userid');$website = $request->input('website');
       $insert_user = $this->Functions->admin_update_company($adminid,$token,$userid,$headquarter,$address1,$address2,$caddress,$cemail,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$website);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Admin_Notifications($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_admin_notifications = $this->Functions->get_admin_notifications($userid,$token);
        return response(json_encode($get_admin_notifications))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_jobs_by_admin($request){
        $userid = $request->input('userid'); $token = $request->input('token');$type_of_id = $request->input('type_of_id'); $entity_id= $request->input('entity_id');
        $get_jobs_by_admin = $this->Functions->get_jobs_by_admin($userid,$token,$type_of_id,$entity_id);
        return response(json_encode($get_jobs_by_admin))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_admin_statistics($request){
        $adminid = $request->input('adminid'); $token = $request->input('token');
        $statistics = $this->Functions->get_admin_statistics($adminid,$token);
        return response(json_encode($statistics))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_admin_statistics_details($request){
        $adminid = $request->input('adminid'); $token = $request->input('token'); $type = $request->input('type'); $status = $request->input('status');
        $statistics = $this->Functions->get_admin_statistics_details($adminid,$token,$type,$status);
        return response(json_encode($statistics))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Mailchimp_Lists($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $list = $this->Functions->get_mailchimp_lists($userid,$token);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_jobs($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$toj = $request->input('toj');$jobs_id = $request->input('jobs_id');
        $list = $this->Functions->export_jobs($userid,$token,$toe,$toj,$jobs_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_custom_challenges($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $from_date = $request->input('from_date'); $to_date = $request->input('to_date');
        $challenge_type = $request->input('challenge_type');$hear = $request->input('hear');
        $export = $this->Functions->export_custom_challenges($userid,$token,$from_date,$to_date,$challenge_type,$hear);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_custom_internships($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $from_date = $request->input('from_date'); $to_date = $request->input('to_date');
        $internship_length = $request->input('internship_length');$major = $request->input('major');
        $export = $this->Functions->export_custom_internships($userid,$token,$from_date,$to_date,$internship_length,$major);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_users($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$users_id = $request->input('users_id');
        $export = $this->Functions->export_users($userid,$token,$toe,$users_id);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_custom_users($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $from_date = $request->input('from_date'); $to_date = $request->input('to_date');
        $department = $request->input('department');$status = $request->input('status');
        $export = $this->Functions->export_custom_users($userid,$token,$from_date,$to_date,$department,$status);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_industry($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$industries_id = $request->input('industries_id');
        $list = $this->Functions->export_industry($userid,$token,$toe,$industries_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_industry_users($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$users_id = $request->input('users_id');$industry_id = $request->input('industry_id');
        $list = $this->Functions->export_industry_users($userid,$token,$toe,$users_id,$industry_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_all_industry_users($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$users_id = $request->input('users_id');
        $list = $this->Functions->export_all_industry_users($userid,$token,$toe,$users_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_dashboard($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $toe = $request->input('toe');
        $list = $this->Functions->export_dashboard($userid,$token,$toe);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function emails_filtering($request){
        $email = $request->input('email'); $pass = $request->input('pass');
        $login = $this->Functions->emails_filtering($email,$pass);
        return response(json_encode($login))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Re_Post_Comment($request){
        $adminid = $request->input('adminid'); $token = $request->input('token'); $msg = $request->input('msg'); $jobid = $request->input('job'); $reply = $request->input('reply'); $email = $request->input('email_number');$user = $request->input('user');$date = $request->input('date');$date="2021-07-15 11:01:58";
        $username = $request->input('email'); $password = $request->input('password');
        $post_comment = $this->Functions->re_post_comment($adminid,$token,$msg,$jobid,$reply,$user,$date,$email,$username,$password);
        return response(json_encode($post_comment))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Activate_industry($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $industryid = $request->input('industryid');
        $activate_industry = $this->Functions->activate_industry($userid,$token,$industryid);
        return response(json_encode($activate_industry))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function View_Timeline($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $jobid=$request->input('jobid');
        $timeline = $this->Functions->view_timeline($userid,$token,$jobid);
        return response(json_encode($timeline))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function admin_export_jobs($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $jobid = $request->input('jobid'); $jobtype = $request->input('jobtype'); $toe = $request->input('toe');
        $file = $this->Functions->admin_export_jobs($userid,$token,$jobid,$jobtype,$toe);
        return response(json_encode($file))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function update_summary_value($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $value = $request->input('value'); 
        $file = $this->Functions->update_summary_value($userid,$token,$value);
        return response(json_encode($file))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_user_log($request){
        $userid = $request->input('userid'); $token = $request->input('token');$kaust_user=$request->input('kaust_user');$type_of_export=$request->input('type_of_export'); 
        $export = $this->Functions->export_user_log($userid,$token,$kaust_user,$type_of_export);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_contact($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$contact_id = $request->input('contact_id');
        $list = $this->Functions->export_contact($userid,$token,$toe,$contact_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_requests($request){
        $userid = $request->input('userid'); $token = $request->input('token');$toe = $request->input('toe');$contact_id = $request->input('contact_id');
        $list = $this->Functions->export_requests($userid,$token,$toe,$contact_id);
        return response(json_encode($list))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_industry_log($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $industry_id = $request->input('industry_id'); $type_of_export=$request->input('type_of_export'); 
        $export = $this->Functions->export_industry_log($userid,$token,$industry_id,$type_of_export);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function export_custom_industry($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $from_date = $request->input('from_date'); $to_date = $request->input('to_date');
        $industry_type = $request->input('industry_type');$company_size = $request->input('company_size');
        $main_customers = $request->input('main_customers'); $company_type = $request->input('company_type'); 
        $export = $this->Functions->export_custom_industry($userid,$token,$from_date,$to_date,$industry_type,$company_size,$main_customers,$company_type);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Restore_Password($request){
        $adminid = $request->input('adminid'); $token = $request->input('token'); $userid = $request->input('userid'); $email = $request->input('email');
        $export = $this->Functions->restore_password($adminid,$token,$userid,$email);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function change_user_email($request){
        $adminid = $request->input('adminid'); $token = $request->input('token'); $userid = $request->input('userid'); $email = $request->input('email');
        $export = $this->Functions->change_user_email($adminid,$token,$userid,$email);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function reply_to_email($request){
        $adminid = $request->input('adminid'); $token = $request->input('token');
        $subject = $request->input('subject'); $body = $request->input('body'); $email_to = $request->input('email_to');
        $export = $this->Functions->reply_to_email($adminid,$token,$subject,$body,$email_to);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    
    public function contact_industry($request){
        $adminid = $request->input('adminid'); $token = $request->input('token');
        $message = $request->input('message');
        $subject = $request->input('subject');$user = $request->input('user');
        $export = $this->Functions->contact_industry($adminid,$token,$message,$subject,$user);
        return response(json_encode($export))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
   
}