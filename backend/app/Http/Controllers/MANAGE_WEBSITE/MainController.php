<?php
namespace App\Http\Controllers\MANAGE_WEBSITE;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MANAGE_WEBSITE\Functions;
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
    
    public function Get_All_Notification_Template($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $templates = $this->Functions->get_all_notification_template($userid,$token);
        return response(json_encode($templates))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_Notification_Template_By_Id($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $templateid = $request->input('templateid'); 
        $template = $this->Functions->get_notification_template_by_id($userid,$token,$templateid);
        return response(json_encode($template))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Edit_Notification_Template($request){
        $userid = $request->input('userid'); $token = $request->input('token'); $notification_id = $request->input('notification_id'); $notification_message = $request->input('notification_message'); $email_subject = $request->input('email_subject'); $email_template = $request->input('email_template'); 
        $template = $this->Functions->edit_notification_template($userid,$token,$notification_id,$notification_message,$email_subject,$email_template);
        return response(json_encode($template))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_media_details($request){
          $userid = $request->input('userid'); $token = $request->input('token');$media_id = $request->input('mediaid');
          $get_all_media = $this->Functions->get_media_details($userid,$token,$media_id);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_news($request){
          $userid = $request->input('userid'); $token = $request->input('token');$type="news";
          $get_all_media = $this->Functions->get_all_media($userid,$token,$type);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Get_events($request){
          $userid = $request->input('userid'); $token = $request->input('token');$type="events";
          $get_all_media = $this->Functions->get_all_media($userid,$token,$type);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_success($request){
          $userid = $request->input('userid'); $token = $request->input('token');$type="success-stories";
          $get_all_media = $this->Functions->get_all_media($userid,$token,$type);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_photos($request){
          $userid = $request->input('userid'); $token = $request->input('token');$type="photos";
          $get_all_media = $this->Functions->get_all_media($userid,$token,$type);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_videos($request){
          $userid = $request->input('userid'); $token = $request->input('token');$type="videos";
          $get_all_media = $this->Functions->get_all_media($userid,$token,$type);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Add_New_Media($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $slug = $request->input('slug'); $image = $request->input('image');
          $title_english = $request->input('title_english'); $title_arabic = $request->input('title_arabic');
          $simple_english = $request->input('simple_english'); $simple_arabic = $request->input('simple_arabic');
          $description_english = $request->input('description_english'); $description_arabic = $request->input('description_arabic');
          
          $location_english = $request->input('location_english'); $location_arabic = $request->input('location_arabic');
          $event_date = $request->input('event_date');
          $add_new_media = $this->Functions->add_new_media($userid,$token,$slug,$image,$title_english,$title_arabic,$simple_english,$simple_arabic,$description_english,$description_arabic,$location_english,$location_arabic,$event_date);
          return response(json_encode($add_new_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Delete_Media($request){
          $userid = $request->input('userid'); $token = $request->input('token');$id_media = $request->input('id_media');
          $delete_media = $this->Functions->delete_media($userid,$token,$id_media);
          return response(json_encode($delete_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Update_Media($request){
          $userid = $request->input('userid'); $token = $request->input('token');$id_media = $request->input('id_media');
          $slug = $request->input('slug'); $image = $request->input('image');
          $title_english = $request->input('title_english'); $title_arabic = $request->input('title_arabic');
          $simple_english = $request->input('simple_english'); $simple_arabic = $request->input('simple_arabic');
          $description_english = $request->input('description_english'); $description_arabic = $request->input('description_arabic');
          
          $location_english = $request->input('location_english'); $location_arabic = $request->input('location_arabic');$event_date = $request->input('event_date');
          $update_media = $this->Functions->update_media($userid,$token,$id_media,$slug,$image,$title_english,$title_arabic,$simple_english,$simple_arabic,$description_english,$description_arabic,$location_english,$location_arabic,$event_date);
          return response(json_encode($update_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    
    public function Get_All_Testimonials($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_testimonials = $this->Functions->get_all_testimonials($userid,$token);
          return response(json_encode($get_all_testimonials))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Add_New_Testimonials($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $image = $request->input('image');
          $name_english = $request->input('name_english'); $name_arabic = $request->input('name_arabic');
          $position_english = $request->input('position_english'); $position_arabic = $request->input('position_arabic');
          $description_english = $request->input('description_english'); $description_arabic = $request->input('description_arabic');
          $add_new_testimonials = $this->Functions->add_new_testimonials($userid,$token,$image,$name_english,$name_arabic,$position_english,$position_arabic,$description_english,$description_arabic);
          return response(json_encode($add_new_testimonials))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Delete_Testimonials($request){
          $userid = $request->input('userid'); $token = $request->input('token');$id_testimonial = $request->input('id_testimonial');
          $delete_testimonials = $this->Functions->delete_testimonials($userid,$token,$id_testimonial);
          return response(json_encode($delete_testimonials))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Update_Testimonials($request){
          $userid = $request->input('userid'); $token = $request->input('token');$id_testimonial = $request->input('id_testimonial');
          $image = $request->input('image');
          $name_english = $request->input('name_english'); $name_arabic = $request->input('name_arabic');
          $position_english = $request->input('position_english'); $position_arabic = $request->input('position_arabic');
          $description_english = $request->input('description_english'); $description_arabic = $request->input('description_arabic');
          
          $update_testimonials = $this->Functions->update_testimonials($userid,$token,$id_testimonial,$image,$name_english,$name_arabic,$position_english,$position_arabic,$description_english,$description_arabic);
          return response(json_encode($update_testimonials))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_All_Contact_Forms($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_contact_forms = $this->Functions->get_all_contact_forms($userid,$token);
          return response(json_encode($get_all_contact_forms))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Contact_Forms($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_contact_forms = $this->Functions->get_contact_forms($userid,$token);
          return response(json_encode($get_all_contact_forms))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function View_Contact_Form($request){
          $userid = $request->input('userid'); $token = $request->input('token');$form_id = $request->input('form_id');
          $view_contact_form = $this->Functions->view_contact_form($userid,$token,$form_id);
          return response(json_encode($view_contact_form))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function View_Request_Form($request){
          $userid = $request->input('userid'); $token = $request->input('token');$form_id = $request->input('form_id');
          $view_contact_form = $this->Functions->view_request_form($userid,$token,$form_id);
          return response(json_encode($view_contact_form))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Footer($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_footer = $this->Functions->get_footer($userid,$token);
          return response(json_encode($get_footer))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Update_Footer($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $footer_en_l = $request->input('footer_en_l'); $footer_ar_l = $request->input('footer_ar_l');
          
          $footer_en_r = $request->input('footer_en_r'); $footer_ar_r = $request->input('footer_ar_r');
          $footer_en_w1 = $request->input('footer_en_w1'); $footer_ar_w1 = $request->input('footer_ar_w1');
          $footer_en_w2 = $request->input('footer_en_w2'); $footer_ar_w2= $request->input('footer_ar_w2');
          $footer_en_w3 = $request->input('footer_en_w3'); $footer_ar_w3 = $request->input('footer_ar_w3');
          $footer_en_w4 = $request->input('footer_en_w4'); $footer_ar_w4 = $request->input('footer_ar_w4');
         
          $update_footer = $this->Functions->update_footer($userid,$token,$footer_en_l,$footer_ar_l,$footer_en_r,$footer_ar_r,$footer_en_w1,$footer_ar_w1,$footer_en_w2,$footer_ar_w2,$footer_en_w3,$footer_ar_w3,$footer_en_w4,$footer_ar_w4);
          return response(json_encode($update_footer))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_All_Pages($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_pages = $this->Functions->get_all_pages($userid,$token);
          return response(json_encode($get_all_pages))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Admin_Get_Page_Component($request){
          $userid = $request->input('userid'); $token = $request->input('token');$page_id = $request->input('page_id');
          $get_all_media = $this->Functions->admin_get_page_component($userid,$token,$page_id);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
 
    public function Update_Page_Component($request){
          $userid = $request->input('userid'); $token = $request->input('token');$page_id = $request->input('page_id');$slug = $request->input('slug');$english = $request->input('english');$arabic = $request->input('arabic');
          $get_all_media = $this->Functions->update_page_component($userid,$token,$page_id,$slug,$english,$arabic);
          return response(json_encode($get_all_media))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function get_mailchimp_settings($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_mailchimp_settings = $this->Functions->get_mailchimp_settings($userid,$token);
          return response(json_encode($get_mailchimp_settings))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function update_mailchimp_settings($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $base = $request->input('base'); $api = $request->input('api');
          $reply_to = $request->input('reply_to'); $from_name = $request->input('form_name');
          $update_mailchimp_settings = $this->Functions->update_mailchimp_settings($userid,$token,$base,$api,$reply_to,$from_name);
          return response(json_encode($update_mailchimp_settings))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function upload_manage_image($request){

$path=$_FILES['file']['name'];
$type = pathinfo($path, PATHINFO_EXTENSION);
$image=addslashes($_FILES['file']['tmp_name']);
$image= file_get_contents($image);
$image= base64_encode($image);
$base64 = 'data:image/' . $type . ';base64,' . $image;
echo$base64;
 
    }
        
        
        public function download($request){
          $search_results = DB::table('challenges_documents')
                            ->select("*")
                            ->get();
                            $s=$search_results[0]->document_path;
                            $s=mb_convert_encoding($s, 'UTF-8', 'UTF-8');
                            return$s;
       
        }
    
    public function Get_All_Sliders($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_all_sliders = $this->Functions->get_all_sliders($userid,$token);
          return response(json_encode($get_all_sliders))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Add_New_Slider($request){
          $userid = $request->input('userid'); $token = $request->input('token');
          $image = $request->input('image');$title = $request->input('title'); $subtitle = $request->input('subtitle'); $btn = $request->input('btn'); $link = $request->input('link');
          $title_ar = $request->input('title_ar'); $subtitle_ar = $request->input('subtitle_ar'); $btn_ar = $request->input('btn_ar'); $link_ar = $request->input('link_ar');
          
          $add_new_slider = $this->Functions->add_new_slider($userid,$token,$image,$title,$subtitle,$btn,$link,$title_ar,$subtitle_ar,$btn_ar,$link_ar);
          return response(json_encode($add_new_slider))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Delete_Slider($request){
          $userid = $request->input('userid'); $token = $request->input('token');$id_slider = $request->input('id_slider');
          $delete_slider = $this->Functions->delete_slider($userid,$token,$id_slider);
          return response(json_encode($delete_slider))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    public function Update_Slider($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $image = $request->input('image');$id_slider = $request->input('id_slider');
        $title = $request->input('title'); $subtitle = $request->input('subtitle'); $btn = $request->input('btn'); $link = $request->input('link');
        $title_ar = $request->input('title_ar'); $subtitle_ar = $request->input('subtitle_ar'); $btn_ar = $request->input('btn_ar'); $link_ar = $request->input('link_ar');
        
        $update_slider = $this->Functions->update_slider($userid,$token,$id_slider,$image,$title,$subtitle,$btn,$link,$title_ar,$subtitle_ar,$btn_ar,$link_ar);
        return response(json_encode($update_slider))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_join_icons($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_join_icons = $this->Functions->get_join_icons($userid,$token);
        return response(json_encode($get_join_icons))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function add_join_icons($request){
        $userid = $request->input('userid'); $token = $request->input('token');$text_e = $request->input('text_e');$text_a = $request->input('text_a');$image = $request->input('image');
        $add_join_icons = $this->Functions->add_join_icons($userid,$token,$text_e,$text_a,$image);
        return response(json_encode($add_join_icons))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function update_join_icons($request){
        $userid = $request->input('userid'); $token = $request->input('token');$icon_id = $request->input('icon_id');$text_e = $request->input('text_e');$text_a = $request->input('text_a');$image = $request->input('image');
        $update_join_icons = $this->Functions->update_join_icons($userid,$token,$icon_id,$text_e,$text_a,$image);
        return response(json_encode($update_join_icons))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function delete_join_icons($request){
        $userid = $request->input('userid'); $token = $request->input('token');$icon_id = $request->input('icon_id');
        $delete_join_icons = $this->Functions->delete_join_icons($userid,$token,$icon_id);
        return response(json_encode($delete_join_icons))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function change_row_status($request){
        $userid = $request->input('userid'); $token = $request->input('token');$row_id = $request->input('row_id');$status = $request->input('status');
        $change_row_status = $this->Functions->change_row_status($userid,$token,$row_id,$status);
        return response(json_encode($change_row_status))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function get_component_detail($request){
        $userid = $request->input('userid'); $token = $request->input('token');$page_id = $request->input('page_id');$slug = $request->input('slug');
        $get_component_detail = $this->Functions->get_component_detail($userid,$token,$page_id,$slug);
        return response(json_encode($get_component_detail))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Get_All_Social($request){
        $userid = $request->input('userid'); $token = $request->input('token');
        $get_all_social = $this->Functions->get_all_social($userid,$token);
        return response(json_encode($get_all_social))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
        
    public function Add_New_Social($request){
        $userid = $request->input('userid'); $token = $request->input('token');$icon = $request->input('icon');$link = $request->input('link');
        $add_new_social = $this->Functions->add_new_social($userid,$token,$icon,$link);
        return response(json_encode($add_new_social))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Delete_Social($request){
        $userid = $request->input('userid'); $token = $request->input('token');$id_social = $request->input('id_social');
        $delete_social = $this->Functions->delete_social($userid,$token,$id_social);
        return response(json_encode($delete_social))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
    
    public function Update_Social($request){
        $userid = $request->input('userid'); $token = $request->input('token');$id_social = $request->input('id_social');$icon = $request->input('icon');$link = $request->input('link');
        $update_social = $this->Functions->update_social($userid,$token,$id_social,$icon,$link);
        return response(json_encode($update_social))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
    }
}