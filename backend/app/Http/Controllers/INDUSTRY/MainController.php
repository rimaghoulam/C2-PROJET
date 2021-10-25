<?php
namespace App\Http\Controllers\INDUSTRY;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\INDUSTRY\Functions;
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
       $headquarter= $request->input('headquarter'); $headquarter_spec= $request->input('headquarter_spec'); $cage= $request->input('age'); $address1= $request->input('address1');$address2 = $request->input('address2');$caddress = $request->input('cAddress');$file = $request->input('file');$cemail = $request->input('cEmail');$cname = $request->input('cName');$cType= $request->input('cType');$cType_spec= $request->input('cType_spec');$customer = $request->input('customer');$employees = $request->input('employees');$iType = $request->input('iType');$iType_spec= $request->input('iType_spec');$link = $request->input('link');$product= $request->input('product');$social = $request->input('social');$userid = $request->input('userid');$website = $request->input('website');$document_name = $request->input('fileName');
       $company_phone= $request->input('company_phone');
       $insert_user = $this->Functions->register_company($headquarter,$headquarter_spec,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$cType_spec,$customer,$employees,$file,$iType,$iType_spec,$link,$product,$social,$userid,$website,$document_name,$company_phone);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
	 
    }
    
    public function upload_image($request){
        $image=addslashes($_FILES['file']['tmp_name']);
        $image= file_get_contents($image);
        $image= base64_encode($image);
        echo $image;
    }
    
    public function Post_Challenge($request){
	    $userid = $request->input('userid');$token = $request->input('token');$chname = $request->input('challengeName');$chtype = $request->input('challengeType');$chdesc = $request->input('challengeDescription');$chapproach = $request->input('approach');$chspec = $request->input('approachChallSpecification');$chtime = $request->input('challengeTime');$chaffected = $request->input('companyAffected');$chaffspec = $request->input('companyAffectedSpecification');$chcost = $request->input('cost');$chcostspec = $request->input('costSpecification');$document = $request->input('files');$chhear = $request->input('hear');$document_name = $request->input('fileNames');
	    $insert_challenge = $this->Functions->post_challenge($userid, $token, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$document,$document_name,$chhear);
        return response(json_encode($insert_challenge))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Post_Internship($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $i_name = $request->input('institution_name');$i_location = $request->input('institution_location');
        $startdate = $request->input('startdate');$positionOutline = $request->input('positionOutline');$location = $request->input('location');$listDocuments = $request->input('listDocuments');$enddate = $request->input('enddate');$jobTitle = $request->input('jobTitle');$experience = $request->input('experience');$department = $request->input('department');$compensationSalary = $request->input('compensationSalary');$companydesc = $request->input('companyDesc');$categorieStudent = $request->input('categoryStudent');$length = $request->input('length');$major = $request->input('major');$contact = $request->input('contact');$link = $request->input('link');
        $insert_internship = $this->Functions->post_internship($userid,$token,$i_name,$i_location,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent,$length,$major,$contact,$link);
        return response(json_encode($insert_internship))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_INDUSTRY_Dashboard($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_dashboard = $this->Functions->get_industry_dashboard($userid,$token);
        return response(json_encode($get_dashboard))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
       
    public function Get_INDUSTRY_Challenge($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_challenge = $this->Functions->get_industry_challenge($userid,$token);
        return response(json_encode($get_challenge))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
       
    public function Get_INDUSTRY_Internship($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_internship = $this->Functions->get_industry_internship($userid,$token);
        return response(json_encode($get_internship))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
    
    public function Get_Company_Detail($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $user_detail = $this->Functions->get_company_detail($userid,$token);
        return response(json_encode($user_detail))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Update_Company_Detail($request){
       $token = $request->input('token');$document_name = $request->input('fileName');$company_phone = $request->input('company_phone');
       $headquarter= $request->input('headquarter'); $headquarter_spec= $request->input('headquarter_spec'); $address1= $request->input('address1');$address2 = $request->input('address2');$caddress = $request->input('cAddress');$cemail = $request->input('cEmail');$cname = $request->input('cName');$cType= $request->input('cType');$cType_spec= $request->input('cType_spec');
       $customer = $request->input('customer');$employees = $request->input('employees');$file = $request->input('file');$iType = $request->input('iType');$iType_spec= $request->input('iType_spec');$link = $request->input('link');$product= $request->input('product');
       $social = $request->input('social');$userid = $request->input('userid');$website = $request->input('website');$cage= $request->input('age');
       $insert_user = $this->Functions->update_company($userid,$token,$headquarter,$headquarter_spec,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$cType_spec,$customer,$employees,$file,$document_name,$iType,$iType_spec,$link,$product,$social,$website,$company_phone);
	   return response(json_encode($insert_user))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Edit_Challenge($request){
        $userid = $request->input('userid');$token = $request->input('token');$jobid = $request->input('jobid');$chname = $request->input('chname');$chtype = $request->input('chtype');$chdesc = $request->input('chdesc');$chapproach = $request->input('chapproach');$chspec = $request->input('chspec');$chtime = $request->input('chtime');$chaffected = $request->input('chaffected');$chaffspec = $request->input('chaffspec');$chcost = $request->input('chcost');$chcostspec = $request->input('chcostspec');$chhear = $request->input('chhear');
        $edit_challenge = $this->Functions->edit_challenge($userid, $token, $jobid, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$chhear);
        return response(json_encode($edit_challenge))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
       
    public function Edit_Internship($request){
        $userid = $request->input('userid');$token = $request->input('token');$jobid = $request->input('jobid');$startdate = $request->input('startdate');$positionOutline = $request->input('positionOutline');$location = $request->input('location');$listDocuments = $request->input('listDocuments');$enddate = $request->input('enddate');$jobTitle = $request->input('jobTitle');$experience = $request->input('experience');$department = $request->input('department');$compensationSalary = $request->input('compensationSalary');$companydesc = $request->input('companydesc');$categorieStudent = $request->input('categorieStudent');
        $edit_internship = $this->Functions->edit_internship($userid,$token,$jobid,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent);
        return response(json_encode($edit_internship))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
       }
       
    public function check_self_signed_nda($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $signed_nda = $this->Functions->check_self_signed_nda($userid,$token);
	    return response(json_encode($signed_nda))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function agree_guidline($request){
        $userid = $request->input('userid');$token = $request->input('token');$tick = $request->input('tick');$nda_path = $request->input('nda_path');$file_name = $request->input('fileName');
        $agree_guidline = $this->Functions->agree_guidline($userid,$token,$tick,$nda_path,$file_name);
	    return response(json_encode($agree_guidline))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_agree_guidline($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $agree_guidline = $this->Functions->get_agree_guidline($userid,$token);
	    return response(json_encode($agree_guidline))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Fill_Data($request){
          $fill_data = $this->Functions->fill_data();
          return response(json_encode($fill_data))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function generate_nda_pdf($request){
        $userid = $request->input('userid');$token = $request->input('token');$nda_date = $request->input('nda_date');$cname = $request->input('company_name');$chead = $request->input('company_head');$job_title = $request->input('job_title');
        $country = $request->input('country');$a2 = $request->input('a2');$a1 = $request->input('a1');$email = $request->input('email');$company_owner = $request->input('company_owner');
        
        $nda_date_ar = $request->input('nda_date_ar');$cname_ar = $request->input('company_name_ar');$chead_ar = $request->input('company_head_ar');$job_title_ar = $request->input('job_title_ar');
        $country_ar = $request->input('country_ar');$a2_ar = $request->input('a2_ar');$a1_ar = $request->input('a1_ar');$email_ar = $request->input('email_ar');$company_owner_ar = $request->input('company_owner_ar');
        
        $generate_nda_pdf = $this->Functions->generate_nda_pdf($userid,$token,$nda_date,$cname,$chead,$job_title,$country,$a1,$a2,$email,$company_owner,$nda_date_ar,$cname_ar,$chead_ar,$job_title_ar,$country_ar,$a1_ar,$a2_ar,$email_ar,$company_owner_ar);
	    return response(json_encode($generate_nda_pdf))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function generate_job_pdf($request){
        $userid = $request->input('userid');$token = $request->input('token');$job = $request->input('job');
        $generate_job_pdf = $this->Functions->generate_job_pdf($userid,$token,$job);
	    return response(json_encode($generate_job_pdf))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Comments_My_Jobs($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $get_comments_my_jobs = $this->Functions->get_comments_my_jobs($userid,$token);
	    return response(json_encode($get_comments_my_jobs))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function check_company_status($request){
        $userid = $request->input('userid');$token = $request->input('token');
        $check_sts = $this->Functions->check_company_status($userid,$token);
	    return response(json_encode($check_sts))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }

    
}