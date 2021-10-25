<?php
namespace App\Http\Controllers\INDUSTRY;

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
use PDF;
use Str;
use \GeniusTS\HijriDate\Hijri;

class Functions extends Controller
{
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(){
        
    }
	
	/**
     * Supdate option.
     *
     * @param  int  $id
     * @return Response
     */
     
    public function register_company($headquarter,$headquarter_spec,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$cType_spec,$customer,$employees,$file,$iType,$iType_spec,$link,$product,$social,$userid,$website,$document_name,$company_phone){
        $res="";
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
        $string_customer="";$string_itype="";
       
       foreach ($customer as $value) {$string_customer.=$value.",";}
       foreach ($iType as $value1) {$string_itype.=$value1.",";}


    $if_user_industry_exist = DB::table('industry_users')
                        ->select('*')
                        ->where("user_id","=",$userid)
                        ->get();
    
    if(count($if_user_industry_exist)==0){
    
    
        $id=  DB::table('industry_details')->insertGetId([
    
                'industry_details_company_name' => $cname,
                'industry_details_headquarter' => '0',
                'industry_details_company_website' => $website,
                'industry_details_company_email' => $cemail,
                'industry_details_company_age' => $cage,
                'industry_details_company_address_country' => $caddress,
                'industry_details_company_address_line1' => $address1,
                'industry_details_company_address_line2' => $address2,
                'industry_details_industry_type' => $string_itype,
                'industry_details_industry_type_spec' => $iType_spec,
                'industry_details_company_type' => $cType,
                'industry_details_company_type_spec' => $cType_spec,
                'industry_details_company_number_employee' => $employees,
                'industry_details_company_primary_product' => $product,
                'industry_details_company_main_customer' => $string_customer,
                'industry_detail_company_phone' => $company_phone,
                'created_at' => $date,
                'updated_at' => null,
        ]);
        
        if(count($file)>0){
            for($i=0;$i<count($file);$i++){
                
                
                DB::table('industry_profiles')->insert(['profile_name' => $file[$i]["fileName"],'profile_path' => $file[$i]["file"],'industry_id' => $id,'user_id' => $userid,'active' => '1','created_date' => $date,]); 
            }
        }
        
         $id1= DB::table('industry_users')->insert(['industry_id' => $id,'user_id' => $userid ]);
         
        $user_industry_id = $this->get_industry_id_by_user_id($userid);
        $industry_id=$user_industry_id[0]->industry_id;
        
        if($headquarter==30){
            $headquarter_id=  DB::table('option_list')->insertGetId(['slug' => 'headquarter','option_value_e' => $headquarter_spec,'option_value_a' => $headquarter_spec,'inserted_by' => $userid,'created_date' => $date,]);
            $update= DB::table('industry_details')->where('industry_details_id','=', $industry_id)->update(['industry_details_headquarter' => $headquarter_id]);
        }
        else{
            $update= DB::table('industry_details')->where('industry_details_id','=', $industry_id)->update(['industry_details_headquarter' => $headquarter]);
        }
           
           for($i=0;$i<count($social);$i++){
                $id2= DB::table('industry_social')->insert(['industry_social_company_id' => $id,'industry_social_type' => $social[$i],'industry_social_link' => $link[$i],'created_date' => $date,'updated_date' => null,]); 
               
           }
           
           //send email
           
           $email1 = DB::table('basic_user')
                        ->select('*')
                        ->where("user_id","=",$userid)
                        ->get();
            $email=$email1[0]->user_email;
            $username=$email1[0]->user_username;
            $name=$email1[0]->user_name;
                        
            $temp= $this->get_notification_template(1);
            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
            
            //notification
            $msg=$temp[0]->notification_message;eval("\$msg = \"$msg\";");
            
            $notif_sent = DB::table('notifications')
                        ->select('*')
                        ->where("notification_user_id","=",$userid)
                        ->where("notification_type","=","welcome")
                        ->get();
            
            if(count($notif_sent)==0){
            
                DB::table('notifications')->insert([
                          'notification_user_id' => $userid,
                          'notification_job_id' => NULL ,
                          'notification_msg' => $msg,
                          'notification_date' => $date,
                          'notification_status' => 1,
                          'notification_type' => "welcome",
                          'action_type' => "welcome",
                ]);
            }else{}
 
        if($id){$res="submited";}else{$res="error";}
    } else{$res= "user industry already exist";}
    return $res;
}

