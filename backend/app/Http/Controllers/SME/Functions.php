<?php
namespace App\Http\Controllers\SME;

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

    public function register_company($headquarter,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$userid,$website){
        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");
        $string_customer="";$string_itype="";

       foreach ($customer as $value) {$string_customer.=$value.",";}
       foreach ($iType as $value1) {$string_itype.=$value1.",";}


    $if_user_sme_exist = DB::table('sme_users')
                        ->select('*')
                        ->where("user_id","=",$userid)
                        ->get();

    if(count($if_user_sme_exist)==0){


        $id=  DB::table('sme_details')->insertGetId([

                'sme_details_company_name' => $cname,
                'sme_details_company_website' => $website,
                'sme_details_company_email' => $cemail,
                'sme_details_company_age' => $cage,
                'sme_details_company_address_country' => $caddress,
                'sme_details_headquarter' => $headquarter,
                'sme_details_company_address_line1' => $address1,
                'sme_details_company_address_line2' => $address2,
                'sme_details_industry_type' => $string_itype,
                'sme_details_company_type' => $cType,
                'sme_details_company_number_employee' => $employees,
                'sme_details_company_primary_product' => $product,
                'sme_details_company_main_customer' => $string_customer,
                       'sme_details_company_profile' => $file,
                'created_at' => $date,
                'updated_at' => null,
        ]);

         $id1= DB::table('sme_users')->insert(['sme_id' => $id,'user_id' => $userid ]);



           for($i=0;$i<count($social);$i++){
                $id2= DB::table('sme_social')->insert(['sme_social_company_id' => $id,'sme_social_type' => $social[$i],'sme_social_link' => $link[$i],'created_date' => $date,'updated_date' => null,]);

           }

        if($id){return"submited";}else{return"error";}
    } else{return "user sme already exist";}
}

    public function post_challenge($userid, $token, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$document,$chhear){
         $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);
         if($check_token_time){

           $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){

                     date_default_timezone_set("Asia/Beirut");
                     $date = date("Y/m/d H:i:s");
            		 $sme_id= $this->get_sme_id_by_user_id($userid) ;
            		 $sme_id=$sme_id[0]->sme_id;

            		 $id_job=  DB::table('job')->insertGetId([
                            'job_user_id' => $userid,
                            'job_sme_id' => $sme_id,
                            'job_type' =>  'challenge',
                            'job_active' => '1',
                            'job_status' => 'PENDING REVIEW',
                            'created_date' => $date,
                            'updated_date' => null,

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
                            'challenge_document' => $document,
                            'challenge_hear' => $chhear,

                            ]);

                            //admin_notification

                            $sme_name = DB::table('sme_details')
                                        ->join('sme_users', 'sme_users.sme_id', '=', 'sme_details.sme_details_id')
                                        ->select('sme_details_company_name')
                                        ->where("sme_users.user_id","=", $userid)
                                        ->get();

                            $msg=$sme_name[0]->sme_details_company_name.' posted a new challenge : '.$chname;

                            DB::table('admin_notifications')->insert([
                                      'admin_notification_user_id' => $userid,
                                      'admin_notification_job_id' => $id_job ,
                                      'admin_notification_msg' => $msg,
                                      'admin_notification_date' => $date,
                                      'admin_notification_status' => 1,
                            ]);

                            //send email user

                            $email= DB::table('basic_user')
                                    ->select('user_email')
                                    ->where("user_id","=", $userid)->where("login_token","=", $token)
                                    ->get();
                            $email= $email[0]->user_email;

                            $link= "https://kpp.kaust.edu.sa/";

                            $template='<div class="column-per-100 outlook-group-fix" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                     <tr>
                                        <td style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; background-color: #ffffff; border-radius: 3px; vertical-align: top; padding: 30px 25px;" bgcolor="#ffffff" valign="top">
                                           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                                              <tr>
                                                 <td align="left" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; word-break: break-word;">
                                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 25px; text-align: left; color: #4F4F4F;">New Challenge!</div>
                                                 </td>
                                              </tr>
                                              <tr>
                                                 <td align="left" class="link-wrap" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; padding-bottom: 20px; word-break: break-word;">
                                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 15px; text-align: left; color: #4F4F4F;"><br> Your challenge has been posted successfully.<br>
                                                    Name: '.$chname.' <br>
                                                    For more information <a href="'.$link.'"> Click here! </a>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>';

                            $send_email =  $this->send_email($template,$email,'CNAM PORTAL - Challenge Posted') ;

                            //send email admin

                            $admins= DB::table('basic_user')
                                    ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                                    ->select('user_email')
                                    ->where("user_role.user_role_role_id","=", 4)
                                    ->get();

                            $sme_name= DB::table('sme_details')
                                    ->select('sme_details_company_name')
                                    ->where("sme_details_id","=", $sme_id)
                                    ->get();

                            $link= "https://kpp.kaust.edu.sa/";

                            $template='<div class="column-per-100 outlook-group-fix" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                  <tbody>
                                     <tr>
                                        <td style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; background-color: #ffffff; border-radius: 3px; vertical-align: top; padding: 30px 25px;" bgcolor="#ffffff" valign="top">
                                           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                                              <tr>
                                                 <td align="left" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; word-break: break-word;">
                                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 25px; text-align: left; color: #4F4F4F;">New Challenge!</div>
                                                 </td>
                                              </tr>
                                              <tr>
                                                 <td align="left" class="link-wrap" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; padding-bottom: 20px; word-break: break-word;">
                                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 15px; text-align: left; color: #4F4F4F;"><br> A new challenge has been posted by: '.$sme_name[0]->sme_details_company_name.'.<br>
                                                    Name: '.$chname.' <br>
                                                    For more information <a href="'.$link.'"> Click here! </a>
                                                    </div>
                                                 </td>
                                              </tr>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>';

                        foreach($admins as $admin){
                            $email= $admin->user_email;
                            $send_email =  $this->send_email($template,$email,'CNAM PORTAL - Challenge Posted') ;
                        }

                            return $challenge_id;

                        }else{return"error 3000";}

                  }else{return"role error";}
          }else{return"role error";}

        }else{return"token error";}

    }

    public function post_internship($userid,$token,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent,$length,$major,$contact,$link){


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
		$sme_id = $this->get_sme_id_by_user_id($userid) ;
		$sme_id=$sme_id[0]->sme_id;

		$id_job = DB::table('job')->insertGetId([
                'job_user_id' => $userid,
                'job_sme_id' => $sme_id,
                'job_type' =>  'internship',
                'job_active' => '1',
                'job_status' => 'PENDING REVIEW',
                'created_date' => $date,
                'updated_date' => null,

        ]);

        $if_job_id_exist = DB::table('internship')
                        ->select('*')
                        ->where("internship_job_id","=",$id_job)
                        ->get();

        if(count($if_job_id_exist)==0){

            $internship_id = DB::table('internship')->insertGetId([
                'internship_job_id'                 => $id_job,
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

            $sme_name = DB::table('sme_details')
                            ->join('sme_users', 'sme_users.sme_id', '=', 'sme_details.sme_details_id')
                            ->select('sme_details_company_name')
                            ->where("sme_users.user_id","=", $userid)
                            ->get();

            $msg=$sme_name[0]->sme_details_company_name.' posted a new internship : '.$jobTitle;

            DB::table('admin_notifications')->insert([
                      'admin_notification_user_id' => $userid,
                      'admin_notification_job_id' => $id_job ,
                      'admin_notification_msg' => $msg,
                      'admin_notification_date' => $date,
                      'admin_notification_status' => 1,
            ]);

            //send email user

            $user_email= DB::table('basic_user')
                    ->select('*')
                    ->where("user_id","=", $userid)
                    ->get();
            $email= $user_email[0]->user_email;

            $link= "https://kpp.kaust.edu.sa/";

            $template='<div class="column-per-100 outlook-group-fix" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                     <tr>
                        <td style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; background-color: #ffffff; border-radius: 3px; vertical-align: top; padding: 30px 25px;" bgcolor="#ffffff" valign="top">
                           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                              <tr>
                                 <td align="left" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; word-break: break-word;">
                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 25px; text-align: left; color: #4F4F4F;">New Internship!</div>
                                 </td>
                              </tr>
                              <tr>
                                 <td align="left" class="link-wrap" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; padding-bottom: 20px; word-break: break-word;">
                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 15px; text-align: left; color: #4F4F4F;"><br> Your internship has been posted successfully.<br>
                                    Name: '.$jobTitle.' <br>
                                    For more information <a href="'.$link.'"> Click here! </a>
                                    </div>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>';

            $send_email =  $this->send_email($template,$email,'CNAM PORTAL - Internship Posted') ;

            //send email admin

            $admins= DB::table('basic_user')
                    ->join('user_role', 'user_role.user_role_userid', '=', 'basic_user.user_id')
                    ->select('user_email')
                    ->where("user_role.user_role_role_id","=", 4)
                    ->get();

            $sme_name= DB::table('sme_details')
                    ->select('sme_details_company_name')
                    ->where("sme_details_id","=", $sme_id)
                    ->get();

            $admin_template='<div class="column-per-100 outlook-group-fix" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tbody>
                     <tr>
                        <td style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; background-color: #ffffff; border-radius: 3px; vertical-align: top; padding: 30px 25px;" bgcolor="#ffffff" valign="top">
                           <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                              <tr>
                                 <td align="left" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; word-break: break-word;">
                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 25px; text-align: left; color: #4F4F4F;">New Internship!</div>
                                 </td>
                              </tr>
                              <tr>
                                 <td align="left" class="link-wrap" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; padding-bottom: 20px; word-break: break-word;">
                                    <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 15px; text-align: left; color: #4F4F4F;"><br> A new internship has been posted by: '.$sme_name[0]->sme_details_company_name.'.<br>
                                    Name: '.$jobTitle.' <br>
                                    For more information <a href="'.$link.'"> Click here! </a>
                                    </div>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>';

            foreach($admins as $admin){
                $admin_email= $admin->user_email;
                $send_email =  $this->send_email($admin_template,$admin_email,'CNAM PORTAL - Internship Posted') ;
            }

            return $internship_id;
        }else{echo"error1";}

        }else{return"role error";}
        }else{return"role error";}
     }else{return"token error";}
    }

    public function get_sme_dashboard($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        $token=md5($token);

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==3){

                    $user_sme_id = $this->get_sme_id_by_user_id($userid);
                    if(count($user_sme_id)==1){

                        date_default_timezone_set("Asia/Beirut");
                        $date = date("Y-m-d");
                        $sme_id=$user_sme_id[0]->sme_id;

                        $internship_search_results = DB::table('job')
                                                    ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                                    ->select('job.job_id','job.job_status','job.created_date','internship.internship_id','internship.internship_job_title','internship.internship_start_date','internship.internship_end_date','internship.internship_locations','internship.internship_job_id')
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



                        $side_discussions = DB::table('comments')
                                        ->join('job', 'job.job_id', '=', 'comments.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'comments.user_id')
                                        ->select('comments.message','comments.created_date','basic_user.user_name' , 'job.job_id' ,'job.job_type' )
                                        ->where("job.job_user_id","=", $userid)
                                        ->where("job.job_status","!=", "CLOSED")
                                        ->where("job.job_status","!=", "COMPLETED")
                                        ->where("comments.reply","=", "0")
                                        ->where("comments.is_private","=", "no")
                                        ->where("comments.user_id","!=", $userid)
                                        ->where("job_active","=", "1")

                                        ->get();

                        $result=array($internship_search_results,$challenge_search_results,$count_private_comments,$count_public_comments,$side_discussions);

                        return $result;

                    }else{return"error 1";}

                  }else{return"role error";}
          }else{return"role error";}
        }else{return"token error";}
    }

    public function get_sme_challenge($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_sme_id = $this->get_sme_id_by_user_id($userid);

            if(count($user_sme_id)==1){
                $sme_id=$user_sme_id[0]->sme_id;
                $search_results = DB::table('job')
                            ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                            ->select('job.job_id','job.job_status','job.created_date','challenges.challenge_id','challenges.challenge_name','challenges.challenge_description')
                            ->where("job_user_id","=", $userid)
                            ->where("job_sme_id","=", $sme_id)
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
                return $res;

            }else{return"error";}
                  }else{return"role error";}
          }else{return"role error";}
        }else{return"token error";}
    }

    public function get_sme_internship($userid,$token){

        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){

            $user_sme_id = $this->get_sme_id_by_user_id($userid);

            if(count($user_sme_id)==1){
                $sme_id=$user_sme_id[0]->sme_id;
                $search_results = DB::table('job')
                                ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                ->select('job.job_id','job.job_status','job.created_date','internship.internship_id','internship.internship_job_title','internship.internship_start_date','internship.internship_end_date','internship.internship_locations','internship.internship_job_id')
                                ->where("job_user_id","=", $userid)
                                ->where("job_sme_id","=", $sme_id)
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
                return $res;

            }else{return"error";}
                  }else{return"role error";}
          }else{return"role error";}
        }else{return"token error";}

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

    public function get_sme_id_by_user_id($id){
         $search_results = DB::table('sme_users')
                            ->select("sme_id")
                            ->where("user_id","=", $id)
                            ->get();
		 return $search_results;
     }

    public function get_company_detail($userid,$token){

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
                            ->join('sme_users', 'sme_users.user_id', '=', 'basic_user.user_id')
                            ->join('sme_details', 'sme_details.sme_details_id', '=', 'sme_users.sme_id')
                            ->select('sme_details.sme_details_company_age','sme_details.sme_details_company_address_country','sme_details.sme_details_id','sme_details.sme_details_company_main_customer','sme_details.sme_details_industry_type','sme_details.sme_details_company_name','sme_details.sme_details_company_email','sme_details.sme_details_company_address_line1','sme_details.sme_details_company_address_line2','sme_details.sme_details_company_type','sme_details.sme_details_headquarter','sme_details.sme_details_company_number_employee','sme_details.sme_details_company_primary_product','sme_details.sme_details_company_website','sme_details.sme_details_company_profile')
                            ->where("basic_user.user_id","=", $userid)->where("login_token","=", $token)
                            ->get();


            $sme_id= $search_results[0]->sme_details_id;

            $social_links= DB::table('sme_social')
                        ->select('sme_social_link','sme_social_type')
                        ->where("sme_social_company_id","=",$sme_id)
                        ->get();


        $company_detail= array($search_results,$social_links);
        return $company_detail;
                  }else{return"role error";}
          }else{return"role error";}
         }else{return"token error";}

    }

    public function update_company($userid,$token,$headquarter,$address1,$address2,$caddress,$cemail,$cage,$cname,$cType,$customer,$employees,$file,$iType,$link,$product,$social,$website){
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
$user_sme_id = $this->get_sme_id_by_user_id($userid);
              $sme_id=$user_sme_id[0]->sme_id;



               $update = DB::table('sme_details')->where('sme_details_id','=', $sme_id)->update(['sme_details_company_name' => $cname ,
                  'sme_details_company_website' => $website,
                  'sme_details_company_email' => $cemail,
                  'sme_details_company_age' => $cage,
                  'sme_details_company_address_country' => $caddress,
                  'sme_details_headquarter' => $headquarter,
                  'sme_details_company_address_line1' => $address1,
                  'sme_details_company_address_line2' => $address2,
                  'sme_details_industry_type' => $string_itype,
                  'sme_details_company_type' => $cType,
                  'sme_details_company_number_employee' => $employees,
                  'sme_details_company_primary_product' => $product,
                  'sme_details_company_main_customer' => $string_customer,
                  'sme_details_company_profile' => $file,
                  'updated_at' => $date]);




        DB::table('sme_social')->where('sme_social_company_id', '=', $sme_id)->delete();

for($i=0;$i<count($social);$i++){

                $id2= DB::table('sme_social')->insert(['sme_social_company_id' => $sme_id,'sme_social_type' => $social[$i],'sme_social_link' => $link[$i],'created_date' => $date,'updated_date' => null,]);

           }

        if($userid){return"submited";}else{return"error";}

                  }else{return"role error";}
          }else{return"role error";}
         }else{return"token error";}

    }

    public function edit_challenge($userid, $token, $jobid, $chname,$chtype,$chdesc,$chapproach,$chspec,$chtime,$chaffected,$chaffspec,$chcost,$chcostspec,$chhear){
        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_sme_id = $this->get_sme_id_by_user_id($userid);

            if(count($user_sme_id)==1){

                $check_user_of_job= $this->check_user_of_job($userid,$jobid);

                if($check_user_of_job){
                    $sme_id=$user_sme_id[0]->sme_id;
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");

		            DB::table('job')->where("job_user_id","=", $userid)
                                ->where("job_sme_id","=", $sme_id)
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
    }

    public function edit_internship($userid,$token,$jobid,$startdate,$positionOutline,$location,$listDocuments,$enddate,$jobTitle,$experience,$department,$compensationSalary,$companydesc,$categorieStudent){
        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $user_sme_id = $this->get_sme_id_by_user_id($userid);

            if(count($user_sme_id)==1){

                $check_user_of_job= $this->check_user_of_job($userid,$jobid);

                if($check_user_of_job){

                    $sme_id=$user_sme_id[0]->sme_id;
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");

		            DB::table('job')->where("job_user_id","=", $userid)
                                ->where("job_sme_id","=", $sme_id)
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
    }

    public function check_self_signed_nda($userid,$token){

        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){

            $sme_id= $this->get_sme_id_by_user_id($userid) ;
	    	$sme_id=$sme_id[0]->sme_id;





	    	 $yes = DB::table('signed_nda')->select('*')->where("sme_id","=", $sme_id)->where("is_signed","=","yes")->get();
	    	 $no = DB::table('signed_nda')->select('*')->where("sme_id","=", $sme_id)->where("is_signed","=","no")->get();

	    	 if(count($yes)>0){return"yes";}
	    	 if(count($yes)==0 && count($no)==0){return"no";}
	    	 if(count($yes)==0 && count($no)>0){return"pending";}










                  }else{return"role error";}
          }else{return"role error";}

        }else{return"token error";}

    }

    public function agree_guidline($userid,$token,$tick,$nda_path){
        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $sme_id= $this->get_sme_id_by_user_id($userid) ;
	    	$sme_id=$sme_id[0]->sme_id;
	    	date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");

	    if($tick==1){

	        DB::table('agree_guidline')->insert([
                      'user_id' => $userid,'sme_id' => $sme_id,'created_date' => $date,
        ]);


	    }
	    if($nda_path!=null){


	        DB::table('signed_nda')->insert([
                      'user_id' => $userid,'sme_id' => $sme_id,'signed_file' => $nda_path,'is_signed'=>'yes','created_date' => $date,
        ]);

	    $token= md5($token);
	    $email= DB::table('basic_user')
                    ->select('user_email')
                    ->where("user_id","=", $userid)->where("login_token","=", $token)
                    ->get();

        $email= $email[0]->user_email;

        $template='<div class="column-per-100 outlook-group-fix" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
              <tbody>
                 <tr>
                    <td style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; background-color: #ffffff; border-radius: 3px; vertical-align: top; padding: 30px 25px;" bgcolor="#ffffff" valign="top">
                       <table border="0" cellpadding="0" cellspacing="0" role="presentation" style width="100%">
                          <tr>
                             <td align="left" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; word-break: break-word;">
                                <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 20px; font-weight: bold; line-height: 25px; text-align: left; color: #4F4F4F;">Sign NDA!</div>
                             </td>
                          </tr>
                          <tr>
                             <td align="left" class="link-wrap" style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 0px; padding: 0; padding-bottom: 20px; word-break: break-word;">
                                <div style="font-family: Open Sans, Helvetica, Tahoma, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 15px; text-align: left; color: #4F4F4F;"><br> Your NDA has been signed successfully.<br><br>
                                </div>
                             </td>
                          </tr>
                       </table>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>';

        $send_email =  $this->send_email($template,$email,'CNAM PORTAL - NDA') ;

	    }

	    return"proceed";



                  }else{return"role error";}
          }else{return"role error";}

        }else{return"token error";}
    }

    public function get_agree_guidline($userid,$token){

        $check_token_time= $this->check_user_token_time($userid, $token) ;

        if($check_token_time){
            $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){
            $sme_id= $this->get_sme_id_by_user_id($userid) ;
	    	$sme_id=$sme_id[0]->sme_id;


	    	 $result = DB::table('agree_guidline')
                      ->select('*')
                      ->where("user_id","=", $userid)
                      ->where("sme_id","=", $sme_id)
                      ->get();
                return $result;


                  }else{return"role error";}
          }else{return"role error";}
        }else{return"token error";}

    }

    public function fill_data(){
            $main_customers = DB::table('main_customers')
                            ->select("*")
                            ->get();

		    $industry_type = DB::table('industry_type')
                            ->select("*")
                            ->get();

            $data= array($main_customers,$industry_type);
            return $data;
        }

    public function generate_nda_pdf($userid,$token,$nda_date,$cname,$chead,$job_title,$country,$a1,$a2,$email){

        date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");

        $hijri_date = \GeniusTS\HijriDate\Hijri::convertToHijri($nda_date);

      $check_token_time= $this->check_user_token_time($userid, $token);
      if($check_token_time){
          $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3){

        $infos= DB::table('basic_user')
                        ->select('user_name','user_email','user_role')
                        ->where("user_id","=", $userid)
                        ->get();

        $user_name= $infos[0]->user_name; $user_email= $infos[0]->user_email; $user_role=$infos[0]->user_role;

$text='<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <style>
      * { font-family: DejaVu Sans, sans-serif; }
    table,th,td {border: 1px solid black;border-collapse: collapse;}
    .arabic{direction:rtl}


      </style>
      </head>
      <body>
      <table>
        <tr>
            <th>KING ABDULLAH UNIVERSITY OF<br>SCIENCE AND TECHNOLOGY<br><br>NON-DISCLOSURE AGREEMENT </th>
            <th>
جامعة الملك عبدالله للعلوم والتقنية
<br><br>
اتفاقية عدم الإفصاح

            </th>
        </tr>


<tr>
            <td>
            This Non-Disclosure Agreement<br>
            (“Agreement”) of
            '.$nda_date.' (“Effective
            Date”) is made between <br>
            '.$cname.'
            , having its principal place of
            business at '.$chead.' -
            Kingdom of Saudi Arabia.<br>
            a (hereinafter called “Collaborator”) and <br>
            KING ABDULLAH UNIVERSITY OF <br>
            SCIENCE AND TECHNOLOGY (hereinafter <br>
            called “KAUST”), each referred to as a<br>
            “Party” and collectively as the “Parties.” <br>
            <br>
            In consideration of the mutual promises <br>
            and covenants contained herein, the <br>
            Parties agree as follows:<br>
</td>

            <td style="text-align:right">
       أُبرمت اتفاقية عدم الإفصاح الحالية ("الاتفاقية")
       <br>
       بتاريخ<br>
       '.$hijri_date.'
       <br>
       هـ ("تاريخ السريان") بين
       <br>
       '.$cname.'
       <br>
        يقع مقر عملها الرئيسي في
        <br>
      '.$chead.' -
       <br>
       المملكة العربية السعودية.
       <br>
      (المشار إليها فيما يلي باسم "المتعاون")
      <br>
      وجامعة الملك عبد الله للعلوم والتكنولوجيا
      <br>
      (يُشار إليها فيما يلي باسم "جامعة الملك
      <br>
      عبدالله") ، ويشار إلى كل منها باسم "الطرف"
      <br>
      وبشكل جماعي باسم "الأطراف".
      <br><br>
      بالنظر إلى الوعود والعهود المتبادلة الواردة في
      <br>
      هذه الوثيقة ، يتفق الطرفان على ما يلي:
      <br>
            </td>
        </tr>

    <tr>
        <th>1. Definition of Confidential Information </th>
        <th style="text-align:right"> ١. تعريف المعلومات السرية </th>
    </tr>

    <tr>
        <td>As used herein, with the exceptions as<br>
        stated in Section 2, “Confidential <br>
        Information,” when capitalized, is defined <br>
        as information that a Party (the <br>
        “Disclosing Party”) considers confidential <br>
        and discloses to the other Party (the <br>
        “Receiving Party”) by any means, that<br><br>

            <b>a.</b> Is marked as “confidential” or
            “proprietary” or<br>

            <b>b.</b> Is disclosed orally or by visual <br>
            demonstration and such information (i) <br>
            was previously identified in writing as <br>
            confidential or proprietary or (ii) is <br>
            identified orally at the time of disclosure <br>
            and then reduced in writing within thirty <br>

        </td>
        <td style="text-align:right">
        على النحو المستخدم في هذه الاتفاقية ومع
        <br>
        الاستثناءات الواردة في بند 2، "المعلومات
        <br>
        السرية" ، والتي أوضح فيها أحد الأطراف أنها
        <br>
        معلومات سرية  ("الطرف المفصح") إذا أصيغت
        <br>
        بحروف كبيرة، ويتم الإفصاح عنها للطرف الآخر
        <br>
        ("الطرف المستلم") بأي وسيلة والتي:
        <br><br>
        أ. يتم تصنيفها بأنها "سرية" أو "مملوكة" أو؛
        <br>
        ب. يُفصح عنها شفويًا أو عن طريق العرض
        <br>
        المرئي وكانت تلك المعلومات (1) محددة مسبقًا
        <br>
        كتابيًا على أنها سرية أو مملوكة أو (2) تم
        <br>
        تعريفها شفويًا أثناء الإفصاح عنها ثم تمَّ توثيقها
        <br>
        كتابةً في غضون ثلاثين (30) يومًا بعد ذلك
        <br>
        بتصنيفها على أنها سرية أو مملوكة، مع
        <br>
        العلم أن عدم توثيقها كتابياً لا يبطل طابع السرية
        <br>
        لهذه المعلومات ولا يبطل الالتزامات الناشئة


        </td>
    </tr>

    <tr>
        <td>
            (30) days thereafter and marked as <br>
            confidential or proprietary, however the <br>
            lack of such reduction to writing shall not <br>
            negate the confidential nature of such <br>
            Confidential Information nor remove <br>
            obligations to such Confidential <br>
            Information contained herein.<br>

            <b>c.</b> CONFIDENTIAL INFORMATION <br>
            includes, without limitation, technical <br>
            information, marketing and business plans, <br>
            accounting information, databases, <br>
            specifications, formulations, tooling,<br>
            samples, prototypes, sketches, models,<br>
            drawings, specifications, procurement <br>
            requirements, engineering information, <br>
            computer software (source and object <br>
            codes), forecasts, identity of or details <br>
            about actual or potential customers or <br>
            projects, techniques, inventions, <br>
            discoveries, know-how and trade secrets,<br>
            whether it is received, accessed or<br>
            viewed by Recipient in writing, visually, <br>
            electronically or orally.
        </td>
        <td style="text-align:right">
        عن المعلومات السرية الواردة بهذه الاتفاقية.
        <br>
        ج. تشمل المعلومات السرية، على سبيل المثال
        <br>
        لا الحصر، المعلومات التقنية وخطط التسويق
        <br>
        والأعمال والمعلومات المحاسبية وقواعد البيانات
        <br>
        والمواصفات والمركبات والأدوات والعينات
        <br>
        والنماذج الأولية والرسومات والنماذج
        <br>
        والمخططات والمواصفات ومتطلبات الشراء
        <br>
        والمعلومات الهندسية وبرامج الحاسوب
        <br>
        (رموز المصدر والتصنيف) والتوقعات والهوية
        <br>
        أو التفاصيل المتعلقة بالعملاء الحاليين أو
        <br>
        المستقبليين أو المشاريع أو التقنيات أو
        <br>
        الاختراعات أو الاكتشافات أو المعرفة الفنية
        <br>
        والأسرار التجارية سواء تم استلامها أو الوصول
        <br>
        إليها أو الاطلاع عليها من قبل المستلم كتابيًا
        <br>
        أو بصريًا أو إلكترونيًا أو شفويًا.
        </td>
    </tr>


    <tr>
        <th>2. Exceptions to Confidential Information </th>
        <th style="text-align:right">2. استثناءات المعلومات السرية </th>
    </tr>


    <tr>
        <td>
        Confidential Information does not include <br>
        information that:<br>

        <b>a.</b> Is known at the time of disclosure, or<br>
        later becomes known, to the general <br>
        public, other than as a result of the breach<br>
        of this Agreement;<br>

        <b>b.</b> Can be shown by competent written <Br>
        evidence to have been known by the <br>
        Receiving Party before its receipt from the <br>
        Disclosing Party;<br>


        </td>

        <td style="text-align:right">
        لا تتضمن المعلومات السرية المعلومات التي:
        <br>
        أ.تكون متاحة لعامة الجمهور، أثناء وقت الإفصاح
        <br>
        أو تكون متاحة لاحقًا، لأسباب أخرى لا تتعلق
        <br>
        بمخالفة أحكام هذه الاتفاقية؛
        <br>
        ب. يتبين من خلال وثائق مكتوبة ومقبولة أنَّ
        <br>
        الطرف المستلم كان مطلع عليها قبل استلامها
        <br>
        من الطرف المفصح؛

        </td>
    </tr>

    <tr>
        <td>
            <b>c.</b> Is received by the Receiving Party,<br>
            without any obligations of confidentiality,<br>
            from a third party who has the legal right<br>
            to disclose it; or<br>
            <b>d.</b> Is independently developed by the <br>
            Receiving Party without the use of other <br>
            Confidential Information, as shown by<br>
            clear and convincing written evidence. <br>
        </td>

        <td style="text-align:right">

        ج. تم استلامها من قبل الطرف المستلم،
        <br>
        والذي لا يخضع لالتزام يتعلق بالسرية، من
        <br>
        طرف ثالث مخول له بالإفصاح عنها؛ أو
        <br>
        د. تم تطويرها بشكل مستقل بواسطة الطرف
        <br>
        المستلم دون استخدام أياً من المعلومات
        <br>
        السرية الأخرى، بموجب توثيق كتابي واضح
        <br>
        ومقبول.

        </td>
    </tr>

    <tr>
        <th>3. Protection of Confidential Information </th>
        <th style="text-align:right">3. حماية المعلومات السرية </th>
    </tr>

    <tr>
        <td>
            The Parties are desirous to explore <br>
            potential research and development,<br>
            business and consulting opportunities<br>
            (“Purposes”). With respect to the Disclosing<br>
            Party’s Confidential Information, a Receiving<br>
            Party shall:<br>

            <b>a.</b> Use reasonable means to protect the <br>
            confidentiality of Confidential Information, <br>
            which are at least as diligent as the <br>
            means used to safeguard its own most<br>
            confidential information;<br>

            <b>b.</b> Use such Confidential Information <br>
            solely for the Purposes;<br>

            <b>c.</b> Not disclose such Confidential <br>
            Information to any third party, except <br>
            representatives, consultants, or <br>
            subcontractors, authorized by the <br>
            Disclosing Party and engaged to assist in <br>
            pursuing the Purposes, who are bound to <br>
            protect the Confidential Information,<br>
            using the same reasonable means,<br>
            provided in this Agreement as being <br>
            applicable to the Receiving Party, or as <br>
            otherwise authorized in writing by the<br>
            Disclosing Party; and<br>

        </td>
        <td style="text-align:right">
        يرغب الطرفان في استكشاف فرص البحث
        <br>
        والتطوير المحتملة والأعمال والاستشارات
        <br>
        ("الأغراض").
        <br>
        وفيما يتعلق بمعلومات الطرف المفصح
        <br>
        المفصح للمعلومات السرية، يجب على الطرف
        <br>
        المستلم:
        <br>
        أ. استخدام وسائل معقولة لحماية سرية
        <br>
        المعلومات السرية، أي بنفس المستوى
        <br>
        والإجراءات المستخدمة لحماية معلوماته
        <br>
        السرية؛
        <br>
        ب. استخدام تلك المعلومات السرية للأغراض
        <br>
        المشار إليها فقط؛
        <br>
        ج. عدم الإفصاح عن هذه المعلومات السرية
        <br>
        لأي طرف ثالث باستثناء الممثلين أو
        <br>
        المستشارين أو المقاولين من الباطن المصرح
        <br>
        لهم من قبل الطرف المفصح  لتحقيق الأغراض
        <br>
        المشار إليها، والملتزمين بحماية المعلومات
        <br>
        السرية باستخدام نفس الوسائل المعقولة
        <br>
        المنصوص عليها في هذه الاتفاقية، باعتبارها
        <br>
        نافذة في حق الطرف المستلم، أو على النحو
        <br>
        الذي يأذن به الطرف المفصح كتابةً؛

        </td>
    </tr>

    <tr>
        <td>
            <b>d.</b> Not disclose such Confidential<br>
            Information to any person within its own<br>
            organization who does not have a need to <br>
            know in order to carry out one or more <br>
            Purposes.
        </td>
        <td style="text-align:right">
            د. عدم الإفصاح عن هذه المعلومات السرية
            <br>
            لأي شخص داخل منشأته والتي لا
            <br>
            يستوجب الاطلاع عليها أو معرفتها من أجل
            <br>
            تحقيق الأغراض المشار إليها.

        </td>
    <tr>
        <th>4. Required Disclosure </th>
        <th style="text-align:right">4. الإفصاح اللازم </th>
    </tr>

    <tr>
        <td>A Receiving Party may disclose <br>
        Confidential Information to the extent<br>
        required by a valid order from a court or <br>
        other governmental body, after first notifying <br>
        the Disclosing Party in writing of the order.
        </td>

        <td style="text-align:right">
        يجوز للطرف المستلم الإفصاح عن المعلومات
        <br>
        السرية بالقدر الذي يقتضيه حكم أو أمر صادر
        <br>
        من محكمة أو هيئة حكومية، بعد أن تم  إخطار
        <br>
        الطرف المفصح كتابة على الحكم أو الأمر
        <br>
        الصادر.
        </td>
    </tr>

    <tr>
        <th>5. Points of Contact</th>
        <th style="text-align:right">5. جهات الاتصال </th>
    </tr>

    <tr>
        <td>For the purpose of administering this<br>
            Agreement, the primary points of contact,<br>
            with respect to the transmission, receipt and <br>
            control of Confidential Information exchanged <br>
            hereunder and for providing notices required <br>
            by or relating to this Agreement, are <br>
            designated by the respective Parties as <br>
            follows:
        </td>
        <td style="text-align:right">
        لغرض تنفيذ هذه الاتفاقية، يتم تحديد جهات
        <br>
        الاتصال الأساسية فيما يتعلق بنقل واستلام
        <br>
        والتحكم بالمعلومات السرية المتبادلة لغرض
        <br>
        إرسال الإشعارات التي يتعين توجيهها بموجب
        <br>
        هذه الاتفاقية أو فيما يتعلق بها، من قبل
        <br>
        الأطراف المعنيين على النحو التالي:
        </td>
    </tr>

    <tr>
        <td>
        <b>For KAUST</b><br>
        Name : Sean P. Flanigan<br>
        <br>
        Title: Director, Technology<br>
        Transfer Office<br>
        Address : <br>
        4700 King Abdullah University<br>
        of Science & Technology <br>
        KAUST Box 2916<br>
        Thuwal 23955-6900<br>
        Kingdom of Saudi Arabia<br>

        <br>
        E-mail:	IP@KAUST.EDU.SA <br>

        </td>

        <td style="text-align:right">
            <b>For Collaborator</b><br>
             الاسم:
            <br>
             '.$user_name.'
            <br>
            المنصب :
            <br>
            '.$user_role.'
            <br>
            العنوان :
            <br>
            '.$country.'
            <br>
            '.$a1.'
            <br>
            '.$a2.'

            <br>
            البريد الإلكتروني :
            <br>
            '.$user_email.'
            <br>

        </td>
    </tr>

    <tr>
        <td>
            Whenever feasible, the Parties shall transmit<br>
            their Confidential Information between these<br>
            points of contact.  However, Confidential<br>
            Information shall not lose protection by virtue<br>
            of receipt by another employee or agent of a <br>
            Party.
        </td>
        <td style="text-align:right">
            <br>
            يجب على الطرفين، متى ما أمكن ذلك،
            <br>
            إرسال معلوماتهما السرية بين جهات
            <br>
            الاتصال المشار إليها، دون أن يؤثر على
            <br>
            حماية المعلومات السرية في حال تسلمها من
            <br>
            قبل موظف آخر أو وكيل لطرف آخر.

        </td>
    </tr>

    <tr>
        <th>6. Ownership of Confidential Information</th>
        <th style="text-align:right">6. ملكية المعلومات السرية </th>
    </tr>
    <tr>
        <td>
            All Confidential Information, including all <br>
            copies thereof, shall remain the property of <br>
            the Disclosing Party. All Confidential<br>
            Information and copies thereof shall be <br>
            returned to the Disclosing Party upon the <br>
            written request of the Disclosing Party at any<br>
            time.
        </td>
        <td style="text-align:right">
        تظل جميع المعلومات السرية، بما في ذلك
        <br>
        جميع نسخها، ملكًا للطرف المفصح،
        <br>
        على أن يتم إعادة جميع المعلومات السرية
        <br>
        ونسخها إلى الطرف المفصح بناء على
        <br>
        طلب كتابي من الطرف المفصح في أي وقت.

        </td>
    </tr>

    <tr>
        <th>7. No Warranties </th>
        <th style="text-align:right">7. عدم تقديم ضمانات </th>
    </tr>

    <tr>
        <td>
            Neither Party makes any warranty of any <br>
            kind with respect to Confidential Information,<br>
            including in particular but without <br>
            limitation,  warranties of merchantability,<br>
            fitness for any purpose and non-infringement<br>
            of trademarks, patents, copyrights, trade<br>
            secrets, right of privacy, or any other rights of<br>
            third persons. Neither Party assumes any <br>
            responsibility or liability whatever under this <br>
            Agreement for the results of use of the <br>
            Confidential Information by the Receiving<br>
            Party or others.
        </td>

        <td style="text-align:right">
        لا يجوز لأياً من الأطراف تقديم ضمانات فيما
        <br>
        يتعلق بالمعلومات السرية، بما في ذلك على
        <br>
        وجه الخصوص وليس الحصر، ضمانات
        <br>
        التسويق والملائمة لأي غرض، ومنها عدم انتهاك
        <br>
        حقوق العلامات التجارية، أو براءات الاختراع،
        <br>
        أو حقوق المؤلف والنشر، أو الأسرار التجارية،
        <br>
        أو حق الخصوصية أو أياً من حقوق الغير.
        <br>
        كما لا يتحمل أي من الأطراف أي مسؤولية
        <br>
        بموجب هذه الاتفاقية عن نتائج استخدام
        <br>
        المعلومات السرية من قبل الطرف المستلم
        <br>
        أو غيره.

        </td>
    </tr>

    <tr>
        <th>8. No Implied Licenses </th>
        <th style="text-align:right">8. عدم استخراج تراخيص</th>
    </tr>

    <tr>
        <td>
            No license is created under this <br>
            Agreement, nor shall any be implied <br>
            therefrom under any patent, trademark,<br>
            application, copyright, trade secret, or other <br>
            intellectual property right of either Party, other<br>
            than the use of Confidential Information for <br>
            the Purposes and subject to the limitations of <br>
            this Agreement.
        </td>

        <td style="text-align:right">
        لا ينشأ بموجب هذه الاتفاقية أي ترخيص ولا يجوز
        <br>
        تضمين أي منها بموجب براءة اختراع، أو علامة
        <br>
        تجارية، أو حقوق المؤلف، أو الأسرار التجاري أو
        <br>
        أياً من الحقوق الملكية الفكرية الأخرى لكلاً من
        <br>
        الطرفين، إلا في حدود استخدام المعلومات
        <br>
        السرية للأغراض المشار إليها والاستثناءات
        <br>
        الواردة بموجب هذه الاتفاقية.

        </td>
    </tr>

    <tr>
        <th>9. Independent Contractors </th>
        <th style="text-align:right">9. المتعاقدون المستقلون </th>
    </tr>

    <tr>
        <td>
            Each Party is an independent contractor. <br>
            Neither is an agent of the other for any <br>
            purpose whatsoever, and neither shall have <br>
            any authority to bind the other. <br>
        </td>

        <td style="text-align:right">
        يُعد كل طرف بموجب هذه الاتفاقية طرف
        <br>
        مستقل وأنه ليس وكيلًا للآخر لأي غرض كان،
        <br>
        ولا يُخول لأياً من الأطراف إلزام الآخر على
        <br>
        عكس ذلك.
        </td>
    </tr>

    <tr>
        <th>10. Non-Disclosure Agreement Term </th>
        <th style="text-align:right">10. مدة اتفاقية عدم الإفصاح </th>
    </tr>
    <tr>
        <td>
            <b>a.</b> This Agreement shall take effect on the<br>
            Effective Date when executed by both<br>
            Parties. All obligations under this <br>
            Agreement shall expire three (3) years<br>
            after the Effective Date, except the<br>
            obligations of the Receiving Party,<br>
            relative to Confidential Information, which<br>
            shall survive during the term of this<br>
            Agreement and for a period of three (3)<br>
            years from the expiration or termination of<br>
            this Agreement. Either party may<br>
            terminate this Agreement upon thirty (30)<br>
            days prior written notice to the other party<br>
            without any cause.<br><br>
            <b>b.</b> Confidential Information that was<br>
            disclosed by the Disclosing Party to the<br>
            Receiving Party prior to the Effective Date<br>
            of this Agreement shall also be governed<br>
            by the confidentiality and use restrictions<br>
            set forth in this Agreement.
        </td>
        <td style="text-align:right">
           أ. تسري هذه الاتفاقية من تاريخ السريان فور
           <br>
           إبرامها من قبل الطرفين وتنقضي جميع
           <br>
           الالتزامات بموجب الاتفاقية بعد ثلاث (3)
           <br>
           سنوات من تاريخ السريان، باستثناء التزامات
           <br>
           الطرف المستلم فيما يتعلق بالمعلومات
           <br>
           السرية والتي تكون نافذة خلال مدة هذه
           <br>
           الاتفاقية ولمدة ثلاث (3) سنوات من انتهاء
           <br>
           أو إنهاء هذه الاتفاقية، ويجوز لأي من
           <br>
           الطرفين إنهاء هذه الاتفاقية بناءً على إشعار
           <br>
           كتابي مسبق قبل ثلاثين (30) يومًا للطرف
           <br>
           الآخر دون أي سبب.
           <br>
           <br>
           ب. تخضع المعلومات السرية التي تم الإفصاح
           <br>
           عنها من قبل الطرف المفصح للطرف المستلم
           <br>
           قبل تاريخ سريان هذه الاتفاقية أيضًا لقيود
           <br>
           السرية والاستخدام المنصوص عليها في
           <br>
           هذه الاتفاقية.

        </td>
    </tr>

    <tr>
        <th>11. Governing Law and Enforcement </th>
        <th style="text-align:right"> 11. القانون الواجب التطبيق </th>
    </tr>

    <tr>
        <td>This Agreement is made under and shall<br>
            be construed according to the laws of the<br>
            Kingdom of Saudi Arabia, without reference<br>
            to conflicts of law provisions or principles. </td>
        <td style="text-align:right">
            أُبرمت هذه الاتفاقية بموجب قوانين المملكة
            <br>
            العربية السعودية ويخضع تفسيرها وتنفيذها
            <br>
            وفقًا لها دون اللجوء إلى قواعد الاسناد أو مبادئه.
        </td>
    </tr>

    <tr>
        <th>12. Entire Agreement and Modifications</th>
        <th style="text-align:right"> 12. الاتفاقية الكاملة والتعديلات </th>
    </tr>

    <tr>
        <td>This Agreement, including its Exhibit A,<br>
            supersedes any prior written or oral<br>
            agreements relating to the transmission of<br>
            information and purposes identified in Exhibit<br>
            A. This Agreement may not be amended or<br>
            modified except by subsequent agreement in<br>
            writing signed by duly authorized<br>
            representatives of the Parties.<br>

             </td>
        <td style="text-align:right">
            تحل هذه الاتفاقية بما في ذلك ملحق "أ"
            <br>
            محل أي اتفاقيات كتابية أو شفوية مسبقة
            <br>
            تتعلق بتبادل المعلومات والأغراض المحددة
            <br>
            في ملحق "أ"، ولا يجوز تعديل الاتفاقية أو
            <br>
            تغييرها إلا بموجب اتفاقية كتابية لاحقة
            <br>
            وموقعة من قبل ممثلي الطرفين المفوضين
            <br>
            بذلك.

        </td>
    </tr>

    <tr>
        <td>
            IN WITNESS WHEREOF, the Parties have<br>
            caused this Agreement to be duly executed in<br>
            duplicate originals by their duly authorized<br>
            representatives. The Parties to this<br>
            Agreement agree that a copy of original<br>
            signature(s), including scanned/electronic<br>
            copy, can substitute original signature(s). The<br>
            Parties further waive the right to challenge the<br>
            admissibility or authenticity of this document<br>
            based solely on the absence of original<br>
            signature(s). </td>
        <td style="text-align:right">

            وبناء على ما تقدم، أوعز الطرفان لممثليهم
            <br>
            المفوضين أصولاً بإبرام هذه الاتفاقية في
            <br>
            نسختين، واتفق الطرفان على أن نسخة
            <br>
            من التوقيع/ التوقيعات الأصلي/ة، بما في ذلك
            <br>
            نسخة ممسوحة ضوئيًا / إلكترونية، يمكن
            <br>
            أن تحل محل التوقيع/ التوقيعات الأصلي/ة،
            <br>
            ويتنازل الطرفان كذلك عن حقهما بالطعن في
            <br>
            صحة هذه الاتفاقية على أساس عدم تضمنها
            <br>
            لتوقيع/توقيعات أصلي/ة.

        </td>
    </tr>

    <tr>
        <td>
            <u>
                Each signatory below certifies that they<br>
                are authorized to execute legally binding<br>
                commitments on behalf of their named<br>
                Party. <br>
                </u>
                <br><br>
                KING ABDULLAH UNIVERSITY OF<br>
                SCIENCE AND TECHNOLOGY<br>
                <br>
                By:<br>
                Name: Sean P. Flanigan<br>
                Title: Director, Technology Transfer Office<br>
                Date:

        </td>
        <td style="text-align:right">
           <u>
           يشهد كل مفوض بالتوقيع أدناه على أنه
           <br>
           مخول بتنفيذ الالتزامات والأحكام الملزمة نيابةً
           <br>
           عن الطرف المذكور.
           </u>
           <br>
           <br><br>
           '.$cname.'
            <br>
            <br>
            By:<br>
            الاسم:
            <br>
            '.$user_name.'
            <br>
            <br>
            المنصب :
            <br>
            '.$user_role.'
            <br>
            <br>
            التاريخ :
            <br>

        </td>
    </tr>


    </table>

      </body>
      </html>';
$Arabic = new \ArPHP\I18N\Arabic();
$text= $Arabic->utf8Glyphs($text, 1500);


        $file_name="$userid-$token.pdf";
        $dompdf = new DOMPDF();
        $dompdf->loadHtml($text);
        $dompdf->render();
        $output = $dompdf->output();
        file_put_contents('uploads/nda/'.$file_name , $output);

        $user_sme_id = $this->get_sme_id_by_user_id($userid);
        $sme_id=$user_sme_id[0]->sme_id;
        $file="https://kpp.kaust.edu.sa/backend/uploads/nda/$file_name";
        DB::table('signed_nda')->insert([
                      'user_id' => $userid,'sme_id' => $sme_id,'signed_file' => $file,'is_signed'=>'no','created_date' => $date,
        ]);

        return"https://kpp.kaust.edu.sa/backend/uploads/nda/$file_name";

                  }else{return"role error";}
          }else{return"role error";}

      }else{return"token error";}


    }

    public function check_user_of_job($userid,$jobid){
        $user_sme_id = $this->get_sme_id_by_user_id($userid);
        $sme_id=$user_sme_id[0]->sme_id;
        $search_results = DB::table('job')
                            ->select("*")
                            ->where("job_id","=", $jobid)
                            ->where("job_user_id","=", $userid)
                            ->where("job_sme_id","=", $sme_id)
                            ->where("job_active","=", "1")
                            ->get();

		if(count($search_results)==1){
		    return true;
		}
    }

    public function generate_job_pdf($userid,$token,$job){
        	date_default_timezone_set("Asia/Beirut");
        $date = date("Y/m/d H:i:s");


      $check_token_time= $this->check_user_token_time($userid, $token);
       if($check_token_time){
                $check_role= $this->return_user_role($userid);
              if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                  if($role==3 || $role==4 || $role==1){

                $check_type = DB::table('job')
                                ->select('job_type')
                                ->where("job_id","=", $job)
                                ->where("job_active","=", "1")
                                ->get();



                if(count($check_type)==1){

                    $type = $check_type[0]->job_type;
                    if($type=='challenge'){


                    }
                    else if($type=='internship'){

                        $search_results = DB::table('job')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('basic_user', 'basic_user.user_id', '=', 'job.job_user_id')
                                        ->join('sme_details', 'sme_details.sme_details_id', '=', 'job.job_sme_id')
                                        ->select('job.*','internship.*','sme_details.*')
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

                              $company_name = $search_results[0]->sme_details_company_name;
                              $company_location = $search_results[0]->sme_details_company_address_country;

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
        $dompdf->loadHtml($html);
        $dompdf->render();
        $output = $dompdf->output();
        file_put_contents('uploads/job_export/'.$file_name , $output);

       // $user_sme_id = $this->get_sme_id_by_user_id($userid);
        //$sme_id=$user_sme_id[0]->sme_id;

        $file="https://kpp.kaust.edu.sa/backend/uploads/job_export/$file_name";





        return"https://kpp.kaust.edu.sa/backend/uploads/job_export/$file_name";




                                       }


                            return("error");



                    }else{return"not internship";}
                }else{return"no type";}

                  }else{return"role error";}
          }else{return"role error";}
            }else{return"token error";}


    }

    public function return_user_role($user_id){

         $search_results = DB::table('user_role')
                            ->select("user_role_role_id")
                            ->where("user_role_userid","=", $user_id)->where("active","=", 1)->get();
		 return $search_results;

     }

    public function send_email($template,$email1,$subj){

           $data=array("temp"=>$template);
            Mail::send('email_template.email_template', $data, function($message) use ($email1,$subj){
              $message->to($email1, 'CNAM PORTAL')->subject($subj);
              $message->from('admin@kpp.kaust.edu.sa','CNAM PORTAL');

            });

    return "done";

    }

    public function get_comments_my_jobs($userid,$token){
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

                    return $results;

                  }else{return"not sme user";}
            }else{return"role error";}
         }
    }

}
