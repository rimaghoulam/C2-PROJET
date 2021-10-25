<?php
namespace App\Http\Controllers\KAUST;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Controllers\KAUST\Functions;
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
    
    
    public function Get_KAUST_Dashboard($request)
        {
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_dashboard_assigned_to_me = $this->Functions->get_kaust_dashboard($userid,$token);
          return response(json_encode($get_dashboard_assigned_to_me))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_KAUST_Challenge($request)
        {
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_challenge_assigned_to_me = $this->Functions->get_kaust_challenge($userid,$token);
          return response(json_encode($get_challenge_assigned_to_me))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
        
    public function Get_KAUST_Internship($request)
        {
          $userid = $request->input('userid'); $token = $request->input('token');
          $get_internship_assigned_to_me = $this->Functions->get_kaust_internship($userid,$token);
          return response(json_encode($get_internship_assigned_to_me))->header('X-Frame-Options', 'SAMEORIGIN')->header('X-Content-Type-Options', 'nosniff');
        }
    
    
}