<?php
namespace App\Http\Controllers\ADMIN;

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
use SimpleXLSXGen;
use Str;


class Functions extends Controller
{
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(){
    }
    
 /*   public function get_user_info_company($myid,$token,$userid){
        $check_token_time= $this->check_user_token_time($myid, $token);
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($myid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    $result = DB::table('basic_user')
                            ->join('industry_details', 'industry_details.industry_details_userid', '=', 'basic_user.user_id')
                            ->join('industry_social', 'industry_social.industry_social_company_id', '=', 'industry_details.industry_details_id')
                            ->select('basic_user.*','industry_details.*','industry_social.*')
                            ->where("user_id","=", $userid)
                            ->get();
                    
                    return $result;
                }else{return"role error";}
            }else{return"role error";}
        
            
        }else{return"token error";}
    }   */
    
    public function get_admin_dashboard($userid,$token){
        
        $result="";
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
          $check_role= $this->return_user_role($userid);
          if(count($check_role)==1){
              $role=$check_role[0]->user_role_role_id;
              if($role==4){
                //admin
               
                $internship_search_results = DB::table('job')
                                            ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                            ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                            ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                            ->select('job.job_id','job.job_status','job.created_date','internship.internship_job_id','internship.internship_job_title','internship.internship_institution_name','internship.internship_location','industry_details.created_at','assign_job.id_assign_job','basic_user.user_name','basic_user.user_department')
                                            ->where("job_type","=", "internship")
                                            ->where("job_active","=", "1")
                                            ->orderBy('job.created_date', 'asc')
                                            ->get();
                                            
                $internship_search_results = $internship_search_results->map(function($user) {
                
                    $dep=$user->user_department;
                    $department_name= DB::table('option_list')->select('*')->where('option_id','=', $dep)->get();
                    if(count($department_name)>0){
                        $department_string=$department_name[0]->option_value_e;
                        $user->user_department=$department_string;
                    }
                    return $user;
                });  
                                
                $challenge_search_results = DB::table('job')
                                            ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                            ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                            ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                            ->select('job.job_id','job.job_status','job.created_date','challenges.challenge_name','challenges.challenge_job_id','industry_details.industry_details_company_name','industry_details.created_at','industry_details.industry_details_company_address_country','industry_details.industry_details_headquarter','industry_details.industry_details_company_address_line1','industry_details.industry_details_company_address_line2','assign_job.id_assign_job','basic_user.user_name','basic_user.user_department')
                                            ->where("job.job_type","=", "challenge")
                                            ->where("job.job_active","=", "1")
                                            ->orderBy('job.created_date', 'desc')
                                            ->get();
                
                $challenge_search_results = $challenge_search_results->map(function($user) {
            
                    $industry_headquarter=$user->industry_details_headquarter;  
                    $headquarter_string="";
                    $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                    $headquarter_string=$head_name[0]->option_value_e;
                    
                    $dep=$user->user_department;
                    $department_name= DB::table('option_list')->select('*')->where('option_id','=', $dep)->get();
                    if(count($department_name)>0){
                        $department_string=$department_name[0]->option_value_e;
                        $user->user_department=$department_string;
                    }
                    $user->industry_details_headquarter = $headquarter_string;
                    return $user;
                });
                
                $count_private_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
                
                $result=array($internship_search_results,$challenge_search_results,$count_private_comments);
                
              }else{$result= "role error";}
          }else{$result= "role error";}
            
            
        }else{$result="token error";}
        
