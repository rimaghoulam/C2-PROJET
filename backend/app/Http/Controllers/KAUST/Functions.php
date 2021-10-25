<?php
namespace App\Http\Controllers\KAUST;

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


class Functions extends Controller
{
    
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }
	
	/**
     * Supdate option.
     *
     * @param  int  $id
     * @return Response
     */

    public function get_kaust_dashboard($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==1){
                        $challenge_results = DB::table('assign_job')
                                        ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                        ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('assign_job.*','job.*','challenges.*','industry_details.*')
                                        ->where("user_id","=", $userid)
                                        ->where("job_type","=", "challenge")
                                    //    ->where("job_status","=", "IN PROGRESS")
                                        ->where("job_active","=", "1")
                                        ->get();
                                        
                        $internship_results = DB::table('assign_job')
                                        ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('assign_job.*','job.*','internship.*','industry_details.*')
                                        ->where("user_id","=", $userid)
                                        ->where("job_type","=", "internship")
                                    //    ->where("job_status","=", "IN PROGRESS")
                                        ->where("job_active","=", "1")
                                        ->get();
                                
                        $count_public_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
                        
                        $search_results=array($challenge_results,$internship_results,$count_public_comments);
                       // return($search_results);
                    }else{$search_results="role error";}
                }else{$search_results="role error";}
            }else{$search_results="token error";}
            
            return $search_results;
        }
        
    public function get_kaust_challenge($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==1){
                    $challenge_results = DB::table('assign_job')
                                    ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                    ->join('challenges', 'challenges.challenge_job_id', '=', 'job.job_id')
                                    ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                    ->select('assign_job.*','job.*','challenges.*','industry_details.*')
                                    ->where("user_id","=", $userid)
                                    ->where("job_type","=", "challenge")
                                    ->where("job_active","=", "1")
                                    ->get();
                                
                    $count_public_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
                    
                    $res=array($challenge_results,$count_public_comments);
                    //
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        return $res;
        
    }
    
    public function get_kaust_internship($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==1){
                        $internship_results = DB::table('assign_job')
                                        ->join('job', 'job.job_id', '=', 'assign_job.job_id')
                                        ->join('internship', 'internship.internship_job_id', '=', 'job.job_id')
                                        ->join('industry_details', 'industry_details.industry_details_id', '=', 'job.job_industry_id')
                                        ->select('assign_job.*','job.*','internship.*','industry_details.*')
                                        ->where("user_id","=", $userid)
                                        ->where("job_type","=", "internship")
                                        ->where("job_active","=", "1")
                                        ->get();
                                
                        $count_public_comments = DB::table('comments')
                                ->select('job_id', DB::raw('count(*) as total'))
                                ->groupBy('job_id')
                                ->pluck('total','job_id')->all();
                                
                        $res=array($internship_results,$count_public_comments);
                        //
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
     
     public function return_user_role($user_id){
         
         $search_results = DB::table('user_role')
                            ->select("user_role_role_id")
                            ->where("user_role_userid","=", $user_id)->where("active","=", 1)->get();
		 return $search_results;
         
     }
    
    
}