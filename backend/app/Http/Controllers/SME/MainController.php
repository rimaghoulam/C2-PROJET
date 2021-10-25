<?php
namespace App\Http\Controllers\SME;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\SME\Functions;
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
    
    public function Register_Company($request){
       $headquarter= $request->input('headquarter'); $cage= $request->input('age'); $address1= $request->input('address1');$address2 = $request->input('address2');$caddress = $request->input('cAddress');$file = $request->input('file');$cemail = $request->input('cEmail');$cname = $request->input('cName');$cType= $request->input('cType');$customer = $request->input('customer');$employees = $request->input('employees');$iType = $request->input('iType');$link = $request->input('link');$product= $request->input('product');$social = $request->input('social');$userid = $request->input('userid');$website = $request->input('website');
       $insert_user = $this->Functions->register_company($headquarter,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$userid,$website);
	   return json_encode($insert_user);
	 
    }
    
    public function upload_image($request){
        $rand=rand(1000,100000);$rand2=rand(1000,100000);$rand1=$rand*$rand2;
$filename = $rand1."-profile-".$_FILES['file']['name'];
$ffname=$_FILES['file']['name'];
$location = "uploads/".$filename;
$uploadOk = 1;
$imageFileType = pathinfo($location,PATHINFO_EXTENSION);
$valid_extensions = array("jpg","jpeg","png","pdf");
if( !in_array(strtolower($imageFileType),$valid_extensions) ) {$uploadOk = 0;}
if($uploadOk == 0){ echo 0;}else{
   /* Upload file */
   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
      echo $location;
   }else{
      echo 0;
   }
}
  

        
    }
    
    public function Post_Challenge($request){
	    $userid = $request->input('userid');$token = $request->input('token');$chname = $request->input('challengeName');$chtype = $request->input('challengeType');$chdesc = $request->input('challengeDescription');$chapproach = $request->input('approach');$chspec = $request->input('approachChallSpecification');$chtime = $request->input('challengeTime');$chaffected = $request->input('companyAffected');$chaffspec = $request->input('companyAffectedSpecification');$chcost = $request->input('cost');$chcostspec = $request->input('costSpecification');$document = $request->input('files');$chhear = $request->input('hear');
	    $insert_challenge = $this->Functions->post_challenge($userid, $token, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$document,$chhear);
        return json_encode($insert_challenge);
    }
    
    public function Post_Internship($request){
        $userid = $request->input('userid');$token = $request->input('token');$startdate = $request->input('startdate');$positionOutline = $request->input('positionOutline');$location = $request->input('location');$listDocuments = $request->input('listDocuments');$enddate = $request->input('enddate');$jobTitle = $request->input('jobTitle');$experience = $request->input('experience');$department = $request->input('department');$compensationSalary = $request->input('compensationSalary');$companydesc = $request->input('companyDesc');$categorieStudent = $request->input('categoryStudent');$length = $request->input('length');$major = $request->input('major');$contact = $request->input('contact');$link = $request->input('link');
        $insert_internship = $this->Functions->post_internship($userid,$token,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent,$length,$major,$contact,$link);
        return json_encode($insert_internship);
    }
    
    public function Get_SME_Dashboard($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_dashboard = $this->Functions->get_sme_dashboard($userid,$token);
        return json_encode($get_dashboard);
       }
       
    public function Get_SME_Challenge($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_challenge = $this->Functions->get_sme_challenge($userid,$token);
        return json_encode($get_challenge);
       }
       
    public function Get_SME_Internship($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_internship = $this->Functions->get_sme_internship($userid,$token);
        return json_encode($get_internship);
       }
    
    public function Get_Company_Detail($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $user_detail = $this->Functions->get_company_detail($userid,$token);
        return json_encode($user_detail);
    }
    
    public function Update_Company_Detail($request){
       $token = $request->input('token');
       $headquarter= $request->input('headquarter');$address1= $request->input('address1');$address2 = $request->input('address2');$caddress = $request->input('cAddress');$cemail = $request->input('cEmail');$cname = $request->input('cName');$cType= $request->input('cType');
       $customer = $request->input('customer');$employees = $request->input('employees');$file = $request->input('file');$iType = $request->input('iType');$link = $request->input('link');$product= $request->input('product');
       $social = $request->input('social');$userid = $request->input('userid');$website = $request->input('website');$cage= $request->input('age');
       $insert_user = $this->Functions->update_company($userid,$token,$headquarter,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$website);
	   return json_encode($insert_user);
    }
    
    public function Edit_Challenge($request){
        $userid = $request->input('userid');$token = $request->input('token');$jobid = $request->input('jobid');$chname = $request->input('chname');$chtype = $request->input('chtype');$chdesc = $request->input('chdesc');$chapproach = $request->input('chapproach');$chspec = $request->input('chspec');$chtime = $request->input('chtime');$chaffected = $request->input('chaffected');$chaffspec = $request->input('chaffspec');$chcost = $request->input('chcost');$chcostspec = $request->input('chcostspec');$chhear = $request->input('chhear');
        $edit_challenge = $this->Functions->edit_challenge($userid, $token, $jobid, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$chhear);
        return json_encode($edit_challenge);
       }
       
    public function Edit_Internship($request){
        $userid = $request->input('userid');$token = $request->input('token');$jobid = $request->input('jobid');$startdate = $request->input('startdate');$positionOutline = $request->input('positionOutline');$location = $request->input('location');$listDocuments = $request->input('listDocuments');$enddate = $request->input('enddate');$jobTitle = $request->input('jobTitle');$experience = $request->input('experience');$department = $request->input('department');$compensationSalary = $request->input('compensationSalary');$companydesc = $request->input('companydesc');$categorieStudent = $request->input('categorieStudent');
        $edit_internship = $this->Functions->edit_internship($userid,$token,$jobid,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent);
        return json_encode($edit_internship);
       }
       
    public function check_self_signed_nda($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $signed_nda = $this->Functions->check_self_signed_nda($userid,$token);
	    return json_encode($signed_nda);
    }
    
    public function agree_guidline($request){
        $userid = $request->input('userid');$token = $request->input('token');$tick = $request->input('tick');$nda_path = $request->input('nda_path');
        $agree_guidline = $this->Functions->agree_guidline($userid,$token,$tick,$nda_path);
	    return json_encode($agree_guidline);
    }
    
    public function get_agree_guidline($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $agree_guidline = $this->Functions->get_agree_guidline($userid,$token);
	    return json_encode($agree_guidline);
    }
    
    public function Fill_Data($request){
          $fill_data = $this->Functions->fill_data();
          return json_encode($fill_data);
        }
        
    public function generate_nda_pdf($request){
        $userid = $request->input('userid');$token = $request->input('token');$nda_date = $request->input('nda_date');
        $cname = $request->input('company_name');$chead = $request->input('company_head');$job_title = $request->input('job_title');
        $country = $request->input('country');$a2 = $request->input('a2');$a1 = $request->input('a1');$email = $request->input('email');
        
        $generate_nda_pdf = $this->Functions->generate_nda_pdf($userid,$token,$nda_date,$cname,$chead,$job_title,$country,$a1,$a2,$email);
	    return json_encode($generate_nda_pdf);
    }
    
    public function generate_job_pdf($request){
        $userid = $request->input('userid');$token = $request->input('token');$job = $request->input('job');
        $generate_job_pdf = $this->Functions->generate_job_pdf($userid,$token,$job);
	    return json_encode($generate_job_pdf);
    }
    
    public function Get_Comments_My_Jobs($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $get_comments_my_jobs = $this->Functions->get_comments_my_jobs($userid,$token);
	    return json_encode($get_comments_my_jobs);
    }

    
}