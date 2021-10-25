<?php
namespace App\Http\Controllers\WEBSITE_BUILDER;

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

    public function build_homepage($type){
        $data = array();
        
        if($type=="media"){
            $data['components'] =  $this->get_page_components_with_media('1');
            $data['why_join_icons'] =  $this->get_icons_i('why-join');
            $data['success_stories'] =  $this->get_media_i('success-stories');
            $data['testimonials'] =  $this->get_testimonials_i();
            $data['sliders'] =  $this->get_sliders_i();
            $data['social'] =  $this->get_social();
            
        }
        else{
            $data['components'] =  $this->get_page_components_without_media('1');
            $data['why_join_icons'] =  $this->get_icons_t('why-join');
            $data['success_stories'] =  $this->get_media_t('success-stories');
            $data['testimonials'] =  $this->get_testimonials_t();
            $data['summary'] =  $this->get_summary();
            $data['sliders'] =  $this->get_sliders_t();
            $data['footer'] =  $this->get_page_components('0');
            
        }
        
        
        
        
        
		
		
		
		
		
		return $data;
    }
    
    public function build_landing($type){
        if($type=="media"){
            $data = array();
            $data['components'] =  $this->get_page_components_with_media('13');
		    return $data;
        }else{
            $data = array();
            $data['components'] =  $this->get_page_components_without_media('13');
            $data['summary'] =  $this->get_summary();
            return $data;
        }
        
    }
    
    
    public function build_industrykpp(){
        $data = array();
        $data['footer'] =  $this->get_page_components('0');
        $data['components'] =  $this->get_page_components('2');
        $data['social'] =  $this->get_social();
		return $data;
    }
    
    public function build_news(){
        $data = array();
        $data['footer'] =  $this->get_page_components('0');
        $data['news'] =  $this->get_media('news');
        $data['social'] =  $this->get_social();
		return $data;
    }
    
    public function build_events(){
        $data = array();
        $data['events'] =  $this->get_media('events');
        $data['footer'] =  $this->get_page_components('0');
        $data['social'] =  $this->get_social();
		return $data;
    }
    
    public function build_stories(){
        $data = array();
        $data['success_stories'] =  $this->get_media('success-stories');
        $data['footer'] =  $this->get_page_components('0');
        $data['social'] =  $this->get_social();
		return $data;
    }
    
    public function build_photos(){
        $data = array();
        $data['photo'] =  $this->get_media('photos');
        $data['footer'] =  $this->get_page_components('0');
        $data['video'] =  $this->get_media('videos');
        $data['social'] =  $this->get_social();
		return $data;
    }
    
    public function build_contact(){
        
        $data = array();
        $data['components'] =  $this->get_page_components('7');
        $data['footer'] =  $this->get_page_components('0');
        $data['social'] =  $this->get_social();
		return $data;
        
    }
    
    public function build_terms(){
        
        $data = array();
        $data['components'] =  $this->get_page_components('9');
        $data['footer'] =  $this->get_page_components('0');
		return $data;
        
    }
    
    public function build_privacy(){
        
        $data = array();
        $data['components'] =  $this->get_page_components('10');
        $data['footer'] =  $this->get_page_components('0');
		return $data;
        
    }
    
    public function get_media_details($media_id){
        
        $data = array();
        $data['media_details'] =  $this->get_media_by_id($media_id);
        $data['footer'] =  $this->get_page_components('0');
        $data['social'] =  $this->get_social();
		return $data;
        
    }
    
    
    
    public function get_summary(){
     	$summary = DB::table('settings')->select('*')->where("settings_key","=", "document_summary")->get();
        $summary_value=$summary[0]->settings_value;
        
        if($summary_value=="off"){return null;}
        else{
                $challenges = DB::table('job')->select('*')->where("job_type","=", "challenge")->count();
                $internships = DB::table('job')->select('*')->where("job_type","=", "internship")->count();
                $kaust = DB::table('basic_user')->join('user_role','user_role.user_role_userid','=','basic_user.user_id')->select('*')->where("user_role.user_role_role_id","=", 1)->count();
                $companies = DB::table('basic_user')->join('user_role','user_role.user_role_userid','=','basic_user.user_id')->select('*')->where("user_role.user_role_role_id","=", 3)->count();
                $total=array("challenges"=>$challenges,"internships"=>$internships,"kaust"=>$kaust,"companies"=>$companies);
                return$total;

        }
	}
	
	public function get_testimonials(){
		return DB::table('testimonials')->select('*')->where('active','=','1')->get();
	}
	
	public function get_testimonials_i(){
		return DB::table('testimonials')->select('image')->where('active','=','1')->get();
	}
	
	public function get_testimonials_t(){
		return DB::table('testimonials')->select('text_e','text_a','name_e','name_a','position_e','position_a')->where('active','=','1')->get();
	}
	
	public function get_page_components($page_id){
		return DB::table('page_components')->select('*')->where('page_id','=',$page_id)->orderBy('order_rows', 'ASC')->get();
	}
	
	public function get_page_components_with_media($page_id){
		return DB::table('page_components')->select('*')->where('page_id','=',$page_id)->where('type','=','image')->orderBy('order_rows', 'ASC')->get();
	}
	
	public function get_page_components_without_media($page_id){
		return DB::table('page_components')->select('*')->where('page_id','=',$page_id)->where('type','!=','image')->orderBy('order_rows', 'ASC')->get();
	}
	
	public function get_icons($slug){
		return DB::table('icons')->select('*')->where('slug','=',$slug)->get();
	}
	
	public function get_icons_i($slug){
		return DB::table('icons')->select('icon')->where('slug','=',$slug)->get();
	}
	
	public function get_icons_t($slug){
		return DB::table('icons')->select('text_english','text_arabic')->where('slug','=',$slug)->get();
	}
	
	public function get_media($slug){
		return DB::table('media')->select('*')->where('slug','=',$slug)->where('active','=',1)->orderBy('created_date', 'DESC')->get();
	}
	
	public function get_media_i($slug){
		return DB::table('media')->select('image')->where('slug','=',$slug)->where('active','=',1)->orderBy('created_date', 'DESC')->get();
	}
	public function get_media_t($slug){
		return DB::table('media')->select('media_id','title_e','title_a','text_e','text_a')->where('slug','=',$slug)->where('active','=',1)->orderBy('created_date', 'DESC')->get();
	}
	
	public function get_media_by_id($media_id){
		return DB::table('media')->select('*')->where('media_id','=',$media_id)->get();
	}
    
    public function get_sliders(){
		return DB::table('sliders')->select('*')->where('active','=','1')->get();
	}
	
	public function get_sliders_i(){
		return DB::table('sliders')->select('slider_image')->where('active','=','1')->get();
	}
	
	public function get_sliders_t(){
		return DB::table('sliders')->select('slider_title','slider_title','slider_subtitle','btn_text','btn_link','slider_title_ar','slider_title_ar','slider_subtitle_ar','btn_text_ar','btn_link_ar')->where('active','=','1')->get();
	}
	
	public function get_social(){
		return DB::table('social_media')->select('*')->where('active','=','1')->get();
	}
}