        return $result; 
    }
    
    public function get_kaust_talents($userid,$token){
        
        $all_industry="";
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
          $check_role= $this->return_user_role($userid);
          if(count($check_role)==1){
              $role=$check_role[0]->user_role_role_id;
              if($role==4){
                  //admin
                $all_industry= $this->get_users_by_role("1");
                
              }else{$all_industry="role error";}
          }else{$all_industry="role error";}
            
            
        }else{$all_industry="token error";}
        
        return $all_industry;
    }
    
    /*public function respond_challenge($adminid,$token,$job_id,$action,$userid){
        
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
            
          $check_role= $this->return_user_role($adminid);
          if(count($check_role)==1){
              $role=$check_role[0]->user_role_role_id;
              if($role==4){
                  //admin
           $update = DB::table('job')->where('job_id','=', $job_id)->where('job_active','=', '1')->update(['job_status' => $action ]);
           
        
        
        return "done";    
              }else{return"role error";}
          }else{return"role error";}
            
            
        }else{return"token error";}
        
        
    }*/
    
    public function get_users_by_industry_id($adminid,$token,$industryid){
        $industry_users="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
           
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $industry_users = DB::table('industry_users')
                                ->join('basic_user','basic_user.user_id','=','industry_users.user_id')
                                ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                ->select('user_role.user_role_role_id','basic_user.user_active','basic_user.user_id','basic_user.user_name','basic_user.user_mobile','basic_user.user_role','basic_user.user_email','basic_user.created_date')
                                ->where('industry_id','=',$industryid)
                                ->where('basic_user.user_active','!=',2)
                                ->get();
                                
                }else{$industry_users= "role error";}
            }
        }else{$industry_users= "token error";}
        
        return $industry_users;
    }
    
    public function get_jobs_by_industry_id($adminid,$token,$industryid){
        $jobs="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
           
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $challenges= DB::table('job')
                                ->join('challenges','challenges.challenge_job_id','=','job.job_id')
                                ->select('job.*','challenges.*')
                                ->where('job.job_industry_id','=',$industryid)
                                ->get();
                    
                    $internships= DB::table('job')
                                ->join('internship','internship.internship_job_id','=','job.job_id')
                                ->select('job.*','internship.*')
                                ->where('job.job_industry_id','=',$industryid)
                                ->get();
                                
                    $count_comments = DB::table('comments')
                                ->join('job','job.job_id','=','comments.job_id')
                                ->select('comments.job_id', DB::raw('count(*) as total'))
                                ->where('job.job_industry_id','=',$industryid)
                                ->groupBy('comments.job_id')
                                ->pluck('total','comments.job_id')->all();
                         
                    $comp_details= DB::table('industry_details')
                                ->select('*')
                                ->where('industry_details_id','=',$industryid)
                                ->get();       
                  
                    $generate_token="";
                    $comp_details = $comp_details->map(function($user) use ($generate_token) {
                        
                        $industry_headquarter=$user->industry_details_headquarter;  
                        $headquarter_string="";
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                        $headquarter_string=$head_name[0]->option_value_e;
                        
                        
                        $user->industry_details_headquarter = $headquarter_string;
                        
                        
                        $company_type=$user->industry_details_company_type;
                        $company_string="";    
                        $companys = explode(",", $company_type);
                        foreach($companys as $comp) {
                            $comp_name= DB::table('option_list')->select('*')->where('option_id', $comp)->where('slug', 'company-type')->get();
                            if(count($comp_name)>0){
                                $company_string.=$comp_name[0]->option_value_e;
                                $user->industry_details_company_type = $company_string;
                                
                            }
                        }
                        
                        $nbr_employee=$user->industry_details_company_number_employee;
                        $employee_string="";    
                        $employee = explode(",", $nbr_employee);
                        foreach($employee as $employee) {
                            $employee_name= DB::table('option_list')->select('*')->where('option_id', $employee)->where('slug', 'number-employee')->get();
                            if(count($employee_name)>0){
                                $employee_string.=$employee_name[0]->option_value_e;}
                                $user->industry_details_company_number_employee=$employee_string;
                        }
                        
                        return $user;
                         
                    });
                  
                    $jobs= array($challenges,$internships,$comp_details,$count_comments);     
                    
                }else{$jobs= "role error";}
            }
        }else{$jobs= "token error";}
        
        return $jobs;
    }
    
    public function get_discussion_by_job_id($adminid,$token,$jobid){
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
           
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $comments = DB::table('comments')
                                ->join('basic_user','basic_user.user_id','=','comments.user_id')
                                ->select('comments.*','basic_user.user_name')
                                ->where('job_id','=',$jobid)
                                ->get();
                    
                    return $comments;
                }
            }
        }
    }
    
    public function get_documents_by_industry_id($adminid,$token,$id,$type){
        $documents="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
           
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    if($type=='industry'){
                    
                        $documents_profile = DB::table('industry_profiles')
                                            ->select('*')
                                            ->where('industry_id','=',$id)
                                            ->get();
                                            
                        $signed_nda = DB::table('signed_nda')
                                            ->select('*')
                                            ->where('industry_id','=',$id)
                                            ->where('is_signed','=','yes')
                                            ->get();
                                        
                        $industry_users = DB::table('industry_users')
                                    ->select('user_id')
                                    ->where('industry_id','=',$id)
                                    ->get();
                        
                        $documents_challenge= array();
                        
                        foreach($industry_users as $user){
                            $user_id=$user->user_id;
                            $user_docs= DB::table('challenges_documents')
                                    ->join('challenges','challenges.challenge_id','=','challenges_documents.challenge_id')
                                    ->join('basic_user','basic_user.user_id','=','challenges_documents.user_id')
                                    ->select('challenges.*','basic_user.user_name','challenges_documents.*')
                                    ->where('challenges_documents.user_id','=',$user_id)
                                    ->get();
                                    
                            array_push($documents_challenge, $user_docs);
                        }
                
                        $documents=array($documents_profile,$signed_nda,$documents_challenge);
                        
                    }
                    else if($type='user'){
                        $documents_profile = DB::table('industry_profiles')
                                            ->select('*')
                                            ->where('user_id','=',$id)
                                            ->get();
                                            
                        $signed_nda = DB::table('signed_nda')
                                            ->select('*')
                                            ->where('user_id','=',$id)
                                            ->where('is_signed','=','yes')
                                            ->get();
                        
                        $documents_challenge= DB::table('challenges_documents')
                                    ->join('challenges','challenges.challenge_id','=','challenges_documents.challenge_id')
                                    ->join('basic_user','basic_user.user_id','=','challenges_documents.user_id')
                                    ->select('challenges.*','basic_user.user_name','challenges_documents.*')
                                    ->where('challenges_documents.user_id','=',$id)
                                    ->get();
                                        
                        
                        $documents=array($documents_profile,$signed_nda,$documents_challenge);
                    
                    }
                }{$documents= "role error";}
            }
        }{$documents= "token error";}
        
        return $documents;
    }
    
    public function get_all_users($userid, $token){
        $result="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
           
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $kaust_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('user_role.user_role_role_id','basic_user.user_id','basic_user.user_active','basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.user_role','basic_user.newsletter','basic_user.user_department','basic_user.created_date')
                                    ->where('user_role.user_role_role_id','=','1')
                                    ->where('basic_user.user_active','=','1')
                                    ->orwhere('basic_user.user_active','=','3')
                                    ->get();
                                    
                    $kaust_users = $kaust_users->map(function($user) {
                
                        $dep=$user->user_department;
                        $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                        if(count($department_name)>0){
                            $department_string=$department_name[0]->option_value_e;
                            $user->user_department=$department_string;
                        }
                        return $user;
                    });             
                 
                    $industry_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->join('industry_users','industry_users.user_id','=','basic_user.user_id')
                                    ->join('industry_details','industry_details.industry_details_id','=','industry_users.industry_id')
                                    ->select('user_role.user_role_role_id','basic_user.user_id','basic_user.user_active','basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.user_role','basic_user.newsletter','basic_user.created_date','industry_details.industry_details_id','industry_details.industry_details_company_name','industry_details.created_at')
                                    ->where('user_role.user_role_role_id','=','3')
                                    ->where('basic_user.user_active','=','1')
                                    ->orwhere('basic_user.user_active','=','3')
                                    ->get();
                   
                    $result=array($kaust_users,$industry_users);
                  
                }else{$result="role error";}
            }else{$result="role error";}
        
        }else{$result="token error";}
        return $result; 
    }  

    public function admin_add_new_user($adminid,$token,$name,$email,$industryid){
        $arr="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        if($check_token_time){
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                        
                    $user = DB::table('basic_user')
                            ->select('*')
                            ->where("user_email","=",$email)
                            ->get();
                    
                    if(count($user)!=0){
                        
                        $status=$user[0]->user_active;
                        if($status==2){
                            $update= DB::table('basic_user')->where("user_email","=",$email)->update(['user_active' => 3,'updated_date' => $date,]);
                            $update = DB::table('job')->where('job_user_id','=', $user[0]->user_id)->update(['job_active' => 1]);
                            
                            $link="http://localhost:3000/";
                            
                            $temp= $this->get_notification_template(19);
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                            
                        }
                        else $arr= "user email already existe";
                    }
                    else{
                        
                        $generate_token = $this->generate_token();
                        
                        $id=  DB::table('basic_user')->insertGetId([
                            'user_name' => $name,
                            'user_email' => $email,
                            'user_active' => 3,
                            'created_date' => $date,
                        ]);
                        
                        DB::table('users_from_admin_activation')->insert([
                            'id_user' => $id,'user_email' => $email,'token' => $generate_token ,'created_date' => $date, 'submit' => 0,
                        ]);
                        
                        if($industryid==0){
                            DB::table('user_role')->insert([
                                'user_role_userid' => $id,'user_role_role_id' => 1,'active' => 1,'created_date' => $date,'updated_date' => null,
                            ]);
                            
                            $role=1;
                        }
                        else{
                            DB::table('user_role')->insert([
                                'user_role_userid' => $id,'user_role_role_id' => 3,'active' => 1,'created_date' => $date,'updated_date' => null,
                            ]);
                            
                            DB::table('industry_users')->insert([
                                'industry_id' => $industryid,'user_id' => $id,
                            ]);
                            
                            $role=3;
                        }
                        
                        $arr = array($id,$name,$role);
                        
                        $link="http://localhost:3000/?user_activation_token=".$generate_token."&email=".$email;
                        
                        $temp= $this->get_notification_template(20);
                        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                        
                    }
                }else{$arr="role error";}
            }
        }else{$arr="token error";}
        return $arr;
    }

    public function get_user_posted_job($adminid,$token,$userid){
        $result="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                   
                    $check_role= $this->return_user_role($userid);
                    if(count($check_role)==1){
                
                        $role=$check_role[0]->user_role_role_id;
                        if($role==3){
                             
                            $user_industry_id = $this->get_industry_id_by_user_id($userid);
                            
                            if(count($user_industry_id)==1){
                                
                                $industry_id=$user_industry_id[0]->industry_id;
                        
                                $user_challenges = DB::table('job')
                                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                        ->select('job.*','challenges.*')
                                        ->where("job_user_id","=", $userid)
                                        ->where("job_industry_id","=", $industry_id)
                                        ->where("job_type","=", "challenge")
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                                $user_internship = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->select('job.*','internship.*')
                                        ->where("job_user_id","=", $userid)
                                        ->where("job_industry_id","=", $industry_id)
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                                $user_basic_info = DB::table('basic_user')
                                        ->select('user_name','user_email','user_username','user_role','user_gender','user_mobile','user_office_number','created_date')
                                        ->where("user_id","=", $userid)
                                        ->get();
                                        
                                $count_comments = DB::table('comments')
                                                ->join('job','job.job_id','=','comments.job_id')
                                                ->select('comments.job_id', DB::raw('count(*) as total'))
                                                ->where('job.job_user_id','=',$userid)
                                                ->groupBy('comments.job_id')
                                                ->pluck('total','comments.job_id')->all();
                                        
                                $result=array($user_challenges,$user_internship,$user_basic_info,$count_comments);
                            
                            }
                        }
                        else if($role==1){
                            $user_challenges = DB::table('assign_job')
                                        ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                        ->select('*')
                                        ->where("assign_job.user_id","=", $userid)
                                        ->where("job.job_active","=", 1)
                                        ->where("job.job_type","=", "challenge")
                                        ->get();
                                        
                            $user_internship = DB::table('assign_job')
                                        ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->select('*')
                                        ->where("assign_job.user_id","=", $userid)
                                        ->where("job.job_active","=", 1)
                                        ->where("job.job_type","=", "internship")
                                        ->get();
                                        
                            $user_basic_info = DB::table('basic_user')
                                            ->select('user_name','user_email','user_username','user_role','user_gender','user_mobile','user_office_number','user_department','created_date')
                                            ->where("user_id","=", $userid)
                                            ->get();
                                            
                            $user_basic_info = $user_basic_info->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                                        
                            $result=array($user_challenges,$user_internship,$user_basic_info);
                            
                        }
                    }
          
                }else{$result="role error";}
            }else{$result="role error";}
        
        }else{$result="token error";}
        return $result;
    }
    
    public function assign_job($adminid,$token,$userid,$jobid,$status){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        if($check_token_time){
            
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $link="http://localhost:3000/";
                    
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    
                    $job= DB::table('job')->select('job_type','job_user_id')->where('job_id', '=', $jobid)->get();
                    $jobtype= $job[0]->job_type;
                    $industry_userid= $job[0]->job_user_id;
                    $in_email= $this->return_user_email($industry_userid);
                    
                    $admin_name= DB::table('basic_user')->select('user_name')->where('user_id', '=', $adminid)->get();
                    $admin_n=$admin_name[0]->user_name;
                    
                    if($jobtype=="challenge"){
                        $notification_type="challenge";
                        $jobtitle= DB::table('challenges')->select('challenge_name')->where('challenge_job_id', '=', $jobid)->get(); $jobtitle= $jobtitle[0]->challenge_name;
                    }
                    else if($jobtype=="internship"){
                        $notification_type="internship";
                        $jobtitle= DB::table('internship')->select('internship_job_title')->where('internship_job_id', '=', $jobid)->get(); $jobtitle=$jobtitle[0]->internship_job_title;
                    }
                    
                    $status_notification= FALSE; $assign_notification= FALSE; $status_assign_notification= FALSE; $old_user_notification= FALSE; $send_twice= FALSE;
                            
                    $old_status = DB::table('job')
                                    ->select('job_status')
                                    ->where('job_id', '=', $jobid)
                                    ->get();
                    $old_status= $old_status[0]->job_status;
                    
                    $old_user = DB::table('assign_job')
                                    ->select('*')
                                    ->where('job_id', '=', $jobid)
                                    ->get();
                    
                    if(count($old_user)==1){
                        
                        $assigned_to= DB::table('basic_user')->select('user_name')->where('user_id', '=', $userid)->get(); 
                        $assigned_to= $assigned_to[0]->user_name;
                        $uni_email= $this->return_user_email($userid);
                    
                        $old_user=$old_user[0]->user_id;
                        $old_uni_email= $this->return_user_email($old_user);
                        
                        if($old_user == $userid){
                            if($old_status == $status){
                                //nthng changed
                            }
                            else{
                                //only status changed
                                DB::table('job')->where("job_id","=", $jobid)->update(['job_status' => $status ]);
                                DB::table('job_status_log')->insert(['job_id' => $jobid, 'status' => $status , 'date' => $date, ]);
                                
                                $status_notification= TRUE;
                                $send_twice= TRUE;
                            }
                        }
                        else{
                            if($old_status == $status){
                                //only assigned user changed
                                DB::table('assign_job')->where('job_id', '=', $jobid)->update(['user_id' => $userid,]);
                                
                                $assign_notification= TRUE;
                                $old_user_notification= TRUE;
                            }
                            else{
                                //status and assigned user changed
                                DB::table('job')->where("job_id","=", $jobid)->update(['job_status' => $status ]);
                                DB::table('job_status_log')->insert(['job_id' => $jobid, 'status' => $status , 'date' => $date, ]);
                                DB::table('assign_job')->where('job_id', '=', $jobid)->update(['user_id' => $userid,]);
                                
                                $status_assign_notification= TRUE;
                                $old_user_notification= TRUE;
                            }
                        }
                        
                    }
                    else{
                        if($userid=="Not Found"){
                            if($old_status == $status){
                                //nthng changed
                            }
                            else{
                                //only status changed
                                DB::table('job')->where("job_id","=", $jobid)->update(['job_status' => $status ]);
                                DB::table('job_status_log')->insert(['job_id' => $jobid, 'status' => $status , 'date' => $date, ]);
                                
                                $status_notification= TRUE;
                            }
                        }
                        else{
                            $assigned_to= DB::table('basic_user')->select('user_name')->where('user_id', '=', $userid)->get(); 
                            $assigned_to= $assigned_to[0]->user_name;
                            $uni_email= $this->return_user_email($userid);
                            
                            if($old_status == $status){
                                //only assigned user changed
                                DB::table('assign_job')->insert(['job_id' => $jobid,'user_id' => $userid ,'admin_id' => $adminid, 'date_assign' => $date, ]);
                                
                                $assign_notification= TRUE;
                            }
                            else{
                                //status and assigned user changed
                                DB::table('job')->where("job_id","=", $jobid)->update(['job_status' => $status ]);
                                DB::table('job_status_log')->insert(['job_id' => $jobid, 'status' => $status , 'date' => $date, ]);
                                DB::table('assign_job')->insert(['job_id' => $jobid,'user_id' => $userid ,'admin_id' => $adminid, 'date_assign' => $date, ]);
                                
                                $status_assign_notification= TRUE;
                            }
                        }
                    }
                    
                        
                    if($status_notification){
                        if($jobtype=="challenge"){
                            $temp= $this->get_notification_template(7);
                            $status_msg = $temp[0]->notification_message;eval("\$status_msg = \"$status_msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ; //sme
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $status_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "challenge_details",
                            ]);  
                    
                            if($send_twice){
                                $send_email =  $this->send_email($email_template,$old_uni_email,$email_subject) ; //user
                                DB::table('notifications')->insert([
                                    'notification_user_id' => $userid,
                                    'notification_job_id' => $jobid ,
                                    'notification_msg' => $status_msg, 
                                    'notification_date' => $date, 
                                    'notification_status' => 1,
                                    'notification_type' => $notification_type,
                                    'action_type' => "challenge_details",
                                ]);  
                            }
                        }
                        if($jobtype=="internship"){
                            $temp= $this->get_notification_template(4);
                            $status_msg = $temp[0]->notification_message;eval("\$status_msg = \"$status_msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ; //sme
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $status_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "internship_details",
                            ]);  
                    
                            if($send_twice){
                                $send_email =  $this->send_email($email_template,$old_uni_email,$email_subject) ; //user
                                DB::table('notifications')->insert([
                                    'notification_user_id' => $userid,
                                    'notification_job_id' => $jobid ,
                                    'notification_msg' => $status_msg, 
                                    'notification_date' => $date, 
                                    'notification_status' => 1,
                                    'notification_type' => $notification_type,
                                    'action_type' => "internship_details",
                                ]);  
                            }
                        }
                    } 
                    
                    if($assign_notification){
                    
                        if($jobtype=="challenge"){
                           
                            //sme
                            $temp= $this->get_notification_template(6);
                            $assign_msg = $temp[0]->notification_message;eval("\$assign_msg = \"$assign_msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ; 
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $assign_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "challenge_details",
                            ]);  
                            
                            //user
                            $u_temp= $this->get_notification_template(5);
                            $u_assign_msg = $u_temp[0]->notification_message;eval("\$u_assign_msg = \"$u_assign_msg\";");
                            $u_email_subject = $u_temp[0]->email_subject;eval("\$u_email_subject = \"$u_email_subject\";");
                            $u_email_template = $u_temp[0]->email_template;eval("\$u_email_template = \"$u_email_template\";");
                            
                            $send_email =  $this->send_email($u_email_template,$uni_email,$u_email_subject) ;
                            
                            DB::table('notifications')->insert([
                                    'notification_user_id' => $userid,
                                    'notification_job_id' => $jobid ,
                                    'notification_msg' => $u_assign_msg, 
                                    'notification_date' => $date, 
                                    'notification_status' => 1,
                                    'notification_type' => $notification_type,
                                    'action_type' => "challenge_details",
                                ]);  
                        }
                        if($jobtype=="internship"){
                            //sme
                            $temp= $this->get_notification_template(3);
                            $assign_msg = $temp[0]->notification_message;eval("\$assign_msg = \"$assign_msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ;
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $assign_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "internship_details",
                            ]);  
                            
                            //user
                            $u_temp= $this->get_notification_template(2);
                            $u_assign_msg = $u_temp[0]->notification_message;eval("\$u_assign_msg = \"$u_assign_msg\";");
                            $u_email_subject = $u_temp[0]->email_subject;eval("\$u_email_subject = \"$u_email_subject\";");
                            $u_email_template = $u_temp[0]->email_template;eval("\$u_email_template = \"$u_email_template\";");
                            
                            $send_email =  $this->send_email($u_email_template,$uni_email,$u_email_subject) ;
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $u_assign_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "internship_details",
                            ]);  
                        }
                    } 
                    
                    if($old_user_notification){
                        if($jobtype=="challenge"){
                            $temp= $this->get_notification_template(34);
                            $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$old_uni_email,$email_subject) ; 
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $old_user,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "sorry",
                            ]);  
                        }
                        if($jobtype=="internship"){
                            $temp= $this->get_notification_template(33);
                            $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$old_uni_email,$email_subject) ; 
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $old_user,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "sorry",
                            ]);  
                        }
                    } 
                    
                    if($status_assign_notification){
                        if($jobtype=="challenge"){
                            //sme
                            $temp= $this->get_notification_template(38);
                            $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ; 
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "challenge_details",
                            ]);  
                            
                            //user
                            $u_temp= $this->get_notification_template(37);
                            $u_msg = $u_temp[0]->notification_message;eval("\$u_msg = \"$u_msg\";");
                            $u_email_subject = $u_temp[0]->email_subject;eval("\$u_email_subject = \"$u_email_subject\";");
                            $u_email_template = $u_temp[0]->email_template;eval("\$u_email_template = \"$u_email_template\";");
                            
                            $send_email =  $this->send_email($u_email_template,$uni_email,$u_email_subject) ; 
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $u_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "challenge_details",
                            ]);  
                        }
                        if($jobtype=="internship"){
                            //sme
                            $temp= $this->get_notification_template(36);
                            $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                           
                            $send_email =  $this->send_email($email_template,$in_email,$email_subject) ;
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $industry_userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "internship_details",
                            ]);  
                            
                            //user
                            $u_temp= $this->get_notification_template(35);
                            $u_msg = $u_temp[0]->notification_message;eval("\$u_msg = \"$u_msg\";");
                            $u_email_subject = $u_temp[0]->email_subject;eval("\$u_email_subject = \"$u_email_subject\";");
                            $u_email_template = $u_temp[0]->email_template;eval("\$u_email_template = \"$u_email_template\";");
                            
                            $send_email =  $this->send_email($u_email_template,$uni_email,$u_email_subject) ;
                            
                            DB::table('notifications')->insert([
                                'notification_user_id' => $userid,
                                'notification_job_id' => $jobid ,
                                'notification_msg' => $u_msg, 
                                'notification_date' => $date, 
                                'notification_status' => 1,
                                'notification_type' => $notification_type,
                                'action_type' => "internship_details",
                            ]);  
                        }
                    } 
                
                }else{$res="role error";}
            }else{$res="role error";}
        
        }else{$res="token error";}
        return $res;
    }
        
    public function get_all_industry($adminid,$token){
        $companies="";
        $check_token_time= $this->check_user_token_time($adminid, $token);
        
        if($check_token_time){
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $completed_companies= DB::table('industry_details')
                                        ->select('*')
            		                    ->get();

                    $search_results = $completed_companies->map(function($user) {
                    
                        $id=$user->industry_details_industry_type; $industry_string="";
                        $industries = explode(",", $id);
                        
                        foreach($industries as $indu) {
                            $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                            if(count($industry_name)>0){
                                $industry_string.=$industry_name[0]->name_industry_type." - ";
                            }
                        }
                        $industry_string=substr($industry_string, 0, -2);
                        $user->industry_details_industry_type = $industry_string;
                        
                        $industry_headquarter=$user->industry_details_headquarter;
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                        $headquarter_string=$head_name[0]->option_value_e;
                        $user->industry_details_headquarter=$headquarter_string;
                        
                        return $user;
                    
                    });
    		                    
    		        $inactive_industrys= DB::table('basic_user')
                                ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                ->select('basic_user.*')
                                ->where("user_role.user_role_role_id","=",3)
                                ->where("basic_user.user_active","=",0)
                                ->get(); 
                    
                    $res= DB::table('industry_users')->select('user_id')->get();
                    $users=array();
                    foreach($res as $one){$userid=$one->user_id; array_push($users,$userid);}
                    
                    $active_industrys_step1= DB::table('basic_user')
                                ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                ->select('basic_user.*')
                                ->where("user_role.user_role_role_id","=",3)
                                ->where("basic_user.user_active","=",1)
                                ->whereNotIn('basic_user.user_id', $users)
                                ->get();
                                
                    $count_industry_users= DB::table('industry_users')
                                ->select('industry_id', DB::raw('count(*) as total'))
                                ->groupBy('industry_id')
                                ->pluck('total','industry_id')->all();
                                
                    $list_industry= DB::table('industry_details')
                                        ->select('*')
            		                    ->get();
            		                    
            		$list_industry_id=array();
                    foreach($list_industry as $one) {
                        $id=$one->industry_details_id;
                        array_push($list_industry_id, $id);
                    }
            		                    
                    $all_industry_users= DB::table('industry_users')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'industry_users.user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'industry_users.industry_id')
                                        ->select('basic_user.user_id','basic_user.user_name','basic_user.user_username','basic_user.user_email','industry_details.industry_details_company_name')
                                        ->whereIn('industry_users.industry_id', $list_industry_id)
                                        ->get();
    		         
    		        $companies=array($completed_companies,$inactive_industrys,$active_industrys_step1,$count_industry_users,$all_industry_users);
                    
                }else{$companies="role error";}
            }
        }else{$companies="token error";}
        return $companies;
    }  
    
    public function get_all_documents($userid,$token){
        /*    $check_token_time= $this->check_user_token_time($userid, $token); 
        
            if($check_token_time){
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    
                    if($role==4){
                        $documents_profile = DB::table('industry_details')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'industry_details.industry_details_userid')
                                        ->select('industry_details.created_at','industry_details.industry_detail_company_profile_name','industry_details.industry_details_company_profile','industry_details.industry_details_id','industry_details.industry_details_company_name','industry_details.industry_details_company_email','basic_user.user_name')
                                        ->get();
                                    
                        $documents_challenge = DB::table('challenges')
                                        ->join('challenges_documents', 'challenges_documents.challenge_id', '=', 'challenges.challenge_id')
                                        ->join('job', 'job.job_id', '=', 'challenges.challenge_job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('industry_details.created_at','industry_details.industry_detail_company_profile_name','basic_user.user_name','challenges_documents.document_path','challenges_documents.document_name','challenges.challenge_id','challenges.challenge_name','job.created_date','basic_user.user_name','industry_details.industry_details_company_profile','industry_details.industry_details_id','industry_details.industry_details_company_name','industry_details.industry_details_company_email')
                                        ->where("job.job_active","=", "1")
                                        ->get();
                
                        $documents=array($documents_profile,$documents_challenge);
                        return $documents;
                        
                    }else{return"role error";}
                }else{return"role error";}
            }else{return"token error";}
        */
        }
  
    public function delete_document($userid,$token,$document_type,$id_row){
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token);
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
        
            $role=$check_role[0]->user_role_role_id;
            
            if($role==4){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
           
                if($document_type=='profile'){
                  
                    DB::table('industry_profiles')->where("profile_id","=", $id_row)
		                                    ->update([
                                            'profile_path' => NULL,
                                            'profile_name' => NULL,
                    ]);
                    
                    //notification
                    
                    $industry_user = DB::table('industry_profiles')
                                ->select('user_id')
                                ->where("profile_id","=", $id_row)
                                ->get();
                    $industry_user_id= $industry_user[0]->user_id;
                    
                    $temp= $this->get_notification_template(8);
                    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                    $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                    
                    $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                
                    DB::table('notifications')->insert([
                        'notification_user_id' => $industry_user_id,
                        'notification_job_id' =>  NULL,
                        'notification_msg' => $msg, 
                        'notification_date' => $date, 
                        'notification_status' => 1,
                        'notification_type' => "delete",
                        'action_type' => "profile",
                    ]);  
                    
                    //send email
                    
                    $user_email= $this->return_user_email($industry_user_id);
                    $send_email =  $this->send_email($email_template,$user_email,$email_subject) ;
                        
                    
                }
                else if($document_type=='challenge'){
                    
                    DB::table('challenges_documents')->where("document_id","=", $id_row)
		                                    ->update([
                                            'document_path' => NULL,
                                            'active'=>'0',
                    ]);
                    
                //notification
                    
                    $industry_user = DB::table('challenges_documents')
                                ->select('user_id','job_id')
                                ->where("document_id","=", $id_row)
                                ->get();
                    
                    $user_id=$industry_user[0]->user_id;
                    $challenge_job_id=$industry_user[0]->job_id;
                    
                    $challenge_name = DB::table('challenges')
                                ->select('challenge_name')
                                ->where("challenge_job_id","=", $challenge_job_id)
                                ->get();
                    $challenge_name=$challenge_name[0]->challenge_name;
                    
                    $temp= $this->get_notification_template(9);
                    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                    $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                    
                    $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
                
                    DB::table('notifications')->insert([
                        'notification_user_id' => $user_id,
                        'notification_job_id' =>  NULL,
                        'notification_msg' => $msg, 
                        'notification_date' => $date, 
                        'notification_status' => 1,
                        'notification_type' => "delete",
                        'action_type' => "challenge_details",
                    ]);  
                    
                    //send email
                    
                    $user_email= $this->return_user_email($user_id);
                    $send_email =  $this->send_email($email_template,$user_email,$email_subject) ;
                        
                    
                    
                }
            
            }else{$res="role error";}
            
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
        }
        
    public function deactivate_user($userid,$token,$id_to_delete){
        $res="";
         
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $check_role= $this->return_user_role($id_to_delete);
                    if(count($check_role)==1){
                        $role=$check_role[0]->user_role_role_id;
                        if($role==3 || $role==1){
                            
                            if($role==1){
                                
                                $check_active= DB::table('basic_user')
                                            ->select('*')
                                            ->where("user_id","=",$id_to_delete)
                                            ->get();
                                if($check_active[0]->user_active==3){
                                    DB::table('basic_user')->where('user_id','=', $id_to_delete)->delete();
                                DB::table('users_from_admin_activation')->where('id_user','=', $id_to_delete)->delete();
                                DB::table('user_role')->where('user_role_userid','=', $id_to_delete)->delete();
                                }
                            }else{
                            
                            $check_industry= DB::table('industry_users')
                                            ->join('basic_user','basic_user.user_id','=','industry_users.user_id')
                                            ->select('industry_users.*')
                                            ->where("industry_users.user_id","=",$id_to_delete)
                                            ->where("basic_user.user_username","!=", NULL)
                                            ->get();
                                            
                            if(count($check_industry)>0){return"must be incompleted industry";}
                            else{
                
                                //send email
                                                
                                $temp= $this->get_notification_template(21);
                          
                                $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                                $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                        
                                $email= $this->return_user_email($id_to_delete);
                                $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                                
                                DB::table('basic_user')->where('user_id','=', $id_to_delete)->delete();
                                DB::table('industry_users')->where('user_id','=', $id_to_delete)->delete();
                                DB::table('user_role')->where('user_role_userid','=', $id_to_delete)->delete();
                            }
                            
                            }
                            
               
                        }else{$res="user to delete must be an industry user";}
                        
                    }else{$res="user to delete role error";}
                }else{$res="role error";}
            }else{$res="role error";}
            
        }else{$res="token error";}
        return $res;
        
    }
     
    public function get_users_by_role($role){
        
             $search_results = DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->join('roles', 'roles.role_id', '=', 'user_role.user_role_role_id')
                            ->select("basic_user.user_id","basic_user.user_name","basic_user.user_email","basic_user.user_username","basic_user.user_mobile","basic_user.user_office_number","basic_user.user_role","basic_user.user_active","basic_user.user_department","basic_user.created_date")
                            ->where("user_role.user_role_role_id","=", $role)
                            ->where("basic_user.user_active","=", '1')->get();
            
            $search_results = $search_results->map(function($user) {
                
                $dep=$user->user_department;
                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                $department_string=$department_name[0]->option_value_e;
                $user->user_department=$department_string;
                
                return $user;
            });                 
            
             return $search_results;
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
     
    public function return_user_role($user_id){
         
         $search_results = DB::table('user_role')
                            ->select("user_role_role_id")
                            ->where("user_role_userid","=", $user_id)->get();
		 return $search_results;
         
     }
     
    public function get_industry_id_by_user_id($id){
         $search_results = DB::table('industry_users')
                            ->select("industry_id")
                            ->where("user_id","=", $id)
                            ->get();
		 return $search_results;
     }
     
    public function get_admin_user_detail($userid,$token,$user){
        $search_results="";
        
         $check_token_time= $this->check_user_token_time($userid, $token) ;
         $token=md5($token);
         if($check_token_time){
             $check_role= $this->return_user_role($userid);
             if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
             $search_results = DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->join('roles', 'roles.role_id', '=', 'user_role.user_role_role_id')
                            ->select('basic_user.user_mobile','basic_user.user_office_number','basic_user.user_name','basic_user.user_email','basic_user.user_department','basic_user.user_role')
                            ->where("user_id","=", $user)->get();
                            
            $search_results = $search_results->map(function($user) {
                
                $dep=$user->user_department;
                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                $department_string=$department_name[0]->option_value_e;
                $user->user_department=$department_string;
                
                return $user;
            }); 
                            
                }else{$search_results="role error";}
             }else{$search_results="role error";}
         }else{$search_results="token error";}
         
        return $search_results;
        
    }
    
    public function get_company_detail($userid,$token,$user){
      
     /*    $check_token_time= $this->check_user_token_time($userid, $token) ;
         
         if($check_token_time){
             
             $check_role= $this->return_user_role($userid);
             if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    $search_results = DB::table('industry_users')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'industry_users.industry_id')
                                    ->select('industry_details.industry_details_id','industry_details.industry_detail_company_profile_name','industry_details.industry_details_company_main_customer','industry_details.industry_details_industry_type','industry_details.industry_details_company_name','industry_details.industry_details_company_email','industry_details.industry_details_company_address_line1','industry_details.industry_details_company_address_line2','industry_details.industry_details_company_type','industry_details.industry_details_headquarter','industry_details.industry_details_company_number_employee','industry_details.industry_details_company_primary_product','industry_details.industry_details_company_website','industry_details.industry_details_company_profile')
                                    ->where("industry_users.user_id","=", $user)
                                    ->get();
                    
                    $industry_id= $search_results[0]->industry_details_id;
                    
                    $social_links= DB::table('industry_social')
                                ->select('industry_social_link','industry_social_type')
                                ->where("industry_social_company_id","=",$industry_id)
                                ->get();
                    
                    $company_detail= array($search_results,$social_links);
                    return $company_detail;
                }else{return"role error";}
             }else{return"role error";}
         }else{return"token error";}
        */
    }
    
    public function update_user($id_to_edit,$userid,$token,$name,$phone,$office_number,$job){
        
    /*    $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);
         if($check_token_time){
             
             $check_role= $this->return_user_role($userid);
          if(count($check_role)==1){
              $role=$check_role[0]->user_role_role_id;
              if($role==4){
             
         $update = DB::table('basic_user')->where('user_id','=', $id_to_edit)->update(['user_name' => $name , 'user_mobile' =>$phone,'user_office_number'=>$office_number,'user_role'=>$job]);
         return $update;
         
         //notification
            date_default_timezone_set("Asia/Beirut");
            $date = date("Y/m/d H:i:s");
            
            $temp= $this->get_notification_template(10);
            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
            
            $msg = $temp[0]->notification_message;eval("\$msg = \"$msg\";");
            
            DB::table('notifications')->insert([
                    'notification_user_id' => $id_to_edit,
                    'notification_job_id' =>  NULL,
                    'notification_msg' => $msg, 
                    'notification_date' => $date, 
                    'notification_status' => 1,
                    'notification_type' => "update user",
                ]);  
        
            //send email
    
            $email= $this->return_user_email($id_to_edit);
            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
        
              }
              else{return"role error";}
        
        
         }else{return"rolle error";}
         
         
    }else{return"token error";}*/
    
    }
    
    public function admin_update_company($adminid,$token,$userid,$headquarter,$address1,$address2,$caddress,$cemail,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$website){
    /*  $check_token_time= $this->check_user_token_time($adminid, $token) ;
        if($check_token_time){
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                $string_customer="";
                $string_itype="";
                
                foreach ($customer as $value) {
                    $string_customer.=$value.",";
                }
                
                foreach ($iType as $value1) {
                    $string_itype.=$value1.",";
                }
                
                $update = DB::table('industry_details')->where('industry_details_userid','=', $userid)->update(['industry_details_company_name' => $cname , 
                'industry_details_company_website' => $website,
                'industry_details_company_email' => $cemail,
                'industry_details_company_address_country' => $caddress,
                'industry_details_headquarter' => $headquarter,
                'industry_details_company_address_line1' => $address1,
                'industry_details_company_address_line2' => $address2,
                'industry_details_industry_type' => $string_itype,
                'industry_details_company_type' => $cType,
                'industry_details_company_number_employee' => $employees,
                'industry_details_company_primary_product' => $product,
                'industry_details_company_main_customer' => $string_customer,
                'industry_details_company_profile' => $file,
                'updated_at' => $date]);
                
                
                $user_industry_id = $this->get_industry_id_by_user_id($userid);
                $industry_id=$user_industry_id[0]->industry_id;
                
                DB::table('industry_social')->where('industry_social_company_id', '=', $industry_id)->delete();
                
                for($i=0;$i<count($social);$i++){
                
                $id2= DB::table('industry_social')->insert(['industry_social_company_id' => $industry_id,'industry_social_type' => $social[$i],'industry_social_link' => $link[$i],'created_date' => $date,'updated_date' => null,]); 
                
                }
                
                //send email
                            
                $temp= $this->get_notification_template(22);
                $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                
                $email= $this->return_user_email($userid);
                $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                
                if($userid){return"submited";}else{return"error";}
                
                }else{return"role error";}
            }else{return"role error";}
        }else{return"token error";}
        
    */
    }
        
    public function get_admin_notifications($userid,$token){
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token);
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    $last_notifications= DB::table('admin_notifications')
                                    ->select("*")
                                    ->where("admin_notification_user_id","!=", $userid)
                                    ->orderBy('admin_notification_date', 'desc')
                                    ->limit(10)
                                    ->get();
                                    
                    $unread_notifications= DB::table('admin_notifications')
                                    ->select("*")
                                    ->where("admin_notification_status","=", 1)
                                    ->where("admin_notification_user_id","!=", $userid)
                                    ->orderBy('admin_notification_date', 'desc')
                                    ->get();
                                
                    $count_unread= count($unread_notifications);
                    
                    $notifications= DB::table('admin_notifications')
                                    ->select("*")
                                    ->where("admin_notification_status","=", 0)
                                    ->where("admin_notification_user_id","!=", $userid)
                                    ->orderBy('admin_notification_date', 'desc')
                                    ->get();
                    
                    $res= array($count_unread,$last_notifications,$notifications);
                    
                }
            }
        
        }else{$res="token error";}
        return $res;
    }
    
    public function return_user_email($user_id){
         
        $search_results = DB::table('basic_user')
                            ->select("*")
                            ->where("user_id","=", $user_id)
                            ->get();
        
        $email=$search_results[0]->user_email;
		return $email;
         
     }
     
    public function send_email($template,$email1,$subj){
        
         try {
              $data=array("temp"=>$template);
              Mail::send('email_template.email_template', $data, function($message) use ($email1,$subj){
              $message->to($email1, 'CNAM PORTAL')->subject($subj);
              $message->from('info@levanhub.com','CNAM Portal');
                
            });
            return "done";
 // Catch the error
 } catch(\Swift_TransportException $e){
    if($e->getMessage()) {
       return "done";
    }             
 }
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
    
    public function check_user_activation_token($token,$email){
        $user="";
        $rows = DB::table('users_from_admin_activation')
                ->join('basic_user','basic_user.user_id','=','users_from_admin_activation.id_user')
                ->select('*')
                ->where("users_from_admin_activation.user_email","=", $email)
                ->where("users_from_admin_activation.token","=", $token)
                ->where("users_from_admin_activation.submit","=", 0)
                ->where("basic_user.user_active","!=", 2)
                ->get();
   
        if(count($rows)==1){
           $user=DB::table('basic_user')
                ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                ->select('basic_user.user_name','basic_user.user_email','user_role.user_role_role_id')
                ->where('user_email',"=", $email)
                ->get();
                
       }
       else{$user="not ok";}
       return $user;
    }
    
    public function get_jobs_by_admin($userid,$token,$type_of_id,$entity_id){
        $res="";
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
         
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
              if($type_of_id=="company"){$cond="job.job_industry_id";}
               else if($type_of_id=="user"){$cond="job.job_user_id";}
               
                    $internship_search_results = DB::table('job')
                                            ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                            ->select('job.*','internship.*')
                                            ->where($cond,"=", $entity_id)
                                            ->where("job.job_type","=", "internship")
                                            ->where("job.job_active","=", "1")
                                            ->orderBy('job.created_date', 'asc')
                                            ->get();
                                
                    $challenge_search_results = DB::table('job')
                                            ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                            ->select('job.*','challenges.*')
                                            ->where("job.job_type","=", "challenge")
                                            ->where($cond,"=", $entity_id)
                                            ->where("job.job_active","=", "1")
                                            ->orderBy('job.created_date', 'desc')
                                            ->get();
                    
                    $res=array($internship_search_results,$challenge_search_results);
               
                }
            
        }else{$res="role error";}
        
        }else{$res="token error";}
    
    return $res;    
    }
    
    public function get_admin_statistics($adminid,$token){
        $statistics="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    //challenge
                    $challenge_pending_review = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING REVIEW")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_pending_info = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING INFO")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_in_progress = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "IN PROGRESS")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_closed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "CLOSED")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_completed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "COMPLETED")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    //internship
                    $internship_pending_review = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING REVIEW")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_in_progress = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "IN PROGRESS")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_closed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "CLOSED")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_students_assigned = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "STUDENTS ASSIGNED")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    //kaust users
                    $active_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 1)
                                    ->count();
                    
                    $inactive_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 3)
                                    ->count();
                    
                /*    $deactivated_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 2)
                                    ->count(); */
                    
                    //industry users
                    $active_industrys = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("basic_user.user_active","=", 1)
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->count();
                    
                    $inactive_industrys = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->where("basic_user.user_active","=", 3)
                                    ->orwhere("basic_user.user_active","=", 0)
                                    ->count();
                    
                /*    $deactivated_industrys = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("basic_user.user_active","=", 2)
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->count(); */
                    
                    //challenges
                    $challenges = DB::table('job')
                                    ->select('*')
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    //internships
                    $internships = DB::table('job')
                                    ->select('*')
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    //kaust
                    $kaust = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->count();
                    
                    //companies
                    $companies = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->count();
                    
                    //monthly statistics
                    $currentMonth = date('m');
                    
                    $monthly_internship=array();
                    for($i=01;$i<=$currentMonth;$i++){ 
                        $internships = DB::table('job')
                                        ->select('job_id')
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", 1)
                                        ->whereMonth('created_date', '=', $i)
                                        ->count();
                        
                        array_push($monthly_internship, $internships);
                    }  
                    
                    $monthly_challenge=array();
                    for($i=01;$i<=$currentMonth;$i++){ 
                        $challenges = DB::table('job')
                                        ->select('job_id')
                                        ->where("job_type","=", "challenge")
                                        ->where("job_active","=", 1)
                                        ->whereMonth('created_date', '=', $i)
                                        ->count();
                        
                        array_push($monthly_challenge, $challenges);
                    }  
                    
                    $settings = DB::table('settings')
                                    ->select('settings_value')
                                    ->where("settings_key","=", "document_summary")
                                    ->get();
                                    
                    $pending_challenges= DB::table('job')
                                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                        ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                        ->select('challenges.challenge_name','job.job_id','industry_details.industry_details_company_name','industry_details.industry_details_headquarter','industry_details.industry_details_company_address_line1','industry_details.created_at','assign_job.id_assign_job','basic_user.user_name')
                                        ->where("job_status","=", "PENDING REVIEW")
                                        ->where("job_type","=", "challenge")
                                        ->where("job_active","=", "1")
                                        ->get();
                    
                    $pending_internships= DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                        ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                        ->select('internship.internship_job_title','internship.internship_institution_name','internship.internship_location','job.job_id','industry_details.created_at','assign_job.id_assign_job','basic_user.user_name')
                                        ->where("job_status","=", "PENDING REVIEW")
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", "1")
                                        ->get();
                    
                    $statistics=array($challenge_pending_review,$challenge_pending_info,$challenge_in_progress,$challenge_closed,$challenge_completed,$internship_pending_review,$internship_in_progress,$internship_closed,$internship_students_assigned,$active_users,$inactive_users,$active_industrys,$inactive_industrys,$challenges,$internships,$kaust,$companies,$monthly_internship,$monthly_challenge,$settings,$pending_challenges,$pending_internships);
                  
                }else{$statistics="role error";}
            }
        }else{$statistics="token error";}
        return $statistics;
    }
    
    public function get_admin_statistics_details($adminid,$token,$type,$status){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    if($type=="challenge"){
                        
                        $res = DB::table('job')
                                ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                ->select('challenges.challenge_name','job.job_id','industry_details.industry_details_company_name','industry_details.industry_details_headquarter','industry_details.industry_details_company_address_line1','industry_details.created_at','assign_job.id_assign_job','basic_user.user_name')
                                ->where("job_status","=", $status)
                                ->where("job_type","=", $type)
                                ->where("job_active","=", "1")
                                ->get();
                                        
                    }
                    
                    if($type=="internship"){
                        
                        $res = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('internship.internship_job_title','internship.internship_institution_name','internship.internship_location','job.job_id','industry_details.created_at','assign_job.id_assign_job','basic_user.user_name')
                                        ->where("job_status","=", $status)
                                        ->where("job_type","=", $type)
                                        ->where("job_active","=", "1")
                                        ->get();
                        
                    }
                    
                    if($type=="kaust users"){
                        if($status=="active"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_department','basic_user.user_role')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 1)
                                    ->get();
                            
                            $res = $res->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                        
                        }
                        if($status=="inactive"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_department','basic_user.user_role')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 3)
                                    ->get();
                                    
                            $res = $res->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                                    
                        }
                        if($status=="deactivated"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_department','basic_user.user_role')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 2)
                                    ->get();
                                    
                            $res = $res->map(function($user) {
                
                                $dep=$user->user_department;
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $dep)->get();
                                $department_string=$department_name[0]->option_value_e;
                                $user->user_department=$department_string;
                                
                                return $user;
                            }); 
                                    
                        }
                    }
                    
                    if($type=="industry users"){
                        if($status=="active"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_role')
                                    ->where("basic_user.user_active","=", 1)
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->get();
                    
                        }
                        if($status=="inactive"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_role')
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->where("basic_user.user_active","=", 3)
                                    ->orwhere("basic_user.user_active","=", 0)
                                    ->get();
                    
                        }
                        if($status=="deactivated"){
                            $res = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_mobile','basic_user.created_date','basic_user.user_role')
                                    ->where("basic_user.user_active","=", 2)
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->get();
                            
                        }
                    }
                  
                }else{$res="role error";}
            }
        }else{$res="token error";}
        return $res;
    }
    
    public function get_mailchimp_lists($request){
        $mailchimp_base="us6";
        $mailchimp_api="1d26d109059d5067f6ea13183bd54b86-us6";
        $info = $this->rudr_mailchimp_curl_connect("https://$mailchimp_base.api.mailchimp.com/3.0/lists","GET","$mailchimp_api",null);
        return $data = json_decode($info,true)['lists'] ;
        
        
    }
    
    public function rudr_mailchimp_curl_connect( $url, $request_type, $api_key, $data = array() ) {
        if( $request_type == 'GET' )
            $url .= '?';
        
        $mch = curl_init();
        $headers = array(
                         'Content-Type: application/json',
                         'Authorization: Basic '.base64_encode( 'user:'. $api_key )
                         );
        curl_setopt($mch, CURLOPT_URL, $url );
        curl_setopt($mch, CURLOPT_HTTPHEADER, $headers);
        //curl_setopt($mch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
        curl_setopt($mch, CURLOPT_RETURNTRANSFER, true); // do not echo the result, write it into variable
        curl_setopt($mch, CURLOPT_CUSTOMREQUEST, $request_type); // according to MailChimp API: POST/GET/PATCH/PUT/DELETE
        curl_setopt($mch, CURLOPT_TIMEOUT, 10);
        curl_setopt($mch, CURLOPT_SSL_VERIFYPEER, false); // certificate verification for TLS/SSL connection
        
        if( $request_type != 'GET' ) {
            curl_setopt($mch, CURLOPT_POST, true);
            curl_setopt($mch, CURLOPT_POSTFIELDS, json_encode($data) ); // send data in json
        }
        
        return curl_exec($mch);
    }
    
    public function send_newsletter($request){
 
        $mailchimp_base="us6";
        $mailchimp_api="1d26d109059d5067f6ea13183bd54b86-us6";
       
        $campaign_name = $request->input('camp_name');
        $list_id = $request->input('list');
        $subject = $request->input('subject');
        $content = $request->input('message');
 
        
          function isa_create_mailchimp_campaign( $list_id, $subject ,$campaign_name) {
        
        $mailchimp_base="us6";
        $mailchimp_api="1d26d109059d5067f6ea13183bd54b86-us6";
        $reply_to="maroun.karam@greynab.com";
        $from_name="Kaust";
        
        $campaign_id = '';
        $body = array(
                      'recipients'    => array('list_id' => $list_id),
                      'type'          => 'regular',
                      'settings'      => array('subject_line' => $subject,
                                               'reply_to'      => $reply_to,
                                               'from_name'     => $from_name
                                               )
                      );
       
        $data = array("recipients" => array("list_id" => "$list_id"), "type" => "regular", "settings" => array("subject_line" => "$subject", "title" => "$campaign_name", "reply_to" => "$reply_to" ,"from_name" => "$from_name"));
        $data = json_encode($data);
        $curl = curl_init();
        curl_setopt_array($curl, array(
                                       //Sample url
                                       CURLOPT_URL => "https://$mailchimp_base.api.mailchimp.com/3.0/campaigns",
                                       CURLOPT_RETURNTRANSFER => true,
                                       CURLOPT_TIMEOUT => 30,
                                       CURLOPT_CUSTOMREQUEST => "POST",
                                       CURLOPT_POSTFIELDS => $data,
                                       CURLOPT_HTTPHEADER => array(
                                                                   "authorization: apikey $mailchimp_api"
                                                                   ),
                                       ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);
        
        curl_close($curl);
        
        if ($err) {
            $response = $err;
            
        }
        
        $respnse=strval( $response );
        
        $id=explode('{"id":"',$response);
        
        $id=$id[1];
        $id=explode('"',$id);
        
        $id=$id[0];
        
        
        $campaign_id = $id;
        
        
        
        
        return $campaign_id ? $campaign_id : false;
        
    }
          function isa_set_mail_campaign_content( $campaign_id, $template_content ) {
          $mailchimp_base="us6";
          $mailchimp_api="1d26d109059d5067f6ea13183bd54b86-us6";
          $Content_options = array(
                                 'html' => $template_content
                                 );
        $data = json_encode($Content_options);
        
        $curl = curl_init();
        curl_setopt_array($curl, array(
                                       //Sample url
                                       CURLOPT_URL => "https://$mailchimp_base.api.mailchimp.com/3.0/campaigns/$campaign_id/content",
                                       CURLOPT_RETURNTRANSFER => true,
                                       CURLOPT_TIMEOUT => 30,
                                       CURLOPT_CUSTOMREQUEST => "PUT",
                                       CURLOPT_POSTFIELDS => $data,
                                       CURLOPT_HTTPHEADER => array(
                                                                   "authorization: apikey $mailchimp_api"
                                                                   ),
                                       ));
        
        $response = curl_exec($curl);
        $err = curl_error($curl);
        
        curl_close($curl);
        
        return true;
        
        
        
    }
    
    
        
        $campaign_id = isa_create_mailchimp_campaign( $list_id, $subject, $campaign_name);
        $set_campaign_content = isa_set_mail_campaign_content( $campaign_id, $content );
         if ( $set_campaign_content ) {
                
                $curl = curl_init();
                curl_setopt_array($curl, array(
                                               //Sample url
                                               CURLOPT_URL => "https://$mailchimp_base.api.mailchimp.com/3.0/campaigns/$campaign_id/actions/send",
                                               CURLOPT_RETURNTRANSFER => true,
                                               CURLOPT_TIMEOUT => 30,
                                               CURLOPT_CUSTOMREQUEST => "POST",
                                               CURLOPT_HTTPHEADER => array(
                                                                           "authorization: apikey $mailchimp_api"
                                                                           ),
                                               ));
                
                $response = curl_exec($curl);
                $err = curl_error($curl);
                
                curl_close($curl);
                
                return"success";
                
                
            }
        
    
        
    }
    
    public function getCampaigns(){
        
        $mailchimp_base="us6";
        $mailchimp_api="1d26d109059d5067f6ea13183bd54b86-us6";
        $info = $this->rudr_mailchimp_curl_connect("https://$mailchimp_base.api.mailchimp.com/3.0/campaigns","GET","$mailchimp_api",null);
        $data = json_decode($info,true)["campaigns"];
        return$data;

    }
    
    public function export_jobs($userid,$token,$toe,$toj,$jobs_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    $title="";
                    if($toj=="internship"){
                        
                        $content="";
                  
                        $internships = DB::table('job')
                                            ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                            ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                            ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                            ->select('job.*','internship.*','basic_user.user_name','industry_details.*')
                                            ->where("job.job_type","=", "internship")
                                            ->where("job.job_active","=", "1")
                                            ->whereIn('job.job_id', $jobs_id)
                                            ->orderBy('job.created_date', 'asc')
                                            ->get();
                                            
                        $title="Kaust Internships Export";
                        $content=" <tr><th>Job ID</th><th>Internship Name</th><th>Institution/Company Name</th><th>Internship Location</th><th>Assigned to</th><th>Status</th><th>Created Date</th></tr>";

                        foreach($internships as $internship){
                            
                            $job_id=$internship->internship_id;
                            $internship_name=$internship->internship_job_title;
                            $industryname=$internship->internship_institution_name;
                            $industry_locations= $internship->internship_location;
                            $assigned_to=$internship->user_name;
                            $job_status=$internship->job_status;
                            $created_date=$internship->created_date;
                            
                            $content.="<tr>
                                        <td>$job_id</td>
                                        <td>$internship_name</td>
                                        <td>$industryname</td>
                                        <td>$industry_locations</td>
                                        <td>$assigned_to</td>
                                        <td>$job_status</td>
                                        <td>$created_date</td>
                                      </tr>";
                        }
                                            
                    }
                    else if($toj=="challenge"){
                     $title="Kaust Challenges Export";
                     $content="";
                         $challenges = DB::table('job')
                                            ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                            ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                            ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                            ->select('job.*','challenges.*','basic_user.user_name','industry_details.*')
                                            ->where("job.job_type","=", "challenge")
                                            ->where("job.job_active","=", "1")
                                            ->whereIn('job.job_id', $jobs_id)
                                            ->orderBy('job.created_date', 'asc')
                                            ->get();
                                            
                        $content=" <tr>
                                    <th>Job ID</th>
                                    <th>Challenge Name</th>
                                    <th>Challenge Type</th>
                                    <th>Industry Name</th>
                                    <th>Industry Location</th>
                                    <th>Assigned to</th>
                                    <th>Status</th>
                                    <th>Created Date</th>
                                   </tr>";

                        foreach($challenges as $challenge){
                            
                            $job_id=$challenge->challenge_id;
                            $challenge_name=$challenge->challenge_name;
                            $challenge_type=$challenge->challenge_type;
                            $industryname=$challenge->industry_details_company_name;
                            $industry_locations= $challenge->industry_details_headquarter;
                            $industry_locations2= $challenge->industry_details_company_address_line1;
                            $assigned_to=$challenge->user_name;
                            $job_status=$challenge->job_status;
                            $created_date=$challenge->created_date;
                            
                            $headquarter_string="";
                            $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_locations)->get();
                            $headquarter_string=$head_name[0]->option_value_e;
                            
                            $content.="<tr>
                                        <td>$job_id</td>
                                        <td>$challenge_name</td>
                                        <td>$challenge_type</td>
                                        <td>$industryname</td>
                                        <td>$headquarter_string, $industry_locations2</td>
                                        <td>$assigned_to</td>
                                        <td>$job_status</td>
                                        <td>$created_date</td>
                                      </tr>";
                        }
                
                    }
                    
                    if($toe=="csv"){
                        
                        if($toj=="challenge"){
                           
                            $fp = fopen('uploads/exports/challenge_export.csv', 'w');
                            fputcsv($fp, array('Job ID','Challenge Name','Challenge Type', 'Industry Name','Industry Location', 'Assigned to', 'Status', 'Created Date'));
                            
                            foreach($challenges as $challenge){
                            
                                $job_id=$challenge->challenge_id;
                                $challenge_name=$challenge->challenge_name;
                                $challenge_type=$challenge->challenge_type;
                                $industryname=$challenge->industry_details_company_name;
                                $industry_locations= $challenge->industry_details_headquarter;
                                $industry_locations2= $challenge->industry_details_company_address_line1;
                                $assigned_to=$challenge->user_name;
                                $job_status=$challenge->job_status;
                                $created_date=$challenge->created_date;
                                
                                $headquarter_string="";
                                $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_locations)->get();
                                $headquarter_string=$head_name[0]->option_value_e;
                            
                                $industry_location= $headquarter_string.' , '.$industry_locations2;
                                
                                fputcsv($fp, array($job_id,$challenge_name,$challenge_type,$industryname,$industry_location,$assigned_to,$job_status,$created_date));

                            }
                            
                           $str = file_get_contents('uploads/exports/challenge_export.csv');
                           $file= base64_encode($str);

                        }
                        else if($toj=="internship"){
                            $fp = fopen('uploads/exports/internship_export.csv', 'w');
                            fputcsv($fp, array('Job ID','Internship Name', 'Institution/Company Name','Internship Location', 'Assigned to', 'Status', 'Created Date'));
                            
                            foreach($internships as $internship){
                            
                                $job_id=$internship->internship_id;
                                $internship_name=$internship->internship_job_title;
                                $industryname=$internship->internship_institution_name;
                                $industry_location= $internship->internship_location;
                                $assigned_to=$internship->user_name;
                                $job_status=$internship->job_status;
                                $created_date=$internship->created_date;

                                fputcsv($fp, array($job_id,$internship_name,$industryname,$industry_location,$assigned_to,$job_status,$created_date));

                            }
                            
                            $str = file_get_contents('uploads/exports/internship_export.csv');
                            $file= base64_encode($str);
                        }                        
                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;
                    
    }
    
    public function export_custom_challenges($userid,$token,$from_date,$to_date,$challenge_type,$hear){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
        
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
              
                    $query="";
                    
                    $challenge_by_date = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->select('job.job_id');
                                
                    if($from_date!=null){$challenge_by_date->where('job.created_date','>=',$from_date);}
                    if($to_date!=null){$challenge_by_date->where('job.created_date','<=',$to_date);}
                    $result_by_date = $challenge_by_date->get();
                    
                    $challenge_by_type = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->select('job.job_id');
                                    
                    if($challenge_type!=null){
                       foreach ($challenge_type as $one_type) {
                            $challenge_by_type->where('challenges.challenge_type','=', $one_type);
                            $challenge_by_type->orwhere('challenges.challenge_type','=', "$one_type");
                        }
                    }
                    $result_by_type = $challenge_by_type->get();
                    
                    
                    $challenge_by_hear = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->select('job.job_id');
                                    
                    if($hear !=null){
                        foreach ($hear as $one_hear) {
                            $challenge_by_hear->where('challenges.challenge_hear','=', $one_hear);
                            $challenge_by_hear->orwhere('challenges.challenge_hear','=', "$one_hear");
                        }
                    }
                    $result_by_hear = $challenge_by_hear->get();
                    
                    
                    $jobs_id=array();  
                    
                    $array1=array(); $array2=array(); $array3=array();
                    foreach ($result_by_date as $res) {$id=$res->job_id; array_push($array1,$id);}
                    foreach ($result_by_type as $res) {$id=$res->job_id; array_push($array2,$id);}
                    foreach ($result_by_hear as $res) {$id=$res->job_id; array_push($array3,$id);}
                   
                    $jobs_id = array_intersect($array1,$array2,$array3);
                    
                    $title="Challenges Export";
                    $content="";
                    $challenges = DB::table('job')
                                ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                ->select('job.*','challenges.*','basic_user.user_name','industry_details.*')
                                ->where("job.job_type","=", "challenge")
                                ->where("job.job_active","=", "1")
                                ->whereIn('job.job_id', $jobs_id)
                                ->orderBy('job.created_date', 'asc')
                                ->get();
                                    
                    $content=" <tr>
                            <th>Job ID</th>
                            <th>Challenge Name</th>
                            <th>Challenge Type</th>
                            <th>Industry Name</th>
                            <th>Industry Location</th>
                            <th>Assigned to</th>
                            <th>Status</th>
                            <th>Created Date</th>
                           </tr>";
                    
                    foreach($challenges as $challenge){
                    
                        $job_id=$challenge->challenge_id;
                        $challenge_name=$challenge->challenge_name;
                        $challenge_type=$challenge->challenge_type;
                        $industryname=$challenge->industry_details_company_name;
                        $industry_locations= $challenge->industry_details_headquarter;
                        $industry_locations2= $challenge->industry_details_company_address_line1;
                        $assigned_to=$challenge->user_name;
                        $job_status=$challenge->job_status;
                        $created_date=$challenge->created_date;
                        
                        $headquarter_string="";
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_locations)->get();
                        $headquarter_string=$head_name[0]->option_value_e;
                        
                        $content.="<tr>
                                    <td>$job_id</td>
                                    <td>$challenge_name</td>
                                    <td>$challenge_type</td>
                                    <td>$industryname</td>
                                    <td>$headquarter_string, $industry_locations2</td>
                                    <td>$assigned_to</td>
                                    <td>$job_status</td>
                                    <td>$created_date</td>
                                  </tr>";
                    }
                    
                    
                    date_default_timezone_set("Asia/Beirut");
                    $today_date = date("Y/m/d");
                
                    $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $options=array(
                        "ssl"=>array(
                            "verify_peer"=>false,
                            "verify_peer_name"=>false,
                        ),
                    );  
                    $data = file_get_contents($path, false, stream_context_create($options));
                    
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
                
                }else{$file="role error";}
            }else{$file="role error";}
            
        }else{$file="token error";}
        return $file;
    }
    
    public function export_custom_internships($userid,$token,$from_date,$to_date,$internship_length,$major){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
        
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
              
                    $query="";
                    
                    $internship_by_date = DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id');
                                    
                    $internship_by_date->select('job.job_id');
                    if($from_date!=null){$internship_by_date->where('job.created_date','>=',$from_date);}
                    if($to_date!=null){$internship_by_date->where('job.created_date','<=',$to_date);}
                    $result_by_date = $internship_by_date->get();
                    
                    $internship_by_length = DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id');
                                    
                    $internship_by_length->select('job.job_id');
                    if($internship_length!=null){
                        foreach ($internship_length as $one_length) {
                            $internship_by_length->where('internship.internship_length','=', $one_length);
                            $internship_by_length->orwhere('internship.internship_length','=', "$one_length");
                        }
                    }
                    $result_by_type = $internship_by_length->get();
                    
                    
                    $internship_by_major = DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id');
                                    
                    $internship_by_major->select('job.job_id');
                    if($major !=null){
                        foreach ($major as $one_major) {
                            $internship_by_major->where('internship.student_major','=', $one_major);
                            $internship_by_major->orwhere('internship.student_major','=', "$one_major");
                        }
                    }
                    $result_by_hear = $internship_by_major->get();
                    
                    
                    $jobs_id=array();  
                    
                    $array1=array(); $array2=array(); $array3=array();
                    foreach ($result_by_date as $res) {$id=$res->job_id; array_push($array1,$id);}
                    foreach ($result_by_type as $res) {$id=$res->job_id; array_push($array2,$id);}
                    foreach ($result_by_hear as $res) {$id=$res->job_id; array_push($array3,$id);}
                   
                    $jobs_id = array_intersect($array1,$array2,$array3);
                    
                    $content="";
                  
                    $internships = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                        ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('job.*','internship.*','basic_user.user_name','industry_details.*')
                                        ->where("job.job_type","=", "internship")
                                        ->where("job.job_active","=", "1")
                                        ->whereIn('job.job_id', $jobs_id)
                                        ->orderBy('job.created_date', 'asc')
                                        ->get();
                                        
                    $title="Internships Export";
                    $content=" <tr><th>Job ID</th><th>Internship Name</th><th>Institution/Company Name</th><th>Internship Location</th><th>Assigned to</th><th>Status</th><th>Created Date</th></tr>";

                    foreach($internships as $internship){
                        
                        $job_id=$internship->internship_id;
                        $internship_name=$internship->internship_job_title;
                        $industryname=$internship->internship_institution_name;
                        $industry_locations= $internship->internship_location;
                        $assigned_to=$internship->user_name;
                        $job_status=$internship->job_status;
                        $created_date=$internship->created_date;
                        
                        $content.="<tr>
                                    <td>$job_id</td>
                                    <td>$internship_name</td>
                                    <td>$industryname</td>
                                    <td>$industry_locations</td>
                                    <td>$assigned_to</td>
                                    <td>$job_status</td>
                                    <td>$created_date</td>
                                  </tr>";
                    }
                    
                    
                    date_default_timezone_set("Asia/Beirut");
                    $today_date = date("Y/m/d");
                
                    $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $options=array(
                        "ssl"=>array(
                            "verify_peer"=>false,
                            "verify_peer_name"=>false,
                        ),
                    );  
                    $data = file_get_contents($path, false, stream_context_create($options));
                    
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
                    
                }else{$file="role error";}
            }else{$file="role error";}
        }else{$file="token error";}
        return $file;
              
    }
    
    public function export_users($userid,$token,$toe,$users_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    $title="";
                   
                        
                        $kaust_users = DB::table('basic_user')
                                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                            ->select('basic_user.*')
                                            ->where("user_role.user_role_role_id","=", "1")
                                            ->where("basic_user.user_active","=", "1")
                                            ->whereIn('basic_user.user_id', $users_id)
                                            ->orderBy('basic_user.created_date', 'asc')
                                            ->get();
                        
                        $title="Kaust Users Export";
                        $content="";
                        $content=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Department</th><th>Created Date</th></tr>";

                        foreach($kaust_users as $user){
                            $name=$user->user_name;
                            $email=$user->user_email;
                            $username=$user->user_username;
                            $gender=$user->user_gender;
                            $mobile=$user->user_mobile;
                            $office_number=$user->user_office_number;
                            $department=$user->user_department;
                            $date= $user->created_date;
                            
                            $department_string="";
                            $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                            $department_string=$department_name[0]->option_value_e;
                            
                            $content.="<tr>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$username</td>
                                        <td>$gender</td>
                                        <td>$mobile</td>
                                        <td>$office_number</td>
                                        <td>$department_string</td>
                                        <td>$date</td>
                                      </tr>";
                        }
                                            
                    
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                            fputcsv($fp, array('User Name', 'Email','Username', 'Gender','Mobile','Office Number','Department','Created Date'));
                            
                            foreach($kaust_users as $user){
                            
                                $name=$user->user_name;
                                $email=$user->user_email;
                                $username=$user->user_username;
                                $gender=$user->user_gender;
                                $mobile=$user->user_mobile;
                                $office_number=$user->user_office_number;
                                $department=$user->user_department;
                                $date=$user->created_date;
                                
                                $department_string="";
                                $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                                $department_string=$department_name[0]->option_value_e;
                                
                                fputcsv($fp, array($name,$email,$username,$gender,$mobile,$office_number,$department_string,$date));

                            }
                            
                           $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                           $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = '';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;
                    
    }
    
    public function export_custom_users($userid,$token,$from_date,$to_date,$department,$status){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
        
                $admin_role=$check_role[0]->user_role_role_id;
                if($admin_role==4){
              
                    $query="";
                    
                    $users_by_date = DB::table('basic_user')
                                    ->select('user_id');
                                    
                    if($from_date!=null){$users_by_date->where('created_date','>=',$from_date);}
                    if($to_date!=null){$users_by_date->where('created_date','<=',$to_date);}
                    $result_by_date = $users_by_date->get();
                    
                    $users_by_department = DB::table('basic_user')
                                    ->select('user_id');
                                    
                    if($department!=null){
                       foreach ($department as $one_department) {
                            $users_by_department->where('user_department','=', $one_department);
                            $users_by_department->orwhere('user_department','=', "$one_department");
                        }
                    }
                    $result_by_department = $users_by_department->get();
                    
                    $users_by_status = DB::table('basic_user')
                                    ->select('user_id');
                                    
                    if($status!=null){
                        if($status[0]=="active"){$role=1;}
                        if($status[0]=="inactive"){$role=3;}
                        $users_by_status->where('user_active','=', $role);
                    }
                    $result_by_status = $users_by_status->get();
                    
                    $jobs_id=array();  
                    
                    $array1=array(); $array2=array(); $array3=array();
                    foreach ($result_by_date as $res) {$id=$res->user_id; array_push($array1,$id);}
                    foreach ($result_by_department as $res) {$id=$res->user_id; array_push($array2,$id);}
                    foreach ($result_by_status as $res) {$id=$res->user_id; array_push($array3,$id);}
                   
                    $users_id = array_intersect($array1,$array2,$array3);
                
                    $title="Kaust Users Export";
                    $content="";
                    $content=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Department</th><th>Created Date</th></tr>";

                    $kaust_users = DB::table('basic_user')
                                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                            ->select('basic_user.*')
                                            ->where("user_role.user_role_role_id","=", "1")
                                            ->where("basic_user.user_active","=", "1")
                                            ->whereIn('basic_user.user_id', $users_id)
                                            ->orderBy('basic_user.created_date', 'asc')
                                            ->get();
                    
                    foreach($kaust_users as $user){
                        $name=$user->user_name;
                        $email=$user->user_email;
                        $username=$user->user_username;
                        $gender=$user->user_gender;
                        $mobile=$user->user_mobile;
                        $office_number=$user->user_office_number;
                        $department=$user->user_department;
                        $date= $user->created_date;
                        
                        $department_string="";
                        $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                        $department_string=$department_name[0]->option_value_e;
                        
                        $content.="<tr>
                                    <td>$name</td>
                                    <td>$email</td>
                                    <td>$username</td>
                                    <td>$gender</td>
                                    <td>$mobile</td>
                                    <td>$office_number</td>
                                    <td>$department_string</td>
                                    <td>$date</td>
                                  </tr>";
                    }
                    
                    date_default_timezone_set("Asia/Beirut");
                    $today_date = date("Y/m/d");
                
                    $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $options=array(
                        "ssl"=>array(
                            "verify_peer"=>false,
                            "verify_peer_name"=>false,
                        ),
                    );  
                    $data = file_get_contents($path, false, stream_context_create($options));
                    
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
                    
                }else{$file="role error";}
            }else{$file="role error";}
        }else{$file="token error";}
        return $file;
    }
    
    public function export_industry($userid,$token,$toe,$industries_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                     $title="Industries Export";
                     $content="";

                        $industry = DB::table('industry_details')
                                            ->select('*')
                                            ->whereIn('industry_details_id', $industries_id)
                                            ->orderBy('created_at', 'asc')
                                            ->get();
                                            
                        $content=" <tr><th>Industry Name</th><th>Email</th><th>Industry Type</th><th>Phone Number</th><th>Headquarter</th></tr>";

                        foreach($industry as $one){
                            $id_comp=$one->industry_details_id;
                            $name=$one->industry_details_company_name;
                            $email=$one->industry_details_company_email;
                            $website=$one->industry_details_company_website;
                            $country=$one->industry_details_company_address_country;
                            $industry_headquarter=$one->industry_details_headquarter;
                            $industry_type=$one->industry_details_industry_type;
                            $phone=$one->industry_detail_company_phone;
                            $date=$one->created_at;
                            
                            $headquarter="";
                            $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                            $headquarter=$head_name[0]->option_value_e;
                            
                            $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                            
                            
                            
                            $content.="<tr>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$industry_string</td>
                                        <td>$phone</td>
                                        <td>$headquarter</td>
                                        
                                      </tr>";
                        }
                
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/kaust_industry_export.csv', 'w');
                          
                            fputcsv($fp, array('Industry Name', 'Email','Industry Type', 'Phone Number','Headquarter','Created Date'));
                            
                            foreach($industry as $one){
                            
                                $name=$one->industry_details_company_name;
                                $email=$one->industry_details_company_email;
                                $website=$one->industry_details_company_website;
                                $country=$one->industry_details_company_address_country;
                                $industry_headquarter=$one->industry_details_headquarter;
                                $industry_type=$one->industry_details_industry_type;
                                $id_comp=$one->industry_details_id;
                                $phone=$one->industry_detail_company_phone;
                                $date=$one->created_at;
                                
                                $headquarter="";
                                $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                                $headquarter=$head_name[0]->option_value_e;
                               
                            $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                                
                                fputcsv($fp, array($name,$email,$industry_string,$phone,$headquarter,$date));

                            }
                            
                            $str = file_get_contents('uploads/exports/kaust_industry_export.csv');
                            $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;
                    
    }
    
    public function export_industry_users($userid,$token,$toe,$users_id,$industry_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                     $content="";

                        $industry_users = DB::table('basic_user')
                                            ->join('user_role', 'user_role.user_role_id', '=', 'basic_user.user_id')
                                            ->select('basic_user.*')
                                            ->where("user_role.user_role_role_id","=", "3")
                                            ->whereIn('basic_user.user_id', $users_id)
                                            ->orderBy('basic_user.created_date', 'asc')
                                            ->get();
                                            
                        $industry= DB::table('industry_details')->select('*')->where("industry_details_id","=", $industry_id)->get();
                        $industry_name=$industry[0]->industry_details_company_name;
                        $industry_location=$industry[0]->industry_details_company_address_country;
                        
                        $title="$industry_name Users Export ($industry_location)";
                        
                        $content=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Created Date</th></tr>";

                        foreach($industry_users as $user){
                            
                            $name=$user->user_name;
                            $email=$user->user_email;
                            $username=$user->user_username;
                            $gender=$user->user_gender;
                            $mobile=$user->user_mobile;
                            $office_number=$user->user_office_number;
                            $date=$user->created_date;
                            
                            $content.="<tr>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$username</td>
                                        <td>$gender</td>
                                        <td>$mobile</td>
                                        <td>$office_number</td>
                                        <td>$date</td>
                                      </tr>";
                        }
                    
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/industry_users_export.csv', 'w');
                          
                            fputcsv($fp, array('User Name', 'Email','Username', 'Gender','Mobile','Office Number','Created Date'));
                            
                            foreach($industry_users as $user){
                            
                                $name=$user->user_name;
                                $email=$user->user_email;
                                $username=$user->user_username;
                                $gender=$user->user_gender;
                                $mobile=$user->user_mobile;
                                $office_number=$user->user_office_number;
                                $date=$user->created_date;
                                
                                fputcsv($fp, array($name,$email,$username,$gender,$mobile,$office_number,$date));

                            }
                            
                            $str = file_get_contents('uploads/exports/industry_users_export.csv');
                            $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;
                    
    }
    
    public function export_all_industry_users($userid,$token,$toe,$users_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    $title="";
                    $kaust_users = DB::table('industry_users')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'industry_users.user_id')
                                        ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'industry_users.industry_id')
                                        ->select('basic_user.*','industry_details.industry_details_company_name')
                                        ->where("user_role.user_role_role_id","=", "3")
                                        ->where("basic_user.user_active","=", "1")
                                        ->whereIn('basic_user.user_id', $users_id)
                                        ->orderBy('basic_user.created_date', 'asc')
                                        ->get();
                    
                    $title="Industry Users Export";
                    $content="";
                    $content=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Company Name</th><th>Joined KPP</th></tr>";

                    foreach($kaust_users as $user){
                        $name=$user->user_name;
                        $email=$user->user_email;
                        $username=$user->user_username;
                        $gender=$user->user_gender;
                        $mobile=$user->user_mobile;
                        $office_number=$user->user_office_number;
                        $date= $user->created_date;
                        $company_name= $user->industry_details_company_name;
                        
                        $content.="<tr>
                                    <td>$name</td>
                                    <td>$email</td>
                                    <td>$username</td>
                                    <td>$gender</td>
                                    <td>$mobile</td>
                                    <td>$office_number</td>
                                    <td>$company_name</td>
                                    <td>$date</td>
                                  </tr>";
                    }
                    if($toe=="csv"){
                        $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                        fputcsv($fp, array('User Name', 'Email','Username', 'Gender','Mobile','Office Number','Company Name','Joined KPP'));
                        
                        foreach($kaust_users as $user){
                        
                            $name=$user->user_name;
                            $email=$user->user_email;
                            $username=$user->user_username;
                            $gender=$user->user_gender;
                            $mobile=$user->user_mobile;
                            $office_number=$user->user_office_number;
                            $date=$user->created_date;
                            $company_name=$user->industry_details_company_name;
                            
                            fputcsv($fp, array($name,$email,$username,$gender,$mobile,$office_number,$company_name,$date));
                        
                        }
                        
                        $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                        $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;
                    
    }
    
    public function export_dashboard($userid,$token,$toe){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
       // if(true){
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    //challenges
                    $challenges = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                    ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                    ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                    ->select('challenges.*','job.*','industry_details.*','basic_user.user_name')
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->orderBy('job_status')
                                    ->get();
                                    
                    $count_challenges= count($challenges);
                                    
                    $challenge_pending_review = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING REVIEW")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_pending_info = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING INFO")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_in_progress = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "IN PROGRESS")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_closed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "CLOSED")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $challenge_completed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "COMPLETED")
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $title_challenges="All Challenges";               
                    $content_challenges=" <tr><th>Job ID</th><th>Challenge Name</th><th>Industry Name</th><th>Industry Type</th><th>Assigned to</th><th>Status</th><th>Created Date</th></tr>";

                    foreach($challenges as $challenge){
                        
                        $job_id=$challenge->challenge_id;
                        $challenge_name=$challenge->challenge_name;
                        $industryname=$challenge->industry_details_company_name;
                        $industry_type= $challenge->industry_details_industry_type;
                        $assigned_to=$challenge->user_name;
                        $job_status=$challenge->job_status;
                        $created_date=$challenge->created_date;
                        
                        $industry_string="";
                        $industries = explode(",", $industry_type);
                        foreach($industries as $indu) {
                            $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                            if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                        }$industry_string=substr($industry_string, 0, -2);
                    
                        $content_challenges.="<tr>
                                    <td>$job_id</td>
                                    <td>$challenge_name</td>
                                    <td>$industryname</td>
                                    <td>$industry_string</td>
                                    <td>$assigned_to</td>
                                    <td>$job_status</td>
                                    <td>$created_date</td>
                                  </tr>";   
                    }
                    
                    //internships              
                    $internships = DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                    ->leftjoin('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                    ->leftjoin('basic_user', 'basic_user.user_id', '=', 'assign_job.user_id')
                                    ->select('internship.*','job.*','industry_details.*','basic_user.user_name')
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->orderBy('job_status')
                                    ->get();
                                    
                    $count_internships= count($internships);
                                    
                    $internship_pending_review = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "PENDING REVIEW")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_in_progress = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "IN PROGRESS")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_closed = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "CLOSED")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                    
                    $internship_students_assigned = DB::table('job')
                                    ->select('*')
                                    ->where("job_status","=", "STUDENTS ASSIGNED")
                                    ->where("job_type","=", "internship")
                                    ->where("job_active","=", "1")
                                    ->count();
                                    
                    $title_internships="All Internships";
                    $content_internships=" <tr><th>Job ID</th><th>Internship Name</th><th>Institution/Company Name</th><th>Internship Location</th><th>Assigned to</th><th>Status</th><th>Created Date</th></tr>";

                    foreach($internships as $internship){
                        
                        $job_id=$internship->internship_id;
                        $internship_name=$internship->internship_job_title;
                        $industryname=$internship->internship_institution_name;
                        $industry_locations= $internship->internship_location;
                        $assigned_to=$internship->user_name;
                        $job_status=$internship->job_status;
                        $created_date=$internship->created_date;
                        
                        $content_internships.="<tr>
                                    <td>$job_id</td>
                                    <td>$internship_name</td>
                                    <td>$industryname</td>
                                    <td>$industry_locations</td>
                                    <td>$assigned_to</td>
                                    <td>$job_status</td>
                                    <td>$created_date</td>
                                  </tr>";
                    }
                                    
                    //KAUST users
                    $kaust_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('basic_user.user_name','basic_user.user_email','basic_user.user_username','basic_user.user_gender','basic_user.user_mobile','basic_user.user_office_number','basic_user.user_department','basic_user.created_date')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->get();
                                    
                    $count_kaust_users= count($kaust_users);
                    
                    $active_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 1)
                                    ->count();
                    
                    $inactive_users = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 1)
                                    ->where("basic_user.user_active","=", 3)
                                    ->count();
                    
                    $title_kaust_users="Kaust Users";
                    $content_kaust_users=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Department</th><th>Created Date</th></tr>";

                    foreach($kaust_users as $user){
                        $name=$user->user_name;
                        $email=$user->user_email;
                        $username=$user->user_username;
                        $gender=$user->user_gender;
                        $mobile=$user->user_mobile;
                        $office_number=$user->user_office_number;
                        $department=$user->user_department;
                        $date= $user->created_date;
                        
                        $department_string="";
                        $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                        $department_string=$department_name[0]->option_value_e;
                        
                        $content_kaust_users.="<tr>
                                    <td>$name</td>
                                    <td>$email</td>
                                    <td>$username</td>
                                    <td>$gender</td>
                                    <td>$mobile</td>
                                    <td>$office_number</td>
                                    <td>$department_string</td>
                                    <td>$date</td>
                                  </tr>";
                    }
                    
                    //industry
                    $industry = DB::table('industry_details')
                                            ->select('*')
                                            ->orderBy('created_at', 'asc')
                                            ->get();
                                            
                    $count_industry= count($industry);
                    
                    $active_industrys = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("basic_user.user_active","=", 1)
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->count();
                    
                    $inactive_industrys = DB::table('basic_user')
                                    ->join('user_role','user_role.user_role_userid','=','basic_user.user_id')
                                    ->select('*')
                                    ->where("user_role.user_role_role_id","=", 3)
                                    ->where("basic_user.user_active","=", 3)
                                    ->orwhere("basic_user.user_active","=", 0)
                                    ->count();
                                            
                    $title_industry="Industries Export";
                    $content_industry=" <tr><th>Industry Name</th><th>Email</th><th>Website</th><th>Country</th><th>Headquarter</th><th>Created Date</th></tr>";

                    foreach($industry as $one){
                        
                        $name=$one->industry_details_company_name;
                        $email=$one->industry_details_company_email;
                        $website=$one->industry_details_company_website;
                        $country=$one->industry_details_company_address_country;
                        $headquarter=$one->industry_details_headquarter;
                        $date=$one->created_at;
                        
                        $headquarter_string="";
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $headquarter)->get();
                        $headquarter_string=$head_name[0]->option_value_e;
                        
                        $content_industry.="<tr>
                                    <td>$name</td>
                                    <td>$email</td>
                                    <td>$website</td>
                                    <td>$country</td>
                                    <td>$headquarter_string</td>
                                    <td>$date</td>
                                  </tr>";
                    }
                    
                    //monthly statistics
                    $title_monthly_jobs="Monthly Statistics for Challenges and Internships of the year";
                    $currentMonth = date('m');
                    
                    $monthly_internship=array();
                    for($i=01;$i<=$currentMonth;$i++){ 
                        $interns = DB::table('job')
                                        ->select('job_id')
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", 1)
                                        ->whereMonth('created_date', '=', $i)
                                        ->count();
                        
                        array_push($monthly_internship, $interns);
                    }  
                    
                    $monthly_challenge=array();
                    for($i=01;$i<=$currentMonth;$i++){ 
                        $challs = DB::table('job')
                                        ->select('job_id')
                                        ->where("job_type","=", "challenge")
                                        ->where("job_active","=", 1)
                                        ->whereMonth('created_date', '=', $i)
                                        ->count();
                        
                        array_push($monthly_challenge, $challs);
                    }
                    
                    $content_monthly_jobs="<th>Month</th>";
                    $content_monthly_challenges="<th>Challenges</th>";
                    $content_monthly_internships="<th>Internships</th>";
                    
                    for($i=01;$i<=$currentMonth;$i++){ 
                        switch($i){
                            
                            case 1: $content_monthly_jobs.='<th>January</th>'; $content_monthly_challenges.="<td>$monthly_challenge[0]</td>"; $content_monthly_internships.="<td>$monthly_internship[0]</td>"; break;
                            case 2: $content_monthly_jobs.='<th>February</th>'; $content_monthly_challenges.="<td>$monthly_challenge[1]</td>"; $content_monthly_internships.="<td>$monthly_internship[1]</td>"; break;
                            case 3: $content_monthly_jobs.='<th>March</th>'; $content_monthly_challenges.="<td>$monthly_challenge[2]</td>"; $content_monthly_internships.="<td>$monthly_internship[2]</td>"; break;
                            case 4: $content_monthly_jobs.='<th>April</th>'; $content_monthly_challenges.="<td>$monthly_challenge[3]</td>"; $content_monthly_internships.="<td>$monthly_internship[3]</td>"; break;
                            case 5: $content_monthly_jobs.='<th>May</th>'; $content_monthly_challenges.="<td>$monthly_challenge[4]</td>"; $content_monthly_internships.="<td>$monthly_internship[4]</td>"; break;
                            case 6: $content_monthly_jobs.='<th>June</th>'; $content_monthly_challenges.="<td>$monthly_challenge[5]</td>"; $content_monthly_internships.="<td>$monthly_internship[5]</td>"; break;
                            case 7: $content_monthly_jobs.='<th>July</th>'; $content_monthly_challenges.="<td>$monthly_challenge[6]</td>"; $content_monthly_internships.="<td>$monthly_internship[6]</td>"; break;
                            case 8: $content_monthly_jobs.='<th>August</th>'; $content_monthly_challenges.="<td>$monthly_challenge[7]</td>"; $content_monthly_internships.="<td>$monthly_internship[7]</td>"; break;
                            case 9: $content_monthly_jobs.='<th>September</th>'; $content_monthly_challenges.="<td>$monthly_challenge[8]</td>"; $content_monthly_internships.="<td>$monthly_internship[8]</td>"; break;
                            case 10: $content_monthly_jobs.='<th>October</th>'; $content_monthly_challenges.="<td>$monthly_challenge[9]</td>"; $content_monthly_internships.="<td>$monthly_internship[9]</td>"; break;
                            case 11: $content_monthly_jobs.='<th>November</th>'; $content_monthly_challenges.="<td>$monthly_challenge[10]</td>"; $content_monthly_internships.="<td>$monthly_internship[10]</td>"; break;
                            case 12: $content_monthly_jobs.='<th>December</th>'; $content_monthly_challenges.="<td>$monthly_challenge[11]</td>"; $content_monthly_internships.="<td>$monthly_internship[11]</td>"; break;
                            default: $content_monthly_jobs.='something went wrong';break;
                        }
                    }
                                
                    if($toe=="csv"){
                        
                        $fp = fopen('uploads/exports/dashboard_export.csv', 'w');
                        fputcsv($fp, array('All Challenges'));fputcsv($fp, array());
                        
                        fputcsv($fp, array('Status','Total'));
                        fputcsv($fp, array('Pending Review',$challenge_pending_review));
                        fputcsv($fp, array('Pending Info',$challenge_pending_info));
                        fputcsv($fp, array('In Progress',$challenge_in_progress));
                        fputcsv($fp, array('Closed',$challenge_closed));
                        fputcsv($fp, array('Completed',$challenge_completed));
                        
                        fputcsv($fp, array());
                        
                        fputcsv($fp, array('Job ID','Challenge Name','Industry Name','Industry Type','Assigned to','Status','Created Date'));
                        
                        foreach($challenges as $challenge){
                            $job_id=$challenge->challenge_id;
                            $challenge_name=$challenge->challenge_name;
                            $industryname=$challenge->industry_details_company_name;
                            $industry_type= $challenge->industry_details_industry_type;
                            $assigned_to=$challenge->user_name;
                            $job_status=$challenge->job_status;
                            $created_date=$challenge->created_date;
                            
                            $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                            
                            fputcsv($fp, array($job_id,$challenge_name,$industryname,$industry_string,$assigned_to,$job_status,$created_date));
                        }
                        
                        fputcsv($fp, array());fputcsv($fp, array('All Internships'));fputcsv($fp, array());
                        
                        fputcsv($fp, array('Status','Total'));
                        fputcsv($fp, array('Pending Review',$internship_pending_review));
                        fputcsv($fp, array('In Progress',$internship_in_progress));
                        fputcsv($fp, array('Closed',$internship_closed));
                        fputcsv($fp, array('Students Assigned',$internship_students_assigned));
                        
                        fputcsv($fp, array());
                        
                        fputcsv($fp, array('Job ID','Internship Name','Institution/Company Name','Internship Location','Assigned to','Status','Created Date'));
                        
                        foreach($internships as $internship){
                            $job_id=$internship->internship_id;
                            $internship_name=$internship->internship_job_title;
                            $industryname=$internship->internship_institution_name;
                            $industry_locations= $internship->internship_location;
                            $assigned_to=$internship->user_name;
                            $job_status=$internship->job_status;
                            $created_date=$internship->created_date;
                            
                            fputcsv($fp, array($job_id,$internship_name,$industryname,$industry_locations,$assigned_to,$job_status,$created_date));
                        }
                        
                        fputcsv($fp, array());fputcsv($fp, array('KAUST Users'));fputcsv($fp, array());
                        fputcsv($fp, array('User Name','Email','Username','Gender','Mobile','Office Number','Department','Created Date'));

                        foreach($kaust_users as $user){
                            $name=$user->user_name;
                            $email=$user->user_email;
                            $username=$user->user_username;
                            $gender=$user->user_gender;
                            $mobile=$user->user_mobile;
                            $office_number=$user->user_office_number;
                            $department=$user->user_department;
                            $date= $user->created_date;
                            
                            $department_string="";
                            $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                            $department_string=$department_name[0]->option_value_e;
                            
                            fputcsv($fp, array($name,$email,$username,$gender,$mobile,$office_number,$department_string,$date));
                        } 
                        
                        fputcsv($fp, array());fputcsv($fp, array('Industries Export'));fputcsv($fp, array());
                        fputcsv($fp, array('Industry Name','Email','Website','Country','Headquarter','Created Date'));

                        foreach($industry as $one){
                            $name=$one->industry_details_company_name;
                            $email=$one->industry_details_company_email;
                            $website=$one->industry_details_company_website;
                            $country=$one->industry_details_company_address_country;
                            $headquarter=$one->industry_details_headquarter;
                            $date=$one->created_at;
                            
                            $headquarter_string="";
                            $head_name= DB::table('option_list')->select('*')->where('option_id', $headquarter)->get();
                            $headquarter_string=$head_name[0]->option_value_e;
                            
                            fputcsv($fp, array($name,$email,$website,$country,$headquarter_string,$date));
                        }
                        
                        fputcsv($fp, array());fputcsv($fp, array('Monthly Statistics for Challenges and Internships of the year :'));fputcsv($fp, array());
                        switch($currentMonth){
                            
                            case 1: fputcsv($fp, array('Month','January')); fputcsv($fp, array('Challenges',$monthly_challenge[0])); fputcsv($fp, array('Internships',$monthly_internship[0])); break;
                            case 2: fputcsv($fp, array('Month','January','February')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1])); break;
                            case 3: fputcsv($fp, array('Month','January','February'.'March')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2])); break;
                            case 4: fputcsv($fp, array('Month','January','February','March','April')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3])); break;
                            case 5: fputcsv($fp, array('Month','January','February','March','April','May')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4])); break;
                            case 6: fputcsv($fp, array('Month','January','February','March','April','May','June')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5])); break;
                            case 7: fputcsv($fp, array('Month','January','February','March','April','May','June','July')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5],$monthly_internship[6])); break;
                            case 8: fputcsv($fp, array('Month','January','February','March','April','May','June','July','August')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6],$monthly_challenge[7])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5], $monthly_internship[6],$monthly_internship[7])); break;
                            case 9: fputcsv($fp, array('Month','January','February','March','April','May','June','July','August','September')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6],$monthly_challenge[7],$monthly_challenge[8])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5], $monthly_internship[6],$monthly_internship[7],$monthly_internship[8])); break;
                            case 10: fputcsv($fp, array('Month','January','February','March','April','May','June','July','August','September','October')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6],$monthly_challenge[7],$monthly_challenge[8],$monthly_challenge[9])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5], $monthly_internship[6],$monthly_internship[7],$monthly_internship[8],$monthly_internship[9])); break;
                            case 11: fputcsv($fp, array('Month','January','February','March','April','May','June','July','August','September','October','November')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6],$monthly_challenge[7],$monthly_challenge[8],$monthly_challenge[9],$monthly_challenge[10])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5], $monthly_internship[6],$monthly_internship[7],$monthly_internship[8],$monthly_internship[9],$monthly_internship[10])); break;
                            case 12: fputcsv($fp, array('Month','January','February','March','April','May','June','July','August','September','October','November','December')); fputcsv($fp, array('Challenges',$monthly_challenge[0],$monthly_challenge[1],$monthly_challenge[2],$monthly_challenge[3],$monthly_challenge[4],$monthly_challenge[5],$monthly_challenge[6],$monthly_challenge[7],$monthly_challenge[8],$monthly_challenge[9],$monthly_challenge[10],$monthly_challenge[11])); fputcsv($fp, array('Internships',$monthly_internship[0],$monthly_internship[1],$monthly_internship[2],$monthly_internship[3],$monthly_internship[4],$monthly_internship[5], $monthly_internship[6],$monthly_internship[7],$monthly_internship[8],$monthly_internship[9],$monthly_internship[10],$monthly_internship[11])); break;
                            default: $content_monthly_jobs.='something went wrong';break;
                        }
                    
                                        
                        $str = file_get_contents('uploads/exports/dashboard_export.csv');
                        $file= base64_encode($str);
                        fclose($fp);
                                                
                    }
                    else if($toe=="pdf"){
                    
                        $title="Admin Dashboard Export";
                                    
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                                "ssl"=>array(
                                    "verify_peer"=>false,
                                    "verify_peer_name"=>false,
                                ),
                            );  
                        
                        $data = file_get_contents($path, false, stream_context_create($options));
                            
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
                                    <h2 style="text-align:center;">'.$title.'</h2>
                                </div>
                                <div class="row">
                                    <h2>'.$title_challenges.' : </h2>
                                    <table>
                                        <tr><th>Status</th><th>Total</th></tr>
                                        <tr><th>Pending Review</th><td>'.$challenge_pending_review.'</td></tr>
                                        <tr><th>Pending Info</th><td>'.$challenge_pending_info.'</td></tr>
                                        <tr><th>In Progress</th><td>'.$challenge_in_progress.'</td></tr>
                                        <tr><th>Closed</th><td>'.$challenge_closed.'</td></tr>
                                        <tr><th>Completed</th><td>'.$challenge_completed.'</td></tr>
                                    </table>
                                    <br/>
                                    <table style="width:100%">
                                     '.$content_challenges.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>'.$title_internships.' : </h2>
                                    <table>
                                        <tr><th>Status</th><th>Total</th></tr>
                                        <tr><th>Pending Review</th><td>'.$internship_pending_review.'</td></tr>
                                        <tr><th>In Progress</th><td>'.$internship_in_progress.'</td></tr>
                                        <tr><th>Closed</th><td>'.$internship_closed.'</td></tr>
                                        <tr><th>Students Assigned</th><td>'.$internship_students_assigned.'</td></tr>
                                    </table>
                                    <br/>
                                    <table style="width:100%">
                                     '.$content_internships.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>'.$title_kaust_users.' : </h2>
                                    <p>Total '.$count_kaust_users.' user : '.$active_users.' active, '.$inactive_users.' inactive.</p>
                                    
                                    <table style="width:100%">
                                     '.$content_kaust_users.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>'.$title_industry.' : </h2>
                                    <p>Total '.$count_industry.' industry : '.$active_industrys.' active, '.$inactive_industrys.' inactive.</p>
                                    
                                    <table style="width:100%">
                                     '.$content_industry.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>'.$title_monthly_jobs.' : </h2>
                                    <table style="width:100%">
                                    <tr>
                                     '.$content_monthly_jobs.'
                                    </tr>
                                    <tr>
                                     '.$content_monthly_challenges.'
                                    </tr>
                                    <tr>
                                     '.$content_monthly_internships.'
                                    </tr>
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
                    
                } else{$file="role error";}
            } else{$file="role error";}
        } else{$file="token error";}
        return $file;
    }
    
    public function emails_filtering($email,$pass){
        $res="";
        $mailbox = '{imap.gmail.com:993/imap/ssl}INBOX';
        $username = $email;
        $password = $pass;
        $imapResource = imap_open($mailbox, $username, $password);
        

        if($imapResource === false){
            $res= "not ok";
        }else{
         
            $search = 'SINCE "' . date("j F Y", strtotime("-7 days")) . '"';
            $emails = imap_search($imapResource, 'UNSEEN');
            $res=array();
            
            if(!empty($emails)){
                
             
                $emails_replies=array();
                
                foreach($emails as $email){
                    
                    $overview = imap_fetch_overview($imapResource, $email);
                    $overview_subject = $overview[0]->subject;
                    $message = imap_fetchbody($imapResource, $email, 1 , FT_PEEK);
                   
                    
                    $is_reply = Str::contains(($overview_subject), 'Reply Comment');
                    if($is_reply){
                           $from= $overview[0]->from;
                           $date= $overview[0]->date;
                        
                           $sender_id=DB::table('basic_user')
                            ->select('user_id')
                            ->where('user_email','=',$from)
                            ->get();
                            
                            if(count($sender_id)>0){
                                
                                                  
                   $sender_id=$sender_id[0]->user_id;
                   
                   $job_name= explode(":",($overview_subject));$job_name=$job_name[1];
                   $job_name= explode("-",($job_name));$job_name=$job_name[0];
                   
                   
                   $ids= explode("#",($overview_subject));
                    $ids=$ids[1];
                    $ids= explode(" -",$ids);
                    $reply_to= $ids[1];
                    $job_id=$ids[0];
                    
                    
                    $message_old=DB::table('comments')->select('message')->where('comment_id','=',$reply_to)->get();
                    $message_old=$message_old[0]->message;
                    
                    $thisrow=array($message_old,$message,$reply_to,$sender_id,$from,$job_id,$job_name,$date,$email);
                   
                       array_push($res,$thisrow);
                    
                    
                    
                    
                            } 
                              
            
                   
                    }


                    
              
                }
                
                
            }else{$res= "no emails found";}
        }
        return $res;
    }
    
    public function re_post_comment($adminid,$token,$msg,$jobid,$reply,$user,$date,$email,$username,$password){
        $resp="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
       // echo$email;
       
        
        $mailbox = '{imap.gmail.com:993/imap/ssl}INBOX';
        $imapResource = imap_open($mailbox, $username, $password);
        imap_fetchbody($imapResource, $email, 1 );
        
        
            $resp1 = DB::table('comments')->select('is_private')->where("comment_id","=", $reply)->get();
            $isp=$resp1[0]->is_private;       
            
            
            $job_status= DB::table('job')
                            ->select('job_status')
                            ->where("job_id","=", $jobid)
                            ->get();
                            
            $job_status = $job_status[0]->job_status;
                    
                    
           
            $insert = DB::table('comments')->insertGetId(['user_id' => $user,'message' => $msg,'job_id' => $jobid,'job_status' => $job_status,'reply' => $reply,'is_private' => $isp,'comment_type' => "text",'created_date' => $date,]);
            $resp = DB::table('comments')
                    ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                    ->select('comments.comment_id','comments.reply','comments.message','comments.is_private','basic_user.user_name','comments.created_date','comments.file_name')
                    ->where("comment_id","=", $insert)
                    ->get();
                    
                    
                 if($resp){$resp="success";
                     
                     $notify_users= $this->post_comment_notifications($adminid, $token,$msg,$jobid,$reply,$isp,$insert) ;
                 }   
        }else{$resp="token error";}
        return $resp;
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
    
    public function activate_industry($userid,$token,$industryid){
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                            
                    $update = DB::table('basic_user')->where('user_id','=', $industryid)->update(['user_active' => '1' ]);
                    $res= "done";
                
                }else{$res="role error";}
            }else{$res="role error";}
            
        }else{$res="token error";}
        return $res;
        
    }
    
    public function get_notification_template($id){
        $msg = DB::table('notification_template')
                ->select('*')
                ->where("notification_id","=", $id)
                ->get();
        return $msg;
    }
    
    public function view_timeline($userid,$token,$jobid){
        $timeline="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $status_log = DB::table('job_status_log')
                            ->select('*')
                            ->where('job_id', "=" , $jobid)
                            ->get();
                    
                    $comments= DB::table('comments')
                            ->join('basic_user','basic_user.user_id','=','comments.user_id')
                            ->select('comments.*','basic_user.user_name')
                            ->where('job_id', "=" , $jobid)
                            ->get();
                            
                    $timeline= array($status_log,$comments);
                    
                }else{$timeline="role error";}
            }else{$timeline="role error";}
        }else{$timeline="token error";}
        return $timeline;
    }
    
    public function admin_export_jobs($userid,$token,$jobid,$jobtype,$toe){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    $title="";$content="";
                    if($jobtype=="internship"){
                        
                        $internship = DB::table('job')
                                            ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                            ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                            ->select('job.*','internship.*','basic_user.*','industry_details.*')
                                            ->where('job.job_id', $jobid)
                                            ->where("job.job_active","=", "1")
                                            ->get();
                                            
                        $assigned_to= DB::table('basic_user')
                                    ->join('assign_job', 'assign_job.user_id', '=', 'basic_user.user_id')
                                    ->select('basic_user.user_name')
                                    ->where('assign_job.job_id', $jobid)
                                    ->get();
                        if(count($assigned_to)>0){$assigned_to= $assigned_to[0]->user_name;}
                        else{$assigned_to="Not Assigned";}
                                            
                        $internship_name=$internship[0]->internship_job_title;
                        $internship_length=$internship[0]->internship_length;
                        
                        $internship_outline= $internship[0]->internship_outline;
                        $internship_categorie_students = $internship[0]->internship_categorie_students;
                        $student_major = $internship[0]->student_major;
                        $internship_prior_work_experience = $internship[0]->internship_prior_work_experience;
                        $internship_compensation_salary = $internship[0]->internship_compensation_salary;
                        $internship_required_document = $internship[0]->internship_required_document;
                        $internship_brief_description = $internship[0]->internship_brief_description;
                        $internship_start_date = $internship[0]->internship_start_date;
                        $internship_end_date = $internship[0]->internship_end_date;
                        $institution_name=$internship[0]->internship_institution_name;
                        $internship_locations= $internship[0]->internship_location;
                        $internship_department= $internship[0]->internship_department;
                        $contact_details= $internship[0]->contact_details;
                        $internship_link= $internship[0]->internship_link;
                        
                        $job_status=$internship[0]->job_status;
                        $created_date=$internship[0]->created_date;
                        $name=$internship[0]->user_name;
                        
                        $industryname=$internship[0]->industry_details_company_name;
                        $industry_website=$internship[0]->industry_details_company_website;
                        $industry_email=$internship[0]->industry_details_company_email;
                        $industry_age=$internship[0]->industry_details_company_age;
                        $industry_country=$internship[0]->industry_details_company_address_country;
                        $industry_headquarter=$internship[0]->industry_details_headquarter;
                        $industry_address1=$internship[0]->industry_details_company_address_line1;
                        $industry_address2=$internship[0]->industry_details_company_address_line2;
                        $industry_type=$internship[0]->industry_details_industry_type;
                        $company_type=$internship[0]->industry_details_company_type;
                        $nbr_employee=$internship[0]->industry_details_company_number_employee;
                        $primary_product=$internship[0]->industry_details_company_primary_product;
                        $main_customer=$internship[0]->industry_details_company_main_customer;
                        $created_date= $internship[0]->created_at;
                        
                        
                        $title="$internship_name";
                        $main_string="";$industry_string="";
                            $mains = explode(",", $main_customer);
                            foreach($mains as $main) {
                                $main_name= DB::table('main_customers')->select('*')->where('id_main_customer', $main)->get();
                                if(count($main_name)>0){$main_string.=$main_name[0]->name_customer." - ";}
                            }$main_string=substr($main_string, 0, -2);
                        
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
                        
                        $content='  <tr>
                                        <th>Institution/Company Name</th>
                                        <td>'.$institution_name.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Location</th>
                                        <td>'.$internship_locations.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Department</th>
                                        <td>'.$internship_department.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Length</th>
                                        <td>'.$internship_length.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Outline</th>
                                        <td>'.$internship_outline.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Categorie Students</th>
                                        <td>'.$internship_categorie_students.'</td>
                                    </tr>
                                    <tr>
                                        <th>Student Major</th>
                                        <td>'.$student_major.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Prior Work Experience</th>
                                        <td>'.$internship_prior_work_experience.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Compensation Salary</th>
                                        <td>'.$internship_compensation_salary.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Required Document</th>
                                        <td>'.$internship_required_document.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Brief Description</th>
                                        <td>'.$internship_brief_description.'</td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>'.$internship_start_date.' Till : '.$internship_end_date.'</td>
                                    </tr>
                                    
                                    <tr>
                                        <th>Contact Details</th>
                                        <td>'.$contact_details.'</td>
                                    </tr>
                                    <tr>
                                        <th>Internship Link</th>
                                        <td>'.$internship_link.'</td>
                                    </tr>
                                    <tr>
                                        <th>Job Status</th>
                                        <td>'.$job_status.'</td>
                                    </tr>
                                    <tr>
                                        <th>Requester Name</th>
                                        <td>'.$name.'</td>
                                    </tr>
                                    <tr>
                                        <th>Assigned to</th>
                                        <td>'.$assigned_to.'</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>'.$created_date.'</td>
                                    </tr>';
                                    $fad=$industry_address1.' , '.$industry_address2;
                        $content2='  
                                    <tr>
                                        <th>Company Name</th>
                                        <td>'.$industryname.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Website</th>
                                        <td>'.$industry_website.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Email</th>
                                        <td>'.$industry_email.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Age</th>
                                        <td>'.$industry_age.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Country</th>
                                        <td>'.$industry_country.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Headquarter</th>
                                        <td>'.$headquarter_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Address</th>
                                        <td>'.$industry_address1.' , '.$industry_address2.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Type</th>
                                        <td>'.$industry_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Type</th>
                                        <td>'.$company_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Number of employee</th>
                                        <td>'.$employee_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Primary Product</th>
                                        <td>'.$primary_product.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Main Customer</th>
                                        <td>'.$main_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>'.$created_date.'</td>
                                    </tr>';
                                    
                    }
                    else if($jobtype=="challenge"){
                        
                     $content="";
                        $challenge = DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                    ->select('job.*','challenges.*','basic_user.*','industry_details.*')
                                    ->where('job.job_id', $jobid)
                                    ->where("job.job_active","=", "1")
                                    ->get();
                                    
                        $assigned_to= DB::table('basic_user')
                                    ->join('assign_job', 'assign_job.user_id', '=', 'basic_user.user_id')
                                    ->select('basic_user.user_name')
                                    ->where('assign_job.job_id', $jobid)
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
                        
                            $main_string="";$industry_string="";
                            $mains = explode(",", $main_customer);
                            foreach($mains as $main) {
                                $main_name= DB::table('main_customers')->select('*')->where('id_main_customer', $main)->get();
                                if(count($main_name)>0){$main_string.=$main_name[0]->name_customer." - ";}
                            }$main_string=substr($main_string, 0, -2);
                        
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
                                if(count($comp_name)>0){$company_string=$comp_name[0]->option_value_e." - ";}
                            }$company_string=substr($company_string, 0, -2);
                        
                        $employee_string="";    
                            $employee = explode(",", $nbr_employee);
                            foreach($employee as $employee) {
                                $employee_name= DB::table('option_list')->select('*')->where('option_id', $employee)->where('slug', 'number-employee')->get();
                                if(count($employee_name)>0){$employee_string.=$employee_name[0]->option_value_e." - ";}
                            }$employee_string=substr($employee_string, 0, -2);
                        
                        $content='  
                                    <tr>
                                        <th>Challenge Type</th>
                                        <td>'.$challenge_type.'</td>
                                    </tr>
                                    <tr>
                                        <th>Challenge Description</th>
                                        <td>'.$challenge_description.'</td>
                                    </tr>
                                    <tr>
                                        <th>Challenge Approach</th>
                                        <td>'.$challenge_approach.' '.$challenge_approach_spec.'</td>
                                    </tr>
                                    <tr>
                                        <th>Time</th>
                                        <td>'.$time.'</td>
                                    </tr>
                                    <tr>
                                        <th>Is the company affected?</th>
                                        <td>'.$affected.' '.$affected_spec.'</td>
                                    </tr>
                                    <tr>
                                        <th>Job Status</th>
                                        <td>'.$job_status.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Referral</th>
                                        <td>'.$hear.'</td>
                                    </tr>
                                    <tr>
                                        <th>Requester Name</th>
                                        <td>'.$name.'</td>
                                    </tr>
                                    <tr>
                                        <th>Assigned to</th>
                                        <td>'.$assigned_to.'</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>'.$created_date.'</td>
                                    </tr>';
                                  $fad=$industry_address1.' , '.$industry_address2;
                                   
                        $content2='  
                                   <tr>
                                        <th>Industry Name</th>
                                        <td>'.$industryname.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Website</th>
                                        <td>'.$industry_website.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Email</th>
                                        <td>'.$industry_email.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Age</th>
                                        <td>'.$industry_age.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Country</th>
                                        <td>'.$industry_country.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Headquarter</th>
                                        <td>'.$headquarter_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Address</th>
                                        <td>'.$industry_address1.' , '.$industry_address2.'</td>
                                    </tr>
                                    <tr>
                                        <th>Industry Type</th>
                                        <td>'.$industry_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Type</th>
                                        <td>'.$company_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Number of employee</th>
                                        <td>'.$employee_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Primary Product</th>
                                        <td>'.$primary_product.'</td>
                                    </tr>
                                    <tr>
                                        <th>Company Main Customer</th>
                                        <td>'.$main_string.'</td>
                                    </tr>
                                    <tr>
                                        <th>Created Date</th>
                                        <td>'.$created_date.'</td>
                                    </tr>';
                    
                    }
                    
                    if($toe=="csv"){
                        
                        if($jobtype=="challenge"){
                            $fp = fopen('uploads/exports/challenge_export.csv', 'w');
                            fputcsv($fp, array('Challenge Name', 'Challenge Type','Challenge Description', 'Approach Someone?','Time','Company Affected?','Cost','Challenge Status','Industry Referral','Requester Name', 'Assigned to','Industry Name','Industry Website','Industry Email','Industry Age','Industry Country','Industry Headquarter','Industry Address','Industry Type','Company Type','Number of employee','Company Primary Product','Company Main Customer','Created Date'));
                            fputcsv($fp, array($challenge_name,$challenge_type,$challenge_description,$approach1,$time,$affected1,$cost1,$job_status, $hear,$name,$assigned_to, $industryname,$industry_website,$industry_email,$industry_age,$industry_country,$headquarter_string,$fad,$industry_string,$company_string,$employee_string,$primary_product,$main_string,$created_date));
                                                
                           $str = file_get_contents('uploads/exports/challenge_export.csv');
                           $file= base64_encode($str);

                        }
                        else if($jobtype=="internship"){
                            $fp = fopen('uploads/exports/internship_export.csv', 'w');
                            fputcsv($fp, array('Internship Name', 'Internship Length', 'Internship Outline', 'Internship Categorie Students', 'Student Major', 'Internship Prior Work Experience','Internship Compensation Salary','Internship Required Document','Internship Brief Description','Internship Start Date','Internship End Date','Institution/Company Name','Internship Location','Internship Department','Contact Details','Internship Link','Internship Status', 'Requester Name', 'Assigned to','Industry Name','Industry Website','Industry Email','Industry Age','Industry Country','Industry Headquarter','Industry Address','Industry Type','Company Type','Number of employee','Company Primary Product','Company Main Customer','Created Date'));
                            
                            fputcsv($fp, array($internship_name, $internship_length, $internship_outline, $internship_categorie_students, $student_major, $internship_prior_work_experience, $internship_compensation_salary, $internship_required_document, $internship_brief_description, $internship_start_date, $internship_end_date,$institution_name, $internship_locations, $internship_department, $contact_details, $internship_link,$job_status,$name,$assigned_to, $industryname,$industry_website,$industry_email,$industry_age,$industry_country,$headquarter_string,$fad,$industry_string,$company_string,$employee_string,$primary_product,$main_string,$created_date));
                           $str = file_get_contents('uploads/exports/internship_export.csv');
                           $file= base64_encode($str);
                        }
                        
                        fclose($fp);
                                                
                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    else if($toe=="xlsx"){
                  

                        if($jobtype=="challenge"){
                          
                            $data = [
                                        ['Challenge Name', 'Challenge Type','Challenge Description', 'Approach Someone?','Time','Company Affected?','Cost','Challenge Status','Industry Referral','Requester Name', 'Assigned to','Industry Name','Industry Website','Industry Email','Industry Age','Industry Country','Industry Headquarter','Industry Address','Industry Type','Company Type','Number of employee','Company Primary Product','Company Main Customer','Created Date'],
                                        [$challenge_name,$challenge_type,$challenge_description,$approach1,$time,$affected1,$cost1,$job_status, $hear,$name,$assigned_to, $industryname,$industry_website,$industry_email,$industry_age,$industry_country,$headquarter_string,$fad,$industry_string,$company_string,$employee_string,$primary_product,$main_string,$created_date],
                                        
                                    ];
                            
                            $xlsx = SimpleXLSXGen::fromArray( $data );
                            $xlsx->saveAs('uploads/exports/challenge_export.xlsx');
                            
                            $str = file_get_contents('uploads/exports/challenge_export.xlsx');
                            
                            $file= base64_encode($str);

                        }
                        else if($jobtype=="internship"){
                        
                            $data = [
                                        ['Internship Name', 'Internship Length', 'Internship Outline', 'Internship Categorie Students', 'Student Major', 'Internship Prior Work Experience','Internship Compensation Salary','Internship Required Document','Internship Brief Description','Internship Start Date','Internship End Date','Institution/Company Name','Internship Location','Internship Department','Contact Details','Internship Link','Internship Status', 'Requester Name', 'Assigned to','Industry Name','Industry Website','Industry Email','Industry Age','Industry Country','Industry Headquarter','Industry Address','Industry Type','Company Type','Number of employee','Company Primary Product','Company Main Customer','Created Date'],
                                        [$internship_name, $internship_length, $internship_outline, $internship_categorie_students, $student_major, $internship_prior_work_experience, $internship_compensation_salary, $internship_required_document, $internship_brief_description, $internship_start_date, $internship_end_date, $institution_name,$internship_locations, $internship_department, $contact_details, $internship_link,$job_status,$name,$assigned_to, $industryname,$industry_website,$industry_email,$industry_age,$industry_country,$headquarter_string,$fad,$industry_string,$company_string,$employee_string,$primary_product,$main_string,$created_date],
                                        
                                    ];
                            
                            $xlsx = SimpleXLSXGen::fromArray( $data );
                            $xlsx->saveAs('uploads/exports/internship_export.xlsx');
                            
                            $str = file_get_contents('uploads/exports/internship_export.xlsx');
                            $file= base64_encode($str);
                            
                        }
                                      
                    }
                    else if($toe=="rtf"){
                        
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
                        
                        $file_name="export.rtf";  
                        $dompdf = new DOMPDF();
                        $dompdf->loadHtml($html);
                        $dompdf->render();
                        $output = $dompdf->output();
                        $file= base64_encode($output);

                    }
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;    
    }
    
    public function update_summary_value($userid,$token,$value){
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                            
                    $update = DB::table('settings')
                                    ->where('settings_key','=', 'document_summary')
                                    ->update([
                                        'settings_value' => $value
                                    ]);
                                    
                    $res= "ok";
                
                }else{$res="role error";}
            }else{$res="role error";}
            
        }else{$res="token error";}
        return $res;
    }
    
    public function export_user_log($userid,$token,$kaust_user,$type_of_export){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
         // if(true){  
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $basic_profile= DB::table('basic_user')->select('*')->where('user_id', $kaust_user)->get();
                    
                    $department=$basic_profile[0]->user_department;
                    $department_string="";
                    $department_name= DB::table('option_list')->select('*')->where('option_id', $department)->get();
                    $department_string=$department_name[0]->option_value_e;
                    
                    $content='<tr><th>Full Name</th><td>'.$basic_profile[0]->user_name.'</td></tr>
                              <tr><th>Email</th><td>'.$basic_profile[0]->user_email.'</td></tr>
                              <tr><th>Username</th><td>'.$basic_profile[0]->user_username.'</td></tr>
                              <tr><th>Gender</th><td>'.$basic_profile[0]->user_gender.'</td></tr>
                              <tr><th>Mobile Number</th><td>'.$basic_profile[0]->user_mobile.'</td></tr>
                              <tr><th>Office Number</th><td>'.$basic_profile[0]->user_office_number.'</td></tr>
                              <tr><th>Department</th><td>'.$department_string.'</td></tr>
                              <tr><th>Job Role</th><td>'.$basic_profile[0]->user_role.'</td></tr>
                              <tr><th>Joined KPP Platform</th><td>'.$basic_profile[0]->created_date.'</td></tr>
                            ';
                    
                    $content2='<tr><th>Challenge name</th><td>Challenge Type</td><td>Created Date</td></tr>';
                    $assigned_to_me= DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                    ->select('challenges.*','job.*')
                                    ->where('assign_job.user_id', $kaust_user)
                                    ->get();
                    $challenges_text="";$internships_text="";
                    foreach($assigned_to_me as $challenge){
                      //  dd($challenge);
                            $name=$challenge->challenge_name;
                            $type=$challenge->challenge_type;
                            $created_date=$challenge->created_date;
                            $content2.='<tr><th>'.$name.'</th><td>'.$type.'</td><td>'.$created_date.'</td></tr>';
                            $challenges_text.="$name,";
                        }
                        
                        
                    $content3='<tr><th>Internship name</th><td>Internship Length</td><td>Created Date</td></tr>';
                    $assigned_to_me= DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                    ->join('assign_job', 'assign_job.job_id', '=', 'job.job_id')
                                    ->select('internship.*','job.*')
                                    ->where('assign_job.user_id', $kaust_user)
                                    ->get();
                    
                    foreach($assigned_to_me as $internship){
                            $name=$internship->internship_job_title;
                            $length=$internship->internship_length;
                            $created_date=$internship->created_date;
                            $content3.='<tr><th>'.$name.'</th><td>'.$length.'</td><td>'.$created_date.'</td></tr>';
                            $internships_text.="$name,";
                        }
                    
                    
                    
                    if($type_of_export=="pdf"){
                    
                    date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                                    <h2>Basic User Profile</h2>
                                    <table style="width:100%">
                                     '.$content.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>Assigned Challenges</h2>
                                    <table style="width:100%">
                                     '.$content2.'
                                    </table>
                                </div>
                                <div class="row">
                                    <h2>Assigned Internships</h2>
                                    <table style="width:100%">
                                     '.$content3.'
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

                    }else if($type_of_export=="csv"){
                        
                         $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                            fputcsv($fp, array('Full Name','Email', 'Username','Gender','Mobile Number', 'Office Number', 'Job Role', 'Department', 'Joined KPP Platform ', 'Assigned Challenges', 'Assigned Internship'));
                            fputcsv($fp, array($basic_profile[0]->user_name,$basic_profile[0]->user_email,$basic_profile[0]->user_username,$basic_profile[0]->user_gender,$basic_profile[0]->user_mobile,$basic_profile[0]->user_office_number,$basic_profile[0]->user_role,$department_string,$basic_profile[0]->created_date,$challenges_text,$internships_text));

                        
                            
                           $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                           $file= base64_encode($str);

                    }
                   
                }else{$file="role error";}
            }else{$file="role error";}
            
        }else{$file="token error";}
        return $file;
    }
    
    public function export_requests($userid,$token,$toe,$contact_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    $title="";
                   
                        
                        $contact_forms = DB::table('request_meeting')
                                            ->select('*')
                                            ->whereIn('id_request', $contact_id)
                                            ->get();
                        
                        $title1="Request A Meeting Export";
                        $content="";
                        $content=" <tr><th>Request title</th><th>Full Name</th><th>Email</th><th>Phone Number</th><th>Meeting Time</th><th>Submited Date</th></tr>";

                        foreach($contact_forms as $form){
                            $title=$form->request_title;
                            $name =$form->request_user_name;
                            $email=$form->request_user_email;
                            $phone=$form->request_user_phone;
                            $time =$form->request_meeting_time;
                            $date =$form->created_date;
                            
                            $content.="<tr>
                                        <td>$title</td>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$phone</td>
                                        <td>$time</td>
                                        <td>$date</td>
                                      </tr>";
                        }
                                            
                    
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                            fputcsv($fp, array('Request Title', 'Full Name','Email', 'Phone Number','Meeting Time','Submited Date'));
                            foreach($contact_forms as $form){
                            $title=$form->request_title;
                            $name =$form->request_user_name;
                            $email=$form->request_user_email;
                            $phone=$form->request_user_phone;
                            $time =$form->request_meeting_time;
                            $date =$form->created_date;
                            
                           fputcsv($fp, array($title,$name,$email,$phone,$time,$date));
                        }
                        
                            
                           $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                           $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                                    <h2>'.$title1.'</h2>
                                    <table style="width:100%">
                                     '.$content.'
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;    
    }
    
    public function export_contact($userid,$token,$toe,$contact_id){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        if($check_token_time){
        
         $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                
                if($role==4){
                    
                    $title="";
                   
                        
                        $contact_forms = DB::table('contact_us_form')
                                            ->select('*')
                                            ->whereIn('contact_id', $contact_id)
                                            ->get();
                        
                        $title="Contact Forms Export";
                        $content="";
                        $content=" <tr><th>Full Name</th><th>Email</th><th>Phone Number</th><th>Subject</th><th>Body</th><th>Submited Date</th></tr>";

                        foreach($contact_forms as $form){
                            $name=$form->contact_name;
                            $email=$form->contact_email;
                            $phone=$form->contact_phone;
                            $subject=$form->contact_subject;
                            $body=$form->contact_body;
                            $date=$form->created_date;
                            
                            $content.="<tr>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$phone</td>
                                        <td>$subject</td>
                                        <td>$body</td>
                                        <td>$date</td>
                                      </tr>";
                        }
                                            
                    
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                            fputcsv($fp, array('Full Name','Email', 'Phone Number','Subject','Body','Submited Date'));
                            foreach($contact_forms as $form){
                            $name=$form->contact_name;
                            $email=$form->contact_email;
                            $phone=$form->contact_phone;
                            $subject=$form->contact_subject;
                            $body=$form->contact_body;
                            $date=$form->created_date;
                            
                           fputcsv($fp, array($name,$email,$phone,$subject,$body,$date));
                        }
                        
                            
                           $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                           $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
            
        }else{$file="role error";}
        
        }else{$file="token error";}
        return $file;    
    }
    
    public function export_industry_log($userid,$token,$industry_id,$type_of_export){
        $file="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
         // if(true){  
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                
                    $industry_details= DB::table('industry_details')->select('*')->where('industry_details_id', $industry_id)->get();
                    
                    $main_string="";$industry_string="";
                    $mains = explode(",", $industry_details[0]->industry_details_company_main_customer);
                    foreach($mains as $main) {
                        $main_name= DB::table('main_customers')->select('*')->where('id_main_customer', $main)->get();
                        if(count($main_name)>0){$main_string.=$main_name[0]->name_customer." - ";}
                    }
                    $main_string=substr($main_string, 0, -2);
                    
                    $industries = explode(",", $industry_details[0]->industry_details_industry_type);
                    foreach($industries as $indu) {
                        $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                        if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                    }
                    $industry_string=substr($industry_string, 0, -2);
                    
                    $industry_headquarter=$industry_details[0]->industry_details_headquarter; 
                    $headquarter_string="";
                    $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                    $headquarter_string=$head_name[0]->option_value_e;
                    
                    $company_type=$industry_details[0]->industry_details_company_type;
                    $company_string="";    
                    $companys = explode(",", $company_type);
                    foreach($companys as $comp) {
                        $comp_name= DB::table('option_list')->select('*')->where('option_id', $comp)->where('slug', 'company-type')->get();
                        if(count($comp_name)>0){$company_string.=$comp_name[0]->option_value_e." - ";}
                    }$company_string=substr($company_string, 0, -2);
                    
                    $nbr_employee=$industry_details[0]->industry_details_company_number_employee;
                    $employee_string="";    
                    $employee = explode(",", $nbr_employee);
                    foreach($employee as $employee) {
                        $employee_name= DB::table('option_list')->select('*')->where('option_id', $employee)->where('slug', 'number-employee')->get();
                        if(count($employee_name)>0){$employee_string.=$employee_name[0]->option_value_e." - ";}
                    }$employee_string=substr($employee_string, 0, -2);
                    
                    
                    $industry_details1='<tr><th>Company Name</th><td>'.$industry_details[0]->industry_details_company_name.'</td></tr>
                    <tr><th>Company Website</th><td>'.$industry_details[0]->industry_details_company_website.'</td></tr>
                    <tr><th>Company Email</th><td>'.$industry_details[0]->industry_details_company_email.'</td></tr>
                    <tr><th>Company Phone Number</th><td>'.$industry_details[0]->industry_detail_company_phone.'</td></tr>
                    <tr><th>Company Age</th><td>'.$industry_details[0]->industry_details_company_age.'</td></tr>
                    <tr><th>Country</th><td>'.$industry_details[0]->industry_details_company_address_country.'</td></tr>
                    <tr><th>Headquarter</th><td>'.$headquarter_string.'</td></tr>
                    <tr><th>Company Address</th><td>'.$industry_details[0]->industry_details_company_address_line1.' '.$industry_details[0]->industry_details_company_address_line2.'</td></tr>
                    <tr><th>Industry Type</th><td>'.$industry_string.'</td></tr>
                    <tr><th>Company Type</th><td>'.$company_string.'</td></tr>
                    <tr><th>Number Of Employees</th><td>'.$employee_string.'</td></tr>
                    <tr><th>Primary Product</th><td>'.$industry_details[0]->industry_details_company_primary_product.'</td></tr>
                    <tr><th>Main Customer</th><td>'.$main_string.'</td></tr>
                    ';
                    $users=array();
                    
                    $industry_users= DB::table('industry_users')->select('*')->where('industry_id', $industry_id)->get();
                    foreach($industry_users as $one_user){
                    $user_id=$one_user->user_id;
                    array_push($users, $user_id);
                    }
                    
                    $Industry_users="";
                    $basic_profile= DB::table('basic_user')->select('*')->whereIN('user_id', $users)->get();
                    
                    $Industry_users=" <tr><th>User Name</th><th>Email</th><th>Username</th><th>Gender</th><th>Mobile</th><th>Office Number</th><th>Job Role</th><th>Joined KPP Platform</th></tr>";
                    
                    foreach($basic_profile as $one_profile){
                    
                        $name=$one_profile->user_name;
                        $email=$one_profile->user_email;
                        $username=$one_profile->user_username;
                        $gender=$one_profile->user_gender;
                        $mobile=$one_profile->user_mobile;
                        $office_number=$one_profile->user_office_number;
                        $role=$one_profile->user_role;
                        $date=$one_profile->created_date;
                        
                        $Industry_users.="<tr>
                        <td>$name</td>
                        <td>$email</td>
                        <td>$username</td>
                        <td>$gender</td>
                        <td>$mobile</td>
                        <td>$office_number</td>
                        <td>$role</td>
                        <td>$date</td>
                        </tr>";
                    }
                    
                    $challenges='<tr><th>Challenge name</th><td>Challenge Type</td><td>Submited By</td><td>Created Date</td></tr>';
                    $assigned_to_me_c= DB::table('job')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                    ->select('challenges.*','job.*','basic_user.*')
                                    ->where('job.job_industry_id', $industry_id)
                                    ->get();
                    
                    foreach($assigned_to_me_c as $challenge){
                    
                        $name=$challenge->challenge_name;
                        $type=$challenge->challenge_type;
                        $username=$challenge->user_name;
                        $created_date=$challenge->created_date;
                        $challenges.='<tr><th>'.$name.'</th><td>'.$type.'</td><td>'.$username.'</td><td>'.$created_date.'</td></tr>';
                    }
                    
                    
                    $internships='<tr><th>Internship name</th><td>Internship Length</td><td>Submited By</td><td>Created Date</td></tr>';
                    $assigned_to_me_i= DB::table('job')
                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                    ->select('internship.*','job.*','basic_user.*')
                                    ->where('job.job_industry_id', $industry_id)
                                    ->get();
                                    
                    foreach($assigned_to_me_i as $internship){
                        $name=$internship->internship_job_title;
                        $length=$internship->internship_length;
                        $created_date=$internship->created_date;$username=$challenge->user_name;
                        $internships.='<tr><th>'.$name.'</th><td>'.$length.'</td><td>'.$username.'</td><td>'.$created_date.'</td></tr>';
                    }
                    
                    
                    if($type_of_export=="pdf"){
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                        
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                            "verify_peer"=>false,
                            "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                            <h2>Industry Details</h2>
                            <table style="width:100%">
                             '.$industry_details1.'
                            </table>
                            </div>
                            <div class="row">
                            <h2>Company User</h2>
                            <table style="width:100%">
                             '.$Industry_users.'
                            </table>
                            </div>
                            <div class="row">
                            <h2>Industry Challenges</h2>
                            <table style="width:100%">
                             '.$challenges.'
                            </table>
                            </div>
                            <div class="row">
                            <h2>Industry Internships</h2>
                            <table style="width:100%">
                             '.$internships.'
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
                    elseif($type_of_export=="csv"){
                    
                        $fp = fopen('uploads/exports/kaust_users_export.csv', 'w');
                        fputcsv($fp, array('Company Name','Company Website', 'Company Email','Company Phone Number','Company Age ','Country','Headquarter','Company Address','Industry Type ','Company Type','Number Of Employees','Primary Product','Main Customer '));
                        fputcsv($fp, array($industry_details[0]->industry_details_company_name,$industry_details[0]->industry_details_company_website,$industry_details[0]->industry_details_company_email,$industry_details[0]->industry_detail_company_phone,$industry_details[0]->industry_details_company_age,$industry_details[0]->industry_details_company_address_country,$headquarter_string,$industry_details[0]->industry_details_company_address_line1.' '.$industry_details[0]->industry_details_company_address_line2,$industry_string,$company_string,$employee_string,$industry_details[0]->industry_details_company_primary_product,$main_string));
                        
                        fputcsv($fp, array(''));   fputcsv($fp, array('')); 
                        fputcsv($fp, array('Industry Users')); 
                        fputcsv($fp, array('Full Name','Email', 'Username','Gender ','Mobile Number','Office Number','Job Role','Joined KPP Platform '));
                        
                        foreach($basic_profile as $one_profile){
                            fputcsv($fp, array($one_profile->user_name,$one_profile->user_email,$one_profile->user_username,$one_profile->user_gender,$one_profile->user_mobile,$one_profile->user_office_number,$one_profile->user_role,$one_profile->created_date));
                        }
                        
                        fputcsv($fp, array(''));   fputcsv($fp, array('')); 
                        fputcsv($fp, array('Challenges')); 
                        fputcsv($fp, array('Challenge Name','Challenge Type', 'Submited By','Create Date'));
                        foreach($assigned_to_me_c as $challenge){
                            $name=$challenge->challenge_name;
                            $type=$challenge->challenge_type;
                            $username=$challenge->user_name;
                            $created_date=$challenge->created_date;
                            fputcsv($fp, array($name,$type,$username,$created_date));
                        
                        }
                        
                        fputcsv($fp, array(''));   fputcsv($fp, array('')); 
                        
                        fputcsv($fp, array('Internships')); 
                        fputcsv($fp, array('Internship Name','Internship Length', 'Submited By','Create Date'));
                        foreach($assigned_to_me_i as $internship){
                            $name=$internship->internship_job_title;
                            $length=$internship->internship_length;
                            $created_date=$internship->created_date;$username=$challenge->user_name;
                            fputcsv($fp, array($name,$length,$username,$created_date));
                        }
                        
                        $str = file_get_contents('uploads/exports/kaust_users_export.csv');
                        $file= base64_encode($str);

                    }
                
                }else{$file="role error";}
            }else{$file="role error";}
            
        }else{$file="token error";}
        return $file;
        
    }
    
    public function export_custom_industry($userid,$token,$from_date,$to_date,$industry_type,$company_size,$main_customers,$company_type){
        $file="";
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
          //  if(true){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
           //   if(true){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
              
                   $query="";
                   
                   $industry_by_date = DB::table('industry_details');
                   $industry_by_date->select('industry_details_id');
                   if($from_date!=null){$industry_by_date->where('created_at','>=',$from_date);}
                   if($to_date!=null){$industry_by_date->where('created_at','<=',$to_date);}
                   $result_by_date = $industry_by_date->get();
                
                   $industry_by_itype = DB::table('industry_details');
                   $industry_by_itype->select('industry_details_id');
                   if($industry_type!=null){
                        foreach ($industry_type as $one_industry) {
                            $industry_by_itype->orwhere('industry_details_industry_type','like', "$one_industry,");
                            $industry_by_itype->orwhere('industry_details_industry_type','like', ",$one_industry,");
                        }
                   }
                   $result_by_itype = $industry_by_itype->get();
                   
                   $industry_by_csize = DB::table('industry_details');
                   $industry_by_csize->select('industry_details_id');
                   if($company_size!=null){
                       foreach ($company_size as $one_company) {
                           $industry_by_csize->orwhere('industry_details_company_number_employee','=', $one_company);
                              }
                   }
                   $result_by_csize = $industry_by_csize->get();
                   
                   
                   $industry_by_mainc = DB::table('industry_details');
                   $industry_by_mainc->select('industry_details_id');
                   if($main_customers!=null){
                       foreach ($main_customers as $one_customer) {
                           $industry_by_mainc->orwhere('industry_details_company_main_customer','like', "$one_customer,");
                           $industry_by_mainc->orwhere('industry_details_company_main_customer','like', ",$one_customer,");
                              }
                   }
                   $result_by_mainc = $industry_by_mainc->get();
                   
                   
                   $industry_by_ctype = DB::table('industry_details');
                   $industry_by_ctype->select('industry_details_id');
                   if($company_type!=null){
                       foreach ($company_type as $one_type) {
                           $industry_by_ctype->orwhere('industry_details_company_type','=', "$one_type");
          
                              }
                   }
                   $result_by_ctype = $industry_by_ctype->get();
                   
                   $industries_id=array();  
                   
                  
                  $ibd=array();$ict=array();$ibm=array();$ibc=array();$ibt=array();
                  foreach ($result_by_date as $res) {$id=$res->industry_details_id;array_push($ibd,$id);}
                  foreach ($result_by_ctype as $res) {$id=$res->industry_details_id;array_push($ict,$id);}
                  foreach ($result_by_mainc as $res) {$id=$res->industry_details_id;array_push($ibm,$id);}
                  foreach ($result_by_csize as $res) {$id=$res->industry_details_id;array_push($ibc,$id);}
                  foreach ($result_by_itype as $res) {$id=$res->industry_details_id;array_push($ibt,$id);}
                  $industries_id = array_intersect($ibd,$ict,$ibm,$ibc,$ibt);
            

                   //return $industries_id;
                  
                   $toe="pdf";          
                   if($role==4){
                    
                     $title="Industries Export";
                     $content="";

                        $industry = DB::table('industry_details')
                                            ->select('*')
                                            ->whereIn('industry_details_id', $industries_id)
                                            ->orderBy('created_at', 'asc')
                                            ->get();
                                            
                        $content=" <tr><th>Industry Name</th><th>Email</th><th>Industry Type</th><th>Phone Number</th><th>Headquarter</th></tr>";

                        foreach($industry as $one){
                            $id_comp=$one->industry_details_id;
                            $name=$one->industry_details_company_name;
                            $email=$one->industry_details_company_email;
                            $website=$one->industry_details_company_website;
                            $country=$one->industry_details_company_address_country;
                            $headquarter=$one->industry_details_headquarter;
                            $industry_type=$one->industry_details_industry_type;
                            $phone=$one->industry_detail_company_phone;
                            $date=$one->created_at;
                            
                           
                            $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                            
                            
                            
                            $content.="<tr>
                                        <td>$name</td>
                                        <td>$email</td>
                                        <td>$industry_string</td>
                                        <td>$phone</td>
                                        <td>$headquarter</td>
                                        
                                      </tr>";
                        }
                
                    if($toe=="csv"){
                        
                        
                            $fp = fopen('uploads/exports/kaust_industry_export.csv', 'w');
                          
                            fputcsv($fp, array('Industry Name', 'Email','Industry Type', 'Phone Number','Headquarter','Created Date'));
                            
                            foreach($industry as $one){
                            
                                $name=$one->industry_details_company_name;
                                $email=$one->industry_details_company_email;
                                $website=$one->industry_details_company_website;
                                $country=$one->industry_details_company_address_country;
                                $headquarter=$one->industry_details_headquarter;
                                $industry_type=$one->industry_details_industry_type;
                                $id_comp=$one->industry_details_id;
                                $phone=$one->industry_detail_company_phone;
                                $date=$one->created_at;
                                
                             
                            $industry_string="";
                            $industries = explode(",", $industry_type);
                            foreach($industries as $indu) {
                                $industry_name= DB::table('industry_type')->select('*')->where('id_industry_type', $indu)->get();
                                if(count($industry_name)>0){$industry_string.=$industry_name[0]->name_industry_type." - ";}
                            }$industry_string=substr($industry_string, 0, -2);
                                
                                fputcsv($fp, array($name,$email,$industry_string,$phone,$headquarter,$date));

                            }
                            
                            $str = file_get_contents('uploads/exports/kaust_industry_export.csv');
                            $file= base64_encode($str);

                    }
                    else if($toe=="pdf"){
                        
                        date_default_timezone_set("Asia/Beirut");
                        $today_date = date("Y/m/d");
                    
                        $path = 'https://kaustkpp.live/backc2/cnam_logo.png';
                        $type = pathinfo($path, PATHINFO_EXTENSION);
                        $options=array(
                            "ssl"=>array(
                                "verify_peer"=>false,
                                "verify_peer_name"=>false,
                            ),
                        );  
                        $data = file_get_contents($path, false, stream_context_create($options));
                        
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
                    
                }else{$file="role error";}
                   
                }else{$file="role error";}
            }else{$file="role error";}
            
        }else{$file="token error";}
        return $file;
    }
    
    public function restore_password($adminid,$token,$userid,$email){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
        
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.@#-';
                    $charactersLength = strlen($characters);
                    $new_pass = '';
                    for ($i = 0; $i < 2; $i++) {
                        $new_pass .= $characters[rand(0, 9)];
                        $new_pass .= $characters[rand(10, 35)];
                        $new_pass .= $characters[rand(36, 61)];
                        $new_pass .= $characters[rand(62, 65)];
                    }
        
                    $username= DB::table('basic_user')->select('user_username')->where('user_id', $userid)->where('user_email', $email)->get();
                    $username=$username[0]->user_username;
                    $hashed_pass=md5($new_pass);
                    $update= DB::table('basic_user')->where('user_id', $userid)->where('user_email', $email)->update(['user_password' => $hashed_pass]);
                    
                    $temp= $this->get_notification_template(40);
                    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                    $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                    $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                    
                    $res= "sent";
                    
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
    }
    
    public function change_user_email($adminid,$token,$userid,$email){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
        
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $user = DB::table('basic_user')->select('*')->where('user_email', $email)->get();
                    if(count($user)>0){$res="email already in user";}
                    else{$update= DB::table('basic_user')->where('user_id', $userid)->update(['user_email' => $email]);$res= "success";}

                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
    }
    
    public function reply_to_email($adminid,$token,$subject,$body,$email_to){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
        
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    
                    $temp= $this->get_notification_template(87);
                    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                    $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                    $send_email =  $this->send_email($email_template,$email_to,$email_subject) ;
                    
                    DB::table('contact_industry_emails')->insert([
                                    'admin_id' => $adminid ,
                                    'email_subject' => $subject, 
                                    'email_message' => $body,
                                    'sent_to_id' => null,
                                    'reply_to' => $email_to,
                                    'sent_date' => $date,
                    ]); 
                    
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
    }
    
    public function contact_industry($adminid,$token,$message,$subject,$user){
        $res="";
        $check_token_time= $this->check_user_token_time($adminid, $token) ;
        
        if($check_token_time){
        
            $check_role= $this->return_user_role($adminid);
            if(count($check_role)==1){
                
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    
                    $user_email = DB::table('basic_user')->select('*')->where('user_id', $user)->get();
                    $email=$user_email[0]->user_email;
                    
                    $temp= $this->get_notification_template(88);
                    $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                    $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                    $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                    
                    DB::table('contact_industry_emails')->insert([
                                    'admin_id' => $adminid ,
                                    'email_subject' => $subject, 
                                    'email_message' => $message,
                                    'sent_to_id' => $user,
                                    'reply_to' => null,
                                    'sent_date' => $date,
                    ]); 
                       
                    $res="Success";
                    
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
    }
    
}

?>