    public function post_challenge($userid, $token, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$document,$document_name,$chhear){
        $challenge_id="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
         $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);
         if($check_token_time){
             
           $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
           
                     date_default_timezone_set("Asia/Beirut");
                     $date = date("Y/m/d H:i:s");
            		 $industry_id= $this->get_industry_id_by_user_id($userid) ;
            		 $industry_id=$industry_id[0]->industry_id;
            		 
            		 $id_job=  DB::table('job')->insertGetId([
                            'job_user_id' => $userid,
                            'job_industry_id' => $industry_id,
                            'job_type' =>  'challenge',
                            'job_active' => '1',
                            'job_status' => 'PENDING REVIEW',
                            'created_date' => $date,
                            'updated_date' => null,
                            
                    ]); 
                    
                    $id_status_log=  DB::table('job_status_log')->insertGetId([
                            'job_id' => $id_job,
                            'status' => 'PENDING REVIEW',
                            'date' => $date,
                    ]); 
                    
                    $if_job_id_exist = DB::table('challenges')
                                    ->select('*')
                                    ->where("challenge_job_id","=",$id_job)
                                    ->get();
                
                        if(count($if_job_id_exist)==0){
                    
                            $challenge_id=  DB::table('challenges')->insertGetId([
                            'challenge_job_id' => $id_job, 
                            'challenge_name' => $chname,
                            'challenge_type' =>  $chtype,
                            'challenge_description' => $chdesc,
                            'challenge_approach' => $chapproach,
                            'challenge_approach_spec' => $chspec,
                            'challenge_time' => $chtime,
                            'challenge_comp_affected' => $chaffected,
                            'challenge_comp_affected_spec' => $chaffspec,
                            'challenge_cost' => $chcost,
                            'challenge_cost_spec' => $chcostspec,
                            'challenge_hear' => $chhear,
                            
                            ]); 
                            
                            for($i=0;$i<count($document);$i++){
                                //get here document name$document_name
                               DB::table('challenges_documents')->insertGetId([
                                    'document_path' => $document[$i],
                                    'document_name' => $document_name[$i],
                                    'job_id' => $id_job,
                                    'challenge_id' => $challenge_id,
                                    'user_id' => $userid, 
                                    'industry_id' => $industry_id,
                                    'active' => '1', 
                                    'date' => $date,
                                ]);
                                
                            }
                            
                            
                            //admin_notification
             
                            $industry_name = DB::table('industry_details')
                                        ->join('industry_users', 'industry_users.industry_id', '=', 'industry_details.industry_details_id')
                                        ->select('industry_details_company_name')
                                        ->where("industry_users.user_id","=", $userid)
                                        ->get();
                            
                            $company_name=$industry_name[0]->industry_details_company_name;
                            $admintemp= $this->get_notification_template(17);
                            $msg=$admintemp[0]->notification_message;eval("\$msg = \"$msg\";");
                            
                            DB::table('admin_notifications')->insert([
                                      'admin_notification_user_id' => $userid,
                                      'admin_notification_job_id' => $id_job ,
                                      'admin_notification_msg' => $msg,
                                      'admin_notification_date' => $date,
                                      'admin_notification_status' => 1,
                                      'admin_notification_type' => "challenge",
                                      'action_type' => "challenge_details",
                            ]);
                        
                            //send email user
                            
                            $email= DB::table('basic_user')
                                    ->select('user_email')
                                    ->where("user_id","=", $userid)->where("login_token","=", $token)
                                    ->get();
                            $email= $email[0]->user_email;
                            
                            $link= "http://localhost:3000/";
                            
                            $temp= $this->get_notification_template(29);
                            $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                            $send_email =  $this->send_email($email_template,$email,$email_subject) ;

                            //send email admin
                            
                            $admins= DB::table('basic_user')
                                    ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                    ->select('user_email')
                                    ->where("user_role.user_role_role_id","=", 4)
                                    ->get();
                                    
                            $industry_name= DB::table('industry_details')
                                    ->select('industry_details_company_name')
                                    ->where("industry_details_id","=", $industry_id)
                                    ->get();
                            
                            $link= "http://localhost:3000/";
                            
                            $email_subject = $admintemp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                            $email_template = $admintemp[0]->email_template;eval("\$email_template = \"$email_template\";");
                            
                        foreach($admins as $admin){
                            $email= $admin->user_email;
                            $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                        }
                            
                        
                        }else{$challenge_id= "error 3000";}
                        
                  }else{$challenge_id= "role error";}
          }else{$challenge_id= "role error";}
            
        }else{$challenge_id= "token error";}
        return $challenge_id;
    }
    
    public function post_internship($userid,$token,$i_name,$i_location,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent,$length,$major,$contact,$link){
    
        $internship_id="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
         
         $startdate = date('Y-m-d', strtotime($startdate ));
         $enddate = date('Y-m-d', strtotime($enddate ));
        
      
        $check_token_time= $this->check_user_token_time($userid, $token) ;
   
         if($check_token_time){
             $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){

        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
		$industry_id = $this->get_industry_id_by_user_id($userid) ;
		$industry_id=$industry_id[0]->industry_id;
		 
		$id_job = DB::table('job')->insertGetId([
                'job_user_id' => $userid,
                'job_industry_id' => $industry_id,
                'job_type' =>  'internship',
                'job_active' => '1',
                'job_status' => 'PENDING REVIEW',
                'created_date' => $date,
                'updated_date' => null,
                
        ]);
        
        $id_status_log=  DB::table('job_status_log')->insertGetId([
                            'job_id' => $id_job,
                            'status' => 'PENDING REVIEW',
                            'date' => $date,
                        ]); 
        
        $if_job_id_exist = DB::table('internship')
                        ->select('*')
                        ->where("internship_job_id","=",$id_job)
                        ->get();
    
        if(count($if_job_id_exist)==0){
        
            $internship_id = DB::table('internship')->insertGetId([
                'internship_job_id'                 => $id_job, 
                'internship_institution_name'       => $i_name, 
                'internship_location'               => $i_location, 
                'internship_job_title'              => $jobTitle,
                'internship_outline'                => $positionOutline,
                'internship_categorie_students'     => $categorieStudent,
                'internship_prior_work_experience'  => $experience,
                'internship_compensation_salary'    => $compensationSalary,
                'internship_required_document'      => $listDocuments,
                'internship_brief_description'      => $companydesc,
                'internship_locations'              => $location,
                'internship_start_date'             => $startdate,
                'internship_end_date'               => $enddate,
                'internship_department'             => $department,
                'internship_length'                 => $length,
                'student_major'                     => $major,
                'contact_details'                   => $contact,
                'internship_link'                   => $link,
            ]); 
            
            //admin_notification
            
            $industry_name = DB::table('industry_details')
                            ->join('industry_users', 'industry_users.industry_id', '=', 'industry_details.industry_details_id')
                            ->select('industry_details_company_name')
                            ->where("industry_users.user_id","=", $userid)
                            ->get();
                            
            $company_name=$industry_name[0]->industry_details_company_name ;
            
            //send email user
                            
            $user_email= DB::table('basic_user')
                    ->select('*')
                    ->where("user_id","=", $userid)
                    ->get();
            $email= $user_email[0]->user_email;
           
            $link= "http://localhost:3000/";
            
            $temp30= $this->get_notification_template(30);
            $email_subject30 = $temp30[0]->email_subject;eval("\$email_subject30 = \"$email_subject30\";");
            $email_template30 = $temp30[0]->email_template;eval("\$email_template30 = \"$email_template30\";");
            $send_email30 =  $this->send_email($email_template30,$email,$email_subject30) ;
            
            //send email admin
            
            $admins= DB::table('basic_user')
                    ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                    ->select('user_email')
                    ->where("user_role.user_role_role_id","=", 4)
                    ->get();
                    
            $industry_name= DB::table('industry_details')
                    ->select('industry_details_company_name')
                    ->where("industry_details_id","=", $industry_id)
                    ->get();
                    
                    
            $admintemp18= $this->get_notification_template(18); 
            $msg18=$admintemp18[0]->notification_message;eval("\$msg18 = \"$msg18\";");
            $email_subject18 = $admintemp18[0]->email_subject;eval("\$email_subject18 = \"$email_subject18\";");
            $email_template18 = $admintemp18[0]->email_template;eval("\$email_template18 = \"$email_template18\";");

            foreach($admins as $admin){
                $admin_email= $admin->user_email;
                
                 DB::table('admin_notifications')->insert([
                      'admin_notification_user_id' => $userid,
                      'admin_notification_job_id' => $id_job ,
                      'admin_notification_msg' => $msg18,
                      'admin_notification_date' => $date,
                      'admin_notification_status' => 1,
                      'admin_notification_type' => "internship",
                      'action_type' => "internship_details",
                ]);
                
                
                $send_email =  $this->send_email($email_template18,$admin_email,$email_subject18) ;
            }

        }else{$internship_id= "error1";}
        
        }else{$internship_id= "role error";}
        }else{$internship_id= "role error";}
     }else{$internship_id= "token error";}
     return $internship_id;
    }
    
    public function get_industry_dashboard($userid,$token){
        
        $result="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==3){
                      
                    $user_industry_id = $this->get_industry_id_by_user_id($userid);
                    if(count($user_industry_id)==1){
                         
                        date_default_timezone_set("Asia/Beirut");
                        $date = date("Y-m-d");
                        $industry_id=$user_industry_id[0]->industry_id;
              
                        $internship_search_results = DB::table('job')
                                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                                    ->select('job.job_id','job.job_status','job.created_date','internship.internship_id','internship.internship_job_title','internship.internship_start_date','internship.internship_end_date','internship.internship_location','internship.internship_job_id')
                                                    ->where("job.job_user_id","=", $userid)
                                                    ->where("job_type","=", "internship")
                                                    ->where("job_active","=", "1")
                                                    ->orderBy('created_date', 'desc')
                                                    ->get();
                                        
                        $challenge_search_results = DB::table('job')
                                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                                    ->select('job.job_id','job.job_status','job.created_date','challenges.challenge_id','challenges.challenge_name','challenges.challenge_description')
                                                    ->where("job.job_user_id","=", $userid)
                                                    ->where("job_type","=", "challenge")
                                                    ->where("job_active","=", "1")
                                                    ->get();
                                                    
                  /*    $count_private_comments = DB::table('comments')
                                        ->select('job_id', DB::raw('count(*) as total'))
                                        ->where("is_private","=", "yes")
                                        ->groupBy('job_id')
                                        ->pluck('total','job_id')->all();
                                        */
                        $count_private_comments=array();
                                        
                        $count_public_comments = DB::table('comments')
                                        ->select('job_id', DB::raw('count(*) as total'))
                                        ->where("is_private","=", "no")
                                        ->groupBy('job_id')
                                        ->pluck('total','job_id')->all();
                                        
                                        
                                        
                        $industry_jobs = DB::table('job')
                                        ->select('job.job_id')
                                        ->where("job.job_user_id","=", $userid)
                                        ->where("job.job_status","!=", "CLOSED")
                                        ->where("job.job_status","!=", "COMPLETED")
                                        ->where("job_type","=", "challenge")
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                        $challenges_comments= array();
                        
                        foreach($industry_jobs as $job){
                            $job_id=$job->job_id;
                            $comments= DB::table('comments')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                                    ->select('comments.*','basic_user.user_name')
                                    ->where("job_id","=", $job_id)
                                    ->where("comments.reply","=", "0")
                                    ->where("comments.is_private","=", "no")
                                    ->where("comments.user_id","!=", $userid)
                                    ->get();
                                    
                            array_push($challenges_comments, $comments);
                        }
                        
                        
                        $industry_jobs_internship = DB::table('job')
                                        ->select('job.job_id')
                                        ->where("job.job_user_id","=", $userid)
                                        ->where("job.job_status","!=", "CLOSED")
                                        ->where("job.job_status","!=", "COMPLETED")
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                        $internships_comments= array();
                        
                        foreach($industry_jobs_internship as $job){
                            $job_id=$job->job_id;
                            $comments= DB::table('comments')
                                    ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                                    ->select('comments.*','basic_user.user_name')
                                    ->where("job_id","=", $job_id)
                                    ->where("comments.reply","=", "0")
                                    ->where("comments.is_private","=", "no")
                                    ->where("comments.user_id","!=", $userid)
                                    ->get();
                                    
                            array_push($internships_comments, $comments);
                        }
                        
                        $result=array($internship_search_results,$challenge_search_results,$count_private_comments,$count_public_comments,$challenges_comments,$internships_comments);
                        
                    }else{$result= "error 1";}
             
                  }else{$result= "role error";}
          }else{$result= "role error";}
        }else{$result= "token error";}
        return $result;
    }
    
    public function get_industry_challenge($userid,$token){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_industry_id = $this->get_industry_id_by_user_id($userid);
              
            if(count($user_industry_id)==1){
                $industry_id=$user_industry_id[0]->industry_id;
                $search_results = DB::table('job')
                            ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                            ->select('job.job_id','job.job_status','job.created_date','challenges.challenge_id','challenges.challenge_name','challenges.challenge_description')
                            ->where("job_user_id","=", $userid)
                            ->where("job_industry_id","=", $industry_id)
                            ->where("job_type","=", "challenge")
                            ->where("job_active","=", "1")
                            ->get();
                            
               /* $count_private_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->where("is_private","=", "yes")
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();*/
                                
                                $count_private_comments =array();
                                
                $count_public_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->where("is_private","=", "no")
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
        
                $res=array($search_results,$count_private_comments,$count_public_comments);

            }else{$res="error";}
                  }else{$res="role error";}
          }else{$res="role error";}
        }else{$res="token error";}
        return $res;
    }
    
    public function get_industry_internship($userid,$token){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            
            $user_industry_id = $this->get_industry_id_by_user_id($userid);
              
            if(count($user_industry_id)==1){
                $industry_id=$user_industry_id[0]->industry_id;
                $search_results = DB::table('job')
                                ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                ->select('job.job_id','job.job_status','job.created_date','internship.internship_id','internship.internship_job_title','internship.internship_start_date','internship.internship_end_date','internship.internship_location','internship.internship_job_id')
                                ->where("job_user_id","=", $userid)
                                ->where("job_industry_id","=", $industry_id)
                                ->where("job_type","=", "internship")
                                ->where("job_active","=", "1")
                                ->get();
                
                /*$count_private_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->where("is_private","=", "yes")
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();*/
                          $count_private_comments =array();      
                                
                $count_public_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->where("is_private","=", "no")
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
                                
                $res=array($search_results,$count_private_comments,$count_public_comments);

            }else{$res="error";}
                  }else{$res="role error";}
          }else{$res="role error";}
        }else{$res="token error";}
            return $res;
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
     
    public function get_industry_id_by_user_id($id){
         $search_results = DB::table('industry_users')
                            ->select("industry_id")
                            ->where("user_id","=", $id)
                            ->get();
		 return $search_results;
     }
     
    public function get_company_detail($userid,$token){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$res="role error";}
         $check_token_time= $this->check_user_token_time($userid, $token) ;
         
         if($check_token_time){
             $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
             $token=md5($token);
             $search_results = DB::table('basic_user')
                            ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                            ->join('roles', 'roles.role_id', '=', 'user_role.user_role_role_id')
                            ->join('industry_users', 'industry_users.user_id', '=', 'basic_user.user_id')
                            ->join('industry_details', 'industry_details.industry_details_id', '=', 'industry_users.industry_id')
                            ->select('industry_details.*')
                            ->where("basic_user.user_id","=", $userid)->where("login_token","=", $token)
                            ->get();
                         
            $generate_token="";
            $search_results = $search_results->map(function($user) use ($generate_token) {
            
            $id_head=$user->industry_details_headquarter;
            $id_number=$user->industry_details_company_number_employee;
            $id_companyt=$user->industry_details_company_type;
            
            
            $industry_name= DB::table('option_list')->select('*')->where('option_id', $id_head)->get();
                                if(count($industry_name)>0){
                                    $head_string_e=$industry_name[0]->option_value_e;
                                    $head_string_a=$industry_name[0]->option_value_a;
                                 }
            $industry_name= DB::table('option_list')->select('*')->where('option_id', $id_number)->get();
                                if(count($industry_name)>0){
                                    $size_string_e=$industry_name[0]->option_value_e;
                                    $size_string_a=$industry_name[0]->option_value_a;
                                 }
            $industry_name= DB::table('option_list')->select('*')->where('option_id', $id_companyt)->get();
                                if(count($industry_name)>0){
                                    $companyt_string_e=$industry_name[0]->option_value_e;
                                    $companyt_string_a=$industry_name[0]->option_value_a;
                                 }
                        
            $user->heaquarter_english = $head_string_e;
            $user->heaquarter_arabic = $head_string_a;
            $user->size_english = $size_string_e;
            $user->size_arabic = $size_string_a;
            $user->type_english = $companyt_string_e;
            $user->type_arabic = $companyt_string_a;
        
            return $user;
             
         });
            
            $industry_id= $this->get_industry_id_by_user_id($userid);
            $industry_id=$industry_id[0]->industry_id;
            
            $profiles = DB::table('industry_profiles')
                            ->join('basic_user', 'basic_user.user_id', '=', 'industry_profiles.user_id')
                            ->select('industry_profiles.*','basic_user.user_name')
                            ->where("industry_profiles.industry_id","=", $industry_id)
                            ->get();
                            
            $industry_id= $search_results[0]->industry_details_id;
        
            $social_links= DB::table('industry_social')
                        ->select('industry_social_link','industry_social_type')
                        ->where("industry_social_company_id","=",$industry_id)
                        ->get();
      

        $res= array($search_results,$social_links,$profiles);
        
                  }else{$res="role error";}
          }else{$res="role error";}
         }else{$res="token error";}
        return $res;
    }
    
    public function update_company($userid,$token,$headquarter,$headquarter_spec,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$cType_spec,$customer,$employees,$file,$document_name,$iType,$iType_spec,$link,$product,$social,$website,$company_phone){
      
      $res="";
      $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$res="role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
         if($check_token_time){
        $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
          
             date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
         $string_customer="";$string_itype="";
         
       
       foreach ($customer as $value) {
            $string_customer.=$value.",";
        }

foreach ($iType as $value1) {
  $string_itype.=$value1.",";
}
$user_industry_id = $this->get_industry_id_by_user_id($userid);
              $industry_id=$user_industry_id[0]->industry_id;
              
              
              
               $update = DB::table('industry_details')->where('industry_details_id','=', $industry_id)->update(['industry_details_company_name' => $cname , 
                  'industry_details_company_website' => $website,
                  'industry_details_company_email' => $cemail,
                  'industry_details_company_age' => $cage,
                  'industry_details_company_address_country' => $caddress,
                  'industry_details_company_address_line1' => $address1,
                  'industry_details_company_address_line2' => $address2,
                  'industry_details_industry_type' => $string_itype,
                  'industry_details_industry_type_spec' => $iType_spec,
                  'industry_details_company_type' => $cType,
                  'industry_details_company_type_spec' => $cType_spec,
                  'industry_details_company_number_employee' => $employees,
                  'industry_details_company_primary_product' => $product,
                  'industry_details_company_main_customer' => $string_customer,
                  'industry_detail_company_phone' => $company_phone,
                  'updated_at' => $date]);
                  
        if($headquarter==30){
            $headquarter_id=  DB::table('option_list')->insertGetId(['slug' => 'headquarter','option_value_e' => $headquarter_spec,'option_value_a' => $headquarter_spec,'inserted_by' => $userid,'created_date' => $date,]);
            $update= DB::table('industry_details')->where('industry_details_id','=', $industry_id)->update(['industry_details_headquarter' => $headquarter_id]);
        }
        else{
            $update= DB::table('industry_details')->where('industry_details_id','=', $industry_id)->update(['industry_details_headquarter' => $headquarter]);
        }
                 
        
        DB::table('industry_social')->where('industry_social_company_id', '=', $industry_id)->delete();

        for($i=0;$i<count($social);$i++){

            $id2= DB::table('industry_social')->insert(['industry_social_company_id' => $industry_id,'industry_social_type' => $social[$i],'industry_social_link' => $link[$i],'created_date' => $date,'updated_date' => null,]); 
               
        }
         
        DB::table('industry_profiles')->where('industry_id', '=', $industry_id)->delete();
        
        for($i=0;$i<count($file);$i++){

            DB::table('industry_profiles')->insert(['profile_name' => $document_name[$i],'profile_path' => $file[$i],'industry_id' => $industry_id,'user_id' => $userid,'active' => '1','created_date' => $date,]); 
               
        }
           
        $email = DB::table('basic_user')->select('user_email')->where("user_id","=", $userid)->get(); 
        $email=$email[0]->user_email;
        
        $temp= $this->get_notification_template(23);
        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
 
        if($userid){$res="submited";}else{$res="error";}
           
                  }else{$res="role error";}
          }else{$res="role error";}
         }else{$res="token error";}
        return $res;
    }
    
    public function edit_challenge($userid, $token, $jobid, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$chhear){
      /*  $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_industry_id = $this->get_industry_id_by_user_id($userid);
            
            if(count($user_industry_id)==1){
                
                $check_user_of_job= $this->check_user_of_job($userid,$jobid);
                
                if($check_user_of_job){
                    $industry_id=$user_industry_id[0]->industry_id;
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
		 
		            DB::table('job')->where("job_user_id","=", $userid)
                                ->where("job_industry_id","=", $industry_id)
                                ->where('job_id','=', $jobid)
                                ->where("job_active","=", "1")
		                        ->update([
                                'updated_date' => $date,
                    ]); 
        
                    $update= DB::table('challenges')->where('challenge_job_id','=', $jobid)
                                                ->update([
                                                'challenge_name' => $chname,
                                                'challenge_type' =>  $chtype,
                                                'challenge_description' => $chdesc,
                                                'challenge_approach' => $chapproach,
                                                'challenge_approach_spec' => $chspec,
                                                'challenge_time' => $chtime,
                                                'challenge_comp_affected' => $chaffected,
                                                'challenge_comp_affected_spec' => $chaffspec,
                                                'challenge_cost' => $chcost,
                                                'challenge_cost_spec' => $chcostspec,
                                                'challenge_hear' => $chhear,
                    ]); 
        
                    return $update;
                } else{echo (" check user of job");}
            }
                  }else{return"role error";}
          }else{return"role error";}
         } else{return"token error";}
         */
    }
    
    public function edit_internship($userid,$token,$jobid,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent){
       /* $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_industry_id = $this->get_industry_id_by_user_id($userid);
            
            if(count($user_industry_id)==1){
               
                $check_user_of_job= $this->check_user_of_job($userid,$jobid);
                
                if($check_user_of_job){
                    
                    $industry_id=$user_industry_id[0]->industry_id;
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
		 
		            DB::table('job')->where("job_user_id","=", $userid)
                                ->where("job_industry_id","=", $industry_id)
                                ->where('job_id','=', $jobid)
                                ->where("job_active","=", "1")
		                        ->update([
                                'updated_date' => $date,
                    ]); 
        
                    $update= DB::table('internship')->where('internship_job_id','=', $jobid)
                                                ->update([
                                                    'internship_job_title'              => $jobTitle,
                                                    'internship_outline'                => $positionOutline,
                                                    'internship_categorie_students'     => $categorieStudent,
                                                    'internship_prior_work_experience'  => $experience,
                                                    'internship_compensation_salary'    => $compensationSalary,
                                                    'internship_required_document'      => $listDocuments,
                                                    'internship_brief_description'      => $companydesc,
                                                    'internship_locations'              => $location,
                                                    'internship_start_date'             => $startdate,
                                                    'internship_end_date'               => $enddate,
                                                    'internship_department'             => $department,
                    ]); 
        
                    return $update;
                } else{echo (" check user of job");}
            }
                  }else{return"role error";}
          }else{return"role error";}
         } else{return"token error";}
         */
    }
    
    public function check_self_signed_nda($userid,$token){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
                      
            $industry_id= $this->get_industry_id_by_user_id($userid) ;
	    	$industry_id=$industry_id[0]->industry_id;
	    	
	    	 $yes = DB::table('signed_nda')->select('*')->where("industry_id","=", $industry_id)->where("is_signed","=","yes")->get();
	    	 $no = DB::table('signed_nda')->select('*')->where("industry_id","=", $industry_id)->where("is_signed","=","no")->get();
	    	 
	    	 if(count($yes)>0){$res="yes";}
	    	 if(count($yes)==0 && count($no)==0){$res="no";}
	    	 if(count($yes)==0 && count($no)>0){$res="pending";}
              
                  }else{$res="role error";}
          }else{$res="role error";}
            
        }else{$res="token error";}
        return $res;
    }
    
    public function agree_guidline($userid,$token,$tick,$nda_path,$file_name){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$res="role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==3){
                    $industry_id= $this->get_industry_id_by_user_id($userid) ;
                    $industry_id=$industry_id[0]->industry_id;
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    
                    if($tick==1){
                        
                        DB::table('agree_guidline')->insert([
                        'user_id' => $userid,'industry_id' => $industry_id,'created_date' => $date,
                        ]);
                        
                        
                    }
                    if($nda_path!=null){
                        
                        
                        DB::table('signed_nda')->insert([
                        'user_id' => $userid,'industry_id' => $industry_id,'signed_file' => $nda_path,'file_name'=>$file_name["path"],'is_signed'=>'yes','created_date' => $date,
                        ]);
                        
                        $token= md5($token);
                        $email= DB::table('basic_user')
                                ->select('user_email')
                                ->where("user_id","=", $userid)->where("login_token","=", $token)
                                ->get();
                        
                        $email= $email[0]->user_email;
                        
                        $temp= $this->get_notification_template(31);
                        $email_subject = $temp[0]->email_subject;eval("\$email_subject = \"$email_subject\";");
                        $email_template = $temp[0]->email_template;eval("\$email_template = \"$email_template\";");
                        $send_email =  $this->send_email($email_template,$email,$email_subject) ;
                        
                    }
                    
                    $res="proceed";
                    
                }else{$res="role error";}
            }else{$res="role error";}
            
        }
        else{$res="token error";}
        return $res;
    }
    
    public function get_agree_guidline($userid,$token){
      $result="";
      $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$result="role error";}  
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $industry_id= $this->get_industry_id_by_user_id($userid) ;
	    	$industry_id=$industry_id[0]->industry_id;
	    	
	    	
	    	 $result = DB::table('agree_guidline')
                      ->select('*')
                      ->where("user_id","=", $userid)
                      ->where("industry_id","=", $industry_id)
                      ->get();
            
                  }else{$result="role error";}
          }else{$result="role error";}
        }else{$result="token error";}
        return $result; 
    }
    
    public function fill_data(){
            $main_customers = DB::table('main_customers')
                            ->select("*")
                            ->get();
		
		    $industry_type = DB::table('industry_type')
                            ->select("*")
                            ->get();
                            
            $number_employee = DB::table('option_list')
                            ->select("*")
                            ->where("slug","number-employee")
                            ->get();
            
            $company_type = DB::table('option_list')
                            ->select("*")
                            ->where("slug","company-type")
                            ->get();
                            
            $headquarter = DB::table('option_list')
                            ->select("*")
                            ->where("slug","headquarter")
                            ->get();
                            
            $department= DB::table('option_list')
                            ->select("*")
                            ->where("slug","departments")
                            ->get();
                            
            $data= array($main_customers,$industry_type,$number_employee,$company_type,$headquarter,$department);
            return $data;
        }
        
    public function generate_nda_pdf($userid,$token,$nda_date,$cname,$chead,$job_title,$country,$a1,$a2,$email,$company_owner,$nda_date_ar,$cname_ar,$chead_ar,$job_title_ar,$country_ar,$a1_ar,$a2_ar,$email_ar,$company_owner_ar){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$res="role error";}
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
        //$nda_date=date("Y/m/d", strtotime($nda_date) );
      //  $hijri_date = \GeniusTS\HijriDate\Hijri::convertToHijri($nda_date_ar);
        
      $check_token_time= $this->check_user_token_time($userid, $token);
      if($check_token_time){
          $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
                      
          /*            $country=$country.' '.$a1.' '.$a2;

                        $phpword = new \PhpOffice\PhpWord\TemplateProcessor('ndaxx.docx');
                        
                        $phpword->setValue('${dateen}',$nda_date);
                        $phpword->setValue('{datear}',$hijri_date);
                        $phpword->setValue('{collaben}',$cname);
                        $phpword->setValue('{collabar}',$cname_ar);
                        $phpword->setValue('{locationen}',$chead);
                        $phpword->setValue('{locationar}',$chead_ar);
                        $phpword->setValue('{nameen}',$company_owner);
                        $phpword->setValue('{titleen}',$job_title);
                        $phpword->setValue('{titlear}',$job_title_ar);
                        $phpword->setValue('{addressen}',$country);
                        $phpword->setValue('${namear}',$company_owner_ar);
                        $phpword->setValue('{emailen}',$email);
                        
                        $phpword->saveAs('edited1.docx');
                        
                        $convert = file_get_contents('edited1.docx');
		                $convert = base64_encode($convert);
                     */ 
        
        $user_industry_id = $this->get_industry_id_by_user_id($userid);
        $industry_id=$user_industry_id[0]->industry_id;
        //$file="https://kaustkpp.live/backend/uploads/nda/$file_name";
        DB::table('signed_nda')->insert([
                      'user_id' => $userid,'industry_id' => $industry_id,'signed_file' =>'','is_signed'=>'no','created_date' => $date,
        ]);
        
        $res= "ok";
        
                  }else{$res="role error";}
          }else{$res="role error";}
          
      }else{$res="token error";}
      
        return $res;
    }
    
    public function check_user_of_job($userid,$jobid){
        $res="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){$res="role error";}
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
		}
		return $res;
    }
    
    public function generate_job_pdf($userid,$token,$job){
        $file="";
        	date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
        
        
      $check_token_time= $this->check_user_token_time($userid, $token);
       if($check_token_time){
                $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0 && $role==3){$file="role error";}
           
               
                 if($role==3 || $role==4 || $role==1){
                      
                $check_type = DB::table('job')
                                ->select('job_type')
                                ->where("job_id","=", $job)
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
                                    ->where('job.job_id', $job)
                                    ->where("job.job_active","=", "1")
                                    ->get();
                                    
                        $assigned_to= DB::table('basic_user')
                                    ->join('assign_job', 'assign_job.user_id', '=', 'basic_user.user_id')
                                    ->select('basic_user.user_name')
                                    ->where('assign_job.job_id', $job)
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
                        
                        $head_name= DB::table('option_list')->select('*')->where('option_id', $industry_headquarter)->get();
                        $industry_headquarter=$head_name[0]->option_value_e;
                        
                        $companytype_name= DB::table('option_list')->select('*')->where('option_id', $company_type)->get();
                        $company_type=$companytype_name[0]->option_value_e;
                        
                        $employee_name= DB::table('option_list')->select('*')->where('option_id', $nbr_employee)->get();
                        $nbr_employee=$employee_name[0]->option_value_e;
                        
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
                                        <th>Uploader</th>
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
                                        <td>'.$industry_headquarter.'</td>
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
                                        <td>'.$company_type.'</td>
                                    </tr>
                                    <tr>
                                        <th>Number of employee</th>
                                        <td>'.$nbr_employee.'</td>
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
                    else if($type=='internship'){
                        
                        $search_results = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('job.*','internship.*','industry_details.*')
                                        ->where("job_id","=", $job)
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
                             
                              $institution_name = $search_results[0]->internship_institution_name;
                              $company_location = $search_results[0]->industry_details_company_address_country;
                             
                             
                             
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
            <div class="h5" >Name Of Institution/Company: '.$institution_name.'</div>
            <div class="h5" >Location:'.$company_location.' </div>
        </div>

        <div class="mt-1" >
            <div class="h5">Internship Length:'.$lenght.'</div>
        </div>

        <div class="mt-1 d-flex">
            <div class="h5">Job Title:'.$title.' </div>
            <div class="h5">Department:'.$department.'</div>
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
       
       
       
       
        $file_name="$userid-$token.pdf";  
        $dompdf = new DOMPDF();
        $dompdf->set_paper('a4','landscape');
        $dompdf->loadHtml($html);
        $dompdf->render();
        $output = $dompdf->output();
        $file= base64_encode($output);
     //   file_put_contents('uploads/job_export/'.$file_name , $output);
        
       // $user_industry_id = $this->get_industry_id_by_user_id($userid);
        //$industry_id=$user_industry_id[0]->industry_id;
        
     //   $file="https://kaustkpp.live/backend/uploads/job_export/$file_name";
       
       
        
        
        
       // return"https://kaustkpp.live/backend/uploads/job_export/$file_name";
        
        
                             
                                            
                                       }else{


                                 $file="error";
                                       }
                            
                    
                    }else{$file="not internship";}
                }else{$file="no type";} 
                
                  }else{$file="role error";}
        
        
          }else{$file="role error";}
            }else{$file="token error";} 
          
        return $file;
    }
    
    public function return_user_role($user_id){
         
         $search_results = DB::table('user_role')
                            ->select("user_role_role_id")
                            ->where("user_role_userid","=", $user_id)->where("active","=", 1)->get();
		 return $search_results;
         
     }
   
    public function send_email($template,$email1,$subj){
        $res="";
            try {
       $data=array("temp"=>$template);
            Mail::send('email_template.email_template', $data, function($message) use ($email1,$subj){
              $message->to($email1, 'CNAM PORTAL')->subject($subj);
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
    
    public function get_comments_my_jobs($userid,$token){
        $results="";
        $industry_id= $this->get_industry_id_by_user_id($userid) ;if(count($industry_id)==0){return"role error";}
        $check_token_time= $this->check_user_token_time($userid, $token) ;
       
         if($check_token_time){
             
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
                    
                    $results = DB::table('comments')
                            ->join('job', 'job.job_id', '=', 'comments.job_id')
                            ->select('job.*','comments.*')
                            ->where("job.job_user_id","=", $userid)
                            ->where("job.job_active","=", "1")
                            ->get();
                    
                  }else{$results="not industry user";}
            }else{$results="role error";}
         }
          return $results;  
    }
    
    public function get_notification_template($id){
        $msg = DB::table('notification_template')
                ->select('*')
                ->where("notification_id","=", $id)
                ->get();
        return $msg;
    }
    
    public function check_company_status($userid,$token){
        
        $res="";
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            
            $industry_id= $this->get_industry_id_by_user_id($userid) ;
            if(count($industry_id)==0){$res="register";}
            else{$res="proceed";}
            
                  }else{$res="role error";}
          }else{$res="role error";}
            
        }else{$res="token error";}
        return $res;
    }
    
    public function test_word($request){
        /*
         $mysqlHostName      = env('DB_HOST');
        $mysqlUserName      = env('DB_USERNAME');
        $mysqlPassword      = env('DB_PASSWORD');
        $DbName             = env('DB_DATABASE');
        $backup_name        = "mybackup.sql";
        $tables             = array("users","messages","posts"); //here your tables...

        $connect = new \PDO("mysql:host=$mysqlHostName;dbname=$DbName;charset=utf8", "$mysqlUserName", "$mysqlPassword",array(\PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
        $get_all_table_query = "SHOW TABLES";
        $statement = $connect->prepare($get_all_table_query);
        $statement->execute();
        $result = $statement->fetchAll();


        $output = '';
        foreach($tables as $table)
        {
         $show_table_query = "SHOW CREATE TABLE " . $table . "";
         $statement = $connect->prepare($show_table_query);
         $statement->execute();
         $show_table_result = $statement->fetchAll();

         foreach($show_table_result as $show_table_row)
         {
          $output .= "\n\n" . $show_table_row["Create Table"] . ";\n\n";
         }
         $select_query = "SELECT * FROM " . $table . "";
         $statement = $connect->prepare($select_query);
         $statement->execute();
         $total_row = $statement->rowCount();

         for($count=0; $count<$total_row; $count++)
         {
          $single_result = $statement->fetch(\PDO::FETCH_ASSOC);
          $table_column_array = array_keys($single_result);
          $table_value_array = array_values($single_result);
          $output .= "\nINSERT INTO $table (";
          $output .= "" . implode(", ", $table_column_array) . ") VALUES (";
          $output .= "'" . implode("','", $table_value_array) . "');\n";
         }
        }
        $file_name = 'database_backup_on_' . date('y-m-d') . '.sql';
        $file_handle = fopen($file_name, 'w+');
        fwrite($file_handle, $output);
        fclose($file_handle);
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . basename($file_name));
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
           header('Pragma: public');
           header('Content-Length: ' . filesize($file_name));
          // ob_clean();
           flush();
           readfile($file_name);
           unlink($file_name);
           
           */
          
  
      
    }

}