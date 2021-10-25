<?php
namespace App\Http\Controllers\MANAGE_WEBSITE;

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
    
    public function get_all_notification_template($userid, $token){
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                            
                    $res = DB::table('notification_template')
                            ->select('notification_id','description')
                            ->get();
                
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        
        return $res;
    }
    
    public function get_notification_template_by_id($userid, $token, $templateid){
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                            
                    $res = DB::table('notification_template')
                            ->select('*')
                            ->where('notification_id', "=" , $templateid)
                            ->get();
                    
                    
                
                }else{$res="role error";}
            }else{$res="role error";}
        }else{$res="token error";}
        
        return $res;
    }
    
    public function edit_notification_template($userid,$token,$notification_id,$notification_message,$email_subject,$email_template){
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
        if($check_token_time){
            
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                            
                    $update = DB::table('notification_template')
                                    ->where('notification_id','=', $notification_id)
                                    ->update([
                                        'notification_message' => $notification_message,
                                        'email_subject' => $email_subject,
                                        'email_template' => $email_template
                                    ]);
                                    
                    $res="ok";
                
                }else{$res="role error";}
            }else{$res="role error";}
            
        }else{$res="token error";}
        
       return $res;
    }
    
    public function get_all_media($userid,$token,$type){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $media = DB::table('media')
                                        ->select('*')
                                        ->where("active","=", "1")
                                        ->where("slug","=", $type)
                                        ->get();
                                        
                       
                    }else{$media="role error";}
                }else{$media="role error";}
            }else{$media="token error";}
            
            return $media;
        }
        
    public function get_media_details($userid,$token,$media_id){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $media = DB::table('media')
                                        ->select('*')
                                        ->where("active","=", "1")
                                        ->where("media_id","=", $media_id)
                                        ->get();
                                        
                       
                    }else{$media="role error";}
                }else{$media="role error";}
            }else{$media="token error";}
            return $media;
        }
        
    public function add_new_media($userid,$token,$slug,$image,$title_english,$title_arabic,$simple_english,$simple_arabic,$description_english,$description_arabic,$location_english,$location_arabic,$event_date){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                      date_default_timezone_set("Asia/Beirut");
                      $date = date("Y/m/d H:i:s");
                
                      DB::table('media')->insert([
                    'slug' => $slug,
                    'image' => $image,
                    'title_e' => $title_english,
                    'title_a' => $title_arabic,
                    'text_e' => $simple_english,
                    'text_a' => $simple_arabic,
                    'more_e' => $description_english,
                    'more_a' => $description_arabic,
                    'location_english' => $location_english,
                    'location_arabic' => $location_arabic,
                    'event_date' => $event_date,
                    'active' =>1,
                    'created_date' => $date,
                    'updated_date' => $date
                ]);  
                       $media="";
                    }else{$media="role error";}
                }else{$media="role error";}
            }else{$media="token error";}
            
            return $media;
        }
        
    public function delete_media($userid,$token,$id_media){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                      $update = DB::table('media')->where('media_id','=', $id_media)->update(['active' => 0,'updated_date'=>$date ]);
                      
                       
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
        
    public function update_media($userid,$token,$id_media,$slug,$image,$title_english,$title_arabic,$simple_english,$simple_arabic,$description_english,$description_arabic,$location_english,$location_arabic,$event_date){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $update = DB::table('media')->where('media_id','=', $id_media)->update(['slug' => $slug,'image' => $image,'title_e' => $title_english,'title_a' => $title_arabic,'text_e' => $simple_english,'text_a' => $simple_arabic,'more_e' => $description_english,'more_a' => $description_arabic,'location_english'=>$location_english,'location_arabic'=>$location_arabic,'event_date'=>$event_date,'updated_date' => $date ]);
                        
                       
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
    
    public function get_all_testimonials($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $media = DB::table('testimonials')
                                        ->select('*')
                                        ->where("active","=", "1")
                                        ->get();
                                        
                       
                    }else{$media="role error";}
                }else{$media="role error";}
            }else{$media="token error";}
            
            return $media;
        }
        
    public function add_new_testimonials($userid,$token,$image,$name_english,$name_arabic,$position_english,$position_arabic,$description_english,$description_arabic){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                      date_default_timezone_set("Asia/Beirut");
                      $date = date("Y/m/d H:i:s");
                
                      DB::table('testimonials')->insert([
                    'image' => $image,
                    'text_e' => $description_english,
                    'text_a' => $description_arabic,
                    'name_e' => $name_english,
                    'name_a' => $name_arabic,
                    'position_e' => $position_english,
                    'position_a' => $position_arabic,
                    'active' => 1,
                    'created_date' => $date,
                    'updated_date' => $date
                ]);  
                $media="";
                       
                    }else{$media="role error";}
                }else{$media="role error";}
            }else{$media="token error";}
            return$media;
            
        }
        
    public function delete_testimonials($userid,$token,$id_testimonial){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                      $update = DB::table('testimonials')->where('testimonial_id','=', $id_testimonial)->update(['active' => 0,'updated_date'=>$date ]);
                      
                       
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
        
    public function update_testimonials($userid,$token,$id_testimonial,$image,$name_english,$name_arabic,$position_english,$position_arabic,$description_english,$description_arabic){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $update = DB::table('testimonials')->where('testimonial_id','=', $id_testimonial)->update(['image' => $image,'text_e' => $description_english,'text_a' => $description_arabic,'name_e' => $name_english,'name_a' => $name_arabic,'position_e' => $position_english,'position_a' => $position_arabic,'created_date' => $date,'updated_date' => $date]);
                        
                       
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
        
    public function get_all_contact_forms($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $request_meeing = DB::table('request_meeting')
                                        ->select('*')
                                        ->get();
                                        
                       
                    }else{$request_meeing="role error";}
                }else{$request_meeing="role error";}
            }else{$request_meeing="token error";}
            return $request_meeing;
        }
        
    public function get_contact_forms($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $request_meeing = DB::table('contact_us_form')
                                        ->select('*')
                                        ->get();
                                        
                       
                    }else{$request_meeing="role error";}
                }else{$request_meeing="role error";}
            }else{$request_meeing="token error";}
            
            return $request_meeing;
        }
        
    public function view_contact_form($userid,$token,$form_id){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                   $request_meeing = DB::table('contact_us_form')
                                        ->select('*')
                                        ->where('contact_id','=',$form_id)
                                        ->get();
                                        
                    }else{$request_meeing="role error";}
                }else{$request_meeing="role error";}
            }else{$request_meeing="token error";}
            
            return $request_meeing;
        }    
        
    public function view_request_form($userid,$token,$form_id){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                   $request_meeing = DB::table('request_meeting')
                                        ->select('*')
                                        ->where('id_request','=',$form_id)
                                        ->get();
                                        
                    }else{$request_meeing="role error";}
                }else{$request_meeing="role error";}
            }else{$request_meeing="token error";}
            
            return $request_meeing;
        }    
    
    public function get_footer($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $request_meeing = DB::table('page_components')
                                        ->select('*')
                                        ->where('slug','=','footer-left')
                                        ->orwhere('slug','=','footer-right')
                                        ->orwhere('slug','=','footer-w-1')
                                        ->orwhere('slug','=','footer-w-2')
                                        ->orwhere('slug','=','footer-w-3')
                                        ->orwhere('slug','=','footer-w-4')
                                        ->get();
                                        
                       
                    }else{$request_meeing="role error";}
                }else{$request_meeing="role error";}
            }else{$request_meeing="token error";}
            
            return $request_meeing;
            
        }
        
    public function update_footer($userid,$token,$footer_en_l,$footer_ar_l,$footer_en_r,$footer_ar_r,$footer_en_w1,$footer_ar_w1,$footer_en_w2,$footer_ar_w2,$footer_en_w3,$footer_ar_w3,$footer_en_w4,$footer_ar_w4){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $update = DB::table('page_components')->where('slug','=', 'footer-left')->update(['english' => $footer_en_l,'arabic' => $footer_ar_l]);
                        $update = DB::table('page_components')->where('slug','=', 'footer-right')->update(['english' => $footer_en_r,'arabic' => $footer_ar_r]);
                        $update = DB::table('page_components')->where('slug','=', 'footer-w-1')->update(['english' => $footer_en_w1,'arabic' => $footer_ar_w1]);
                        $update = DB::table('page_components')->where('slug','=', 'footer-w-2')->update(['english' => $footer_en_w2,'arabic' => $footer_ar_w2]);
                        $update = DB::table('page_components')->where('slug','=', 'footer-w-3')->update(['english' => $footer_en_w3,'arabic' => $footer_ar_w3]);
                        $update = DB::table('page_components')->where('slug','=', 'footer-w-4')->update(['english' => $footer_en_w4,'arabic' => $footer_ar_w4]);
                        
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
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
   
    public function get_all_pages($userid,$token){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $pages = DB::table('pages')
                                        ->select('*')
                                        ->get();
                                        
                       
                    }else{$pages="role error";}
                }else{$pages="role error";}
            }else{$pages="token error";}
            
            return $pages;
        }
        
    public function admin_get_page_component($userid,$token,$page_id){
         $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        
                        
                        
                        $pages = DB::table('page_components')
                                        ->select('*')
                                        ->where("page_id","=",$page_id)
                                        ->orderBy('order_rows', 'ASC')
                                        ->get();
                        
                        $settings = DB::table('settings')
                                    ->select('settings_value')
                                    ->where("settings_key","=", "document_summary")
                                    ->get();
                                    
                        $res=array($pages,$settings);
                        
                       
                    }else{$res="role error";}
                }else{$res="role error";}
            }else{$res="token error";}
            
            return $res;
        }
        
    public function update_page_component($userid,$token,$page_id,$slug,$english,$arabic){
           $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){

                        $update = DB::table('page_components')
                        ->where('page_id','=', $page_id)
                        ->where('slug','=', $slug)
                        ->update(['english' => $english,'arabic' => $arabic]);
                        
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
        
    public function get_mailchimp_settings($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $pages = DB::table('settings')
                                        ->select('*')
                                        ->where("settings_key","=","mailchimp_base")
                                        ->orwhere("settings_key","=","mailchimp_api")
                                        ->orwhere("settings_key","=","mailchimp_reply_to")
                                        ->orwhere("settings_key","=","mailchimp_from_name")
                                        ->get();
                                        
                       
                    }else{$pages="role error";}
                }else{$pages="role error";}
            }else{$pages="token error";}
            
            return $pages;
    }
    
    public function update_mailchimp_settings($userid,$token,$base,$api,$reply_to,$from_name){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                
                    $role=$check_role[0]->user_role_role_id;
                    if($role==4){
                        $update = DB::table('settings')->where('settings_key','=', 'mailchimp_base')->update(['settings_value' => $base]);
                        $update = DB::table('settings')->where('settings_key','=', 'mailchimp_api')->update(['settings_value' => $api]);
                        $update = DB::table('settings')->where('settings_key','=', 'mailchimp_reply_to')->update(['settings_value' => $reply_to]);
                        $update = DB::table('settings')->where('settings_key','=', 'mailchimp_from_name')->update(['settings_value' => $from_name]);
                        $pages="Done";

                       
                       
                    }else{$pages="role error";}
                }else{$pages="role error";}
            }else{$pages="token error";}
            return $pages;
    }
        
    public function get_all_sliders($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $sliders = DB::table('sliders')
                                    ->select('*')
                                    ->where("active","=", "1")
                                    ->get();
                    
                   
                }else{$sliders="role error";}
            }else{$sliders="role error";}
        }else{$sliders="token error";}
        
        return $sliders;
    }
    
    public function add_new_slider($userid,$token,$image,$title,$subtitle,$btn,$link,$title_ar,$subtitle_ar,$btn_ar,$link_ar){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
            
                    DB::table('sliders')->insert([
                        'slider_image' => $image,
                        'slider_title' => $title,
                        'slider_subtitle' => $subtitle,
                        'btn_text' => $btn,
                        'btn_link' => $link,
                        'slider_title_ar' => $title_ar,
                        'slider_subtitle_ar' => $subtitle_ar,
                        'btn_text_ar' => $btn_ar,
                        'btn_link_ar' => $link_ar,
                        'active' => 1,
                        'created_date' => $date,
                        'updated_date' => $date
                    ]);  
                   $sliders="";
                }else{$sliders="role error";}
            }else{$sliders="role error";}
        }else{$sliders="token error";}
        
        return $sliders;
    }
        
    public function delete_slider($userid,$token,$id_slider){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                $role=$check_role[0]->user_role_role_id;
                    
                if($role==4){
                    $update = DB::table('sliders')->where('slider_id','=', $id_slider)->update(['active' => 0,'updated_date'=>$date ]);
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        return $update;
        
        
    }
    
    public function update_slider($userid,$token,$id_slider,$image,$title,$subtitle,$btn,$link,$title_ar,$subtitle_ar,$btn_ar,$link_ar){
            $check_token_time= $this->check_user_token_time($userid, $token) ;
        
            if($check_token_time){
            
                $check_role= $this->return_user_role($userid);
                if(count($check_role)==1){
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    $role=$check_role[0]->user_role_role_id;
                    
                    if($role==4){
                        $update = DB::table('sliders')->where('slider_id','=', $id_slider)->update(['slider_image' => $image,'slider_title' => $title,'slider_subtitle' => $subtitle,'btn_text' => $btn,'btn_link' => $link,'slider_title_ar' => $title_ar,'slider_subtitle_ar' => $subtitle_ar,'btn_text_ar' => $btn_ar,'btn_link_ar' => $link_ar,'updated_date' => $date]);
                       
                    }else{$update="role error";}
                }else{$update="role error";}
            }else{$update="token error";}
            
            return $update;
        }
        
    public function get_join_icons($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $icons = DB::table('icons')
                                    ->select('*')
                                    ->where("slug","=",'why-join' )
                                    ->get();
                    
                   
                }else{$icons="role error";}
            }else{$icons="role error";}
        }else{$icons="token error";}
        
        return $icons;
    }
    
    public function add_join_icons($userid,$token,$text_e,$text_a,$image){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                      DB::table('icons')->insert([
                    'slug' => 'why-join',
                    'icon' => $image,
                    'text_english' => $text_e,
                    'text_arabic' => $text_a,
                    ]);  
                    
                    $icons="";
                   
                }else{$icons="role error";}
            }else{$icons="role error";}
        }else{$icons="token error";}
        
        return $icons;
    }
    
    public function update_join_icons($userid,$token,$icon_id,$text_e,$text_a,$image){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $update = DB::table('icons')->where('icon_id','=', $icon_id)->update(['icon' => $image,'text_english' => $text_e,'text_arabic' => $text_a,]);
                        
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        
        return $update;
    }
    
    public function delete_join_icons($userid,$token,$icon_id){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    DB::table('icons')->where('icon_id', '=', $icon_id)->delete();
                    $update="success";
                   
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        return $update;
    }
    
    public function change_row_status($userid,$token,$row_id,$status){
        
        
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    
                    $update = DB::table('page_components')->where('page_components_id','=', $row_id)->update(['status' => $status]);
                        
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        return $update;
        
    }
    
    public function get_component_detail($userid,$token,$page_id,$slug){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $update = DB::table('page_components')->where('page_id','=', $page_id)->where('slug','=', $slug)->get();
               
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        return $update;
    }
        
    public function get_all_social($userid,$token){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $social = DB::table('social_media')
                                    ->select('*')
                                    ->where("active","=", "1")
                                    ->get();
                    
                   
                }else{$social="role error";}
            }else{$social="role error";}
        }else{$social="token error";}
        
        return $social;
    }
        
    public function add_new_social($userid,$token,$icon,$link){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
            
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    date_default_timezone_set("Asia/Beirut");
                    $date = date("Y/m/d H:i:s");
                    
                    DB::table('social_media')->insert([
                            'social_icon' => $icon,
                            'social_link' => $link,
                            'active' => "1",
                            'created_date' => $date,
                            'updated_date' => $date
                    ]);  
                   
                   $social="";
                   
                }else{$social="role error";}
            }else{$social="role error";}
        }else{$social="token error";}
        
        return$social;
    }
        
    public function delete_social($userid,$token,$id_social){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                $role=$check_role[0]->user_role_role_id;
                    
                if($role==4){
                    $update = DB::table('social_media')->where('social_id','=', $id_social)->update(['active' => 0,'updated_date'=>$date ]);
                    
                   
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        
        return $update;
    }
        
    public function update_social($userid,$token,$id_social,$icon,$link){
        $check_token_time= $this->check_user_token_time($userid, $token) ;
    
        if($check_token_time){
        
            $check_role= $this->return_user_role($userid);
            if(count($check_role)==1){
                date_default_timezone_set("Asia/Beirut");
                $date = date("Y/m/d H:i:s");
                $role=$check_role[0]->user_role_role_id;
                if($role==4){
                    $update = DB::table('social_media')->where('social_id','=', $id_social)->update(['social_icon' => $icon,'social_link' => $link,'updated_date' => $date]);
                    
                       
                }else{$update="role error";}
            }else{$update="role error";}
        }else{$update="token error";}
        
        return $update;
    }
    
}