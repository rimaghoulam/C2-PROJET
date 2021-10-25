<?php
namespace App\Http\Controllers\WEBSITE_BUILDER;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\WEBSITE_BUILDER\Functions;
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
    
    
    public function Get_Page_Component($request){
          $page_id = $request->input('page_id');
          
          $type = $request->input('type');
          
          
          
          if($page_id==1){ $page_component = $this->Functions->build_homepage($type);}
          if($page_id==2){ $page_component = $this->Functions->build_industrykpp();}
          if($page_id==3){ $page_component = $this->Functions->build_news();}
          if($page_id==4){ $page_component = $this->Functions->build_events();}
          if($page_id==5){ $page_component = $this->Functions->build_stories();}
          if($page_id==6){ $page_component = $this->Functions->build_photos();}
          if($page_id==7){ $page_component = $this->Functions->build_contact();}
          if($page_id==9){ $page_component = $this->Functions->build_terms();}
          if($page_id==10){ $page_component = $this->Functions->build_privacy();}
          if($page_id==13){ $page_component = $this->Functions->build_landing($type);}
          return response(json_encode($page_component))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_Media($request){
          $media_id = $request->input('media_id');
          
          $get_media_by_id = $this->Functions->get_media_details($media_id);
          return response(json_encode($get_media_by_id))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
  
 
    
    
}