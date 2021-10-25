<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//GLOBAL

Route::post('tete', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('tete', $parameters = array($request));
 
});



Route::post('check_login', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Check_Login', $parameters = array($request));
 
});

Route::post('download_job_pdf', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('download_job_pdf', $parameters = array($request));
 
});

Route::post('activate_account', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('activate_account', $parameters = array($request));
 
});

Route::post('register_user', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Register_User', $parameters = array($request));
 
});

Route::post('forget_password', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Forget_Password', $parameters = array($request));
 
});

Route::post('update_password', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Update_Password', $parameters = array($request));
 
});

Route::post('get_user_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Get_User_Detail', $parameters = array($request));
 
});

Route::post('update_user_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Update_User_Detail', $parameters = array($request));
 
});

Route::post('get_job_details_byid', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Get_Job_Details_Byid', $parameters = array($request));
 
});

Route::post('post_comment', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Post_Comment', $parameters = array($request));
 
});

Route::post('post_comment_notifications', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Post_Comment_Notifications', $parameters = array($request));
 
});

Route::post('get_count_comments_by_jobid', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Get_Count_Comments_By_Jobid', $parameters = array($request));
 
});

Route::post('get_notifications', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Get_Notifications', $parameters = array($request));
 
});

Route::post('click_notification', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Click_Notification', $parameters = array($request));
 
});

Route::post('get_job_discussion', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('get_job_discussion', $parameters = array($request));
 
});

Route::post('check_reset_token', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('check_reset_token', $parameters = array($request));
 
});

Route::post('post_discussion_attachment', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('discussion_attachment', $parameters = array($request));
 
});

Route::post('change_password', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('change_password', $parameters = array($request));
 
});

Route::post('update_admin_new_user', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Update_Admin_New_User', $parameters = array($request));
 
});

Route::post('request_meeting', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('Request_Meeting', $parameters = array($request));
 
});

Route::post('contact_us_submit', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('contact_us_submit', $parameters = array($request));
 
});



//INDUSTRY

Route::post('register_company', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Register_Company', $parameters = array($request));
 
});

Route::post('upload_image', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('upload_image', $parameters = array($request));
 
});

Route::post('post_challenge', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Post_Challenge', $parameters = array($request));
 
});

Route::post('post_internship', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Post_Internship', $parameters = array($request));
 
});

Route::post('get_industry_dashboard', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Get_INDUSTRY_Dashboard', $parameters = array($request));
 
});

Route::post('get_industry_challenge', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Get_INDUSTRY_Challenge', $parameters = array($request));
 
});

Route::post('get_industry_internship', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Get_INDUSTRY_Internship', $parameters = array($request));
 
});

Route::post('get_company_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Get_Company_Detail', $parameters = array($request));
 
});

Route::post('update_company_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Update_Company_Detail', $parameters = array($request));
 
});

Route::post('edit_challenge', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Edit_Challenge', $parameters = array($request));
 
});

Route::post('edit_internship', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Edit_Internship', $parameters = array($request));
 
});

Route::post('check_self_signed_nda', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('check_self_signed_nda', $parameters = array($request));
 
});

Route::post('agree_guidline', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('agree_guidline', $parameters = array($request));
 
});

Route::post('get_agree_guidline', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('get_agree_guidline', $parameters = array($request));
 
});

Route::get('fill_data', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Fill_Data', $parameters = array($request));
 
});

Route::post('generate_nda_pdf', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('generate_nda_pdf', $parameters = array($request));
 
});

Route::post('generate_job_pdf', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('generate_job_pdf', $parameters = array($request));
 
});

Route::post('get_comments_my_jobs', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('Get_Comments_My_Jobs', $parameters = array($request));
 
});

Route::post('check_company_status', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\MainController');
	return $controller->callAction('check_company_status', $parameters = array($request));
 
});




Route::post('get_cnam_dashboard', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\KAUST\MainController');
	return $controller->callAction('Get_KAUST_Dashboard', $parameters = array($request));
 
});

Route::post('get_cnam_challenge', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\KAUST\MainController');
	return $controller->callAction('Get_KAUST_Challenge', $parameters = array($request));
 
});

Route::post('get_cnam_internship', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\KAUST\MainController');
	return $controller->callAction('Get_KAUST_Internship', $parameters = array($request));
 
});




//Admin

Route::post('restore_password', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Restore_Password', $parameters = array($request));
 
});

Route::post('get_user_info_company', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_User_Info_Company', $parameters = array($request));
 
});

Route::post('upload_nda', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('upload_nda', $parameters = array($request));
 
});

Route::post('get_admin_dashboard', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('get_admin_dashboard', $parameters = array($request));
 
});

Route::post('get_admin_statistics', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('get_admin_statistics', $parameters = array($request));
 
});

Route::post('get_admin_statistics_details', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('get_admin_statistics_details', $parameters = array($request));
 
});

Route::post('get_cnam_talents', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('get_kaust_talents', $parameters = array($request));
 
});

Route::post('respond_challenge', function (Illuminate\Http\Request $request) {
	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('respond_challenge', $parameters = array($request));
});

Route::post('get_users_by_industry_id', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Users_By_Industry_Id', $parameters = array($request));
 
});

Route::post('get_documents_by_industry_id', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Documents_By_Industry_Id', $parameters = array($request));
 
});

Route::post('check_user_activation_token', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Check_User_Activation_Token', $parameters = array($request));
 
});

Route::post('get_jobs_by_industry_id', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Jobs_By_Industry_Id', $parameters = array($request));
 
});

Route::post('get_discussion_by_job_id', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Discussion_By_Job_Id', $parameters = array($request));
 
});

Route::post('get_all_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_All_Industry', $parameters = array($request));
 
});

Route::post('get_all_users', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_All_Users', $parameters = array($request));
 
});

Route::post('admin_add_new_user', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Admin_Add_New_User', $parameters = array($request));
 
});

Route::post('get_user_posted_job', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_User_Posted_Job', $parameters = array($request));
 
});

Route::post('assign_challenge', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Assign_Job', $parameters = array($request));
 
});

Route::post('get_all_documents', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_All_Documents', $parameters = array($request));
 
});

Route::post('delete_document', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Delete_Document', $parameters = array($request));
 
});

Route::post('deactivate_user', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('deactivate_user', $parameters = array($request));
 
});

Route::post('get_admin_user_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Admin_User_Detail', $parameters = array($request));
 
});

Route::post('admin_update_user_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Update_User_Detail', $parameters = array($request));
 
});

Route::post('get_admin_company_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Company_Detail', $parameters = array($request));
 
});

Route::post('admin_update_company', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Admin_Update_Company', $parameters = array($request));
 
});

Route::post('get_admin_notifications', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Admin_Notifications', $parameters = array($request));
 
});

Route::post('admin_export_jobs', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('admin_export_jobs', $parameters = array($request));
 
});

Route::post('get_jobs_by_admin', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('get_jobs_by_admin', $parameters = array($request));
 
});

Route::post('get_mailchimp_lists', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Mailchimp_Lists', $parameters = array($request));
 
});

Route::post('send_newsletter', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\Functions');
	return $controller->callAction('send_newsletter', $parameters = array($request));
 
});

Route::get('get_campaigns', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\Functions');
	return $controller->callAction('getCampaigns', $parameters = array($request));
 
});

Route::post('export_jobs', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_jobs', $parameters = array($request));
 
});

Route::post('export_custom_challenges', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_custom_challenges', $parameters = array($request));
 
});

Route::post('export_custom_internships', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_custom_internships', $parameters = array($request));
 
});

Route::post('export_user', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_users', $parameters = array($request));
 
});

Route::post('export_custom_users', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_custom_users', $parameters = array($request));
 
});

Route::post('export_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_industry', $parameters = array($request));
 
});

Route::post('export_industry_users', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_industry_users', $parameters = array($request));
 
});

Route::post('export_all_industry_users', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_all_industry_users', $parameters = array($request));
 
});

Route::post('export_dashboard', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_dashboard', $parameters = array($request));
 
});

Route::post('emails_filtering', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('emails_filtering', $parameters = array($request));
 
});

Route::post('re_post_comment', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Re_Post_Comment', $parameters = array($request));
 
});

Route::post('get_inactive_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Get_Inactive_industry', $parameters = array($request));
 
});

Route::post('activate_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('Activate_Industry', $parameters = array($request));
 
});

Route::post('view_timeline', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('View_Timeline', $parameters = array($request));
 
});

Route::post('update_summary_value', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('update_summary_value', $parameters = array($request));
 
});


Route::post('export_user_log', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_user_log', $parameters = array($request));
 
});

Route::post('export_contact', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_contact', $parameters = array($request));
 
});

Route::post('export_requests', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_requests', $parameters = array($request));
 
});

Route::post('export_industry_log', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_industry_log', $parameters = array($request));
 
});

Route::post('export_custom_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('export_custom_industry', $parameters = array($request));
 
});

Route::post('change_user_email', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('change_user_email', $parameters = array($request));
 
});

Route::post('reply_to_email', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('reply_to_email', $parameters = array($request));
 
});

Route::post('contact_industry', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\ADMIN\MainController');
	return $controller->callAction('contact_industry', $parameters = array($request));
 
});


//ADMIN MANAGE WEBSITE

Route::post('get_all_notification_template', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Notification_Template', $parameters = array($request));
 
});

Route::post('get_notification_template_by_id', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_Notification_Template_By_Id', $parameters = array($request));
 
});

Route::post('edit_notification_template', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Edit_Notification_Template', $parameters = array($request));
 
});

Route::post('get_media_details', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('get_media_details', $parameters = array($request));
 
});

Route::post('get_news', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_news', $parameters = array($request));
 
});

Route::post('get_events', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_events', $parameters = array($request));
 
});

Route::post('get_success_stories', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_success', $parameters = array($request));
 
});

Route::post('get_photos', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_photos', $parameters = array($request));
 
});

Route::post('get_videos', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_videos', $parameters = array($request));
 
});

Route::post('add_new_media', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Add_New_Media', $parameters = array($request));
 
});

Route::post('delete_media', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Delete_Media', $parameters = array($request));
 
});

Route::post('update_media', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Media', $parameters = array($request));
 
});

Route::post('get_all_testimonials', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Testimonials', $parameters = array($request));
 
});

Route::post('add_new_testimonials', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Add_New_Testimonials', $parameters = array($request));
 
});

Route::post('delete_testimonials', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Delete_Testimonials', $parameters = array($request));
 
});

Route::post('update_testimonials', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Testimonials', $parameters = array($request));
 
});

Route::post('get_request_forms', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Contact_Forms', $parameters = array($request));
 
});

Route::post('get_contact_forms', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_Contact_Forms', $parameters = array($request));
 
});

Route::post('view_request_form', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('View_Request_Form', $parameters = array($request));
 
});

Route::post('view_contact_form', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('View_Contact_Form', $parameters = array($request));
 
});

Route::post('get_footer', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_Footer', $parameters = array($request));
 
});

Route::post('update_footer', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Footer', $parameters = array($request));
 
});

Route::post('get_all_pages', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Pages', $parameters = array($request));
 
});

Route::post('admin_get_page_component', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Admin_Get_Page_Component', $parameters = array($request));
 
});

Route::post('update_page_component', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Page_Component', $parameters = array($request));
 
});

Route::post('get_mailchimp_settings', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('get_mailchimp_settings', $parameters = array($request));
 
});

Route::post('update_mailchimp_settings', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('update_mailchimp_settings', $parameters = array($request));
 
});

Route::post('upload_manage_image', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('upload_manage_image', $parameters = array($request));
 
});

Route::post('get_all_sliders', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Sliders', $parameters = array($request));
 
});

Route::post('add_new_slider', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Add_New_Slider', $parameters = array($request));
 
});

Route::post('delete_slider', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Delete_Slider', $parameters = array($request));
 
});

Route::post('update_slider', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Slider', $parameters = array($request));
 
});

Route::post('get_join_icons', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('get_join_icons', $parameters = array($request));
 
});

Route::post('add_join_icons', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('add_join_icons', $parameters = array($request));
 
});

Route::post('update_join_icons', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('update_join_icons', $parameters = array($request));
 
});

Route::post('delete_join_icons', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('delete_join_icons', $parameters = array($request));
 
});

Route::post('change_row_status', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('change_row_status', $parameters = array($request));
 
});

Route::post('get_component_detail', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('get_component_detail', $parameters = array($request));
 
});

Route::post('get_all_social', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Get_All_Social', $parameters = array($request));
 
});

Route::post('add_new_social', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Add_New_Social', $parameters = array($request));
 
});

Route::post('delete_social', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Delete_Social', $parameters = array($request));
 
});

Route::post('update_social', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MANAGE_WEBSITE\MainController');
	return $controller->callAction('Update_Social', $parameters = array($request));
 
});

//WEBSITE BUILDER

Route::post('get_page_component', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\WEBSITE_BUILDER\MainController');
	return $controller->callAction('Get_Page_Component', $parameters = array($request));
 
});

Route::post('get_media', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\WEBSITE_BUILDER\MainController');
	return $controller->callAction('Get_Media', $parameters = array($request));
 
});



//DATABASE EXPORT CONTROLLER
Route::get('export_database', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\DATABASE_EXPORT\MainController');
	return $controller->callAction('export_database', $parameters = array($request));
 
});
