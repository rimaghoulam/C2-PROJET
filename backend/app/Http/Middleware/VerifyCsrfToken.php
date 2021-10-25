<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'api/check_login',
        'api/activate_account',
        'api/register_user',
        'api/forget_password',
        'api/update_password',
        'api/get_user_detail',
        'api/update_user_detail',
        'api/get_job_details_byid',
        'api/post_comment',
        'api/post_comment_notifications',
        'api/get_count_comments_by_jobid',
        'api/get_notifications',
        'api/get_job_discussion',
        'api/check_reset_token',
        'api/post_discussion_attachment',
        'api/change_password',
        'api/update_admin_new_user',
        'api/register_company',
        'api/upload_image',
        'api/post_challenge',
        'api/post_internship',
        'api/get_sme_dashboard',
        'api/get_sme_challenge',
        'api/get_sme_internship',
        'api/get_company_detail',
        'api/update_company_detail',
        'api/edit_challenge',
        'api/edit_internship',
        'api/check_self_signed_nda',
        'api/agree_guidline',
        'api/get_agree_guidline',
        'api/fill_data',
        'api/generate_nda_pdf',
        'api/generate_job_pdf',
        'api/get_comments_my_jobs',
        'api/get_kaust_dashboard',
        'api/get_kaust_challenge',
        'api/get_kaust_internship',
        'api/get_user_info_company',
        'api/upload_nda',
        'api/get_admin_dashboard',
        'api/get_admin_statistics',
        'api/get_kaust_talents',
        'api/respond_challenge',
        'api/get_users_by_sme_id',
        'api/get_documents_by_sme_id',
        'api/check_user_activation_token',
        'api/get_jobs_by_sme_id',
        'api/get_discussion_by_job_id',
        'api/get_all_smes',
        'api/get_all_users',
        'api/admin_add_new_user',
        'api/get_user_posted_job',
        'api/assign_challenge',
        'api/get_all_documents',
        'api/delete_document',
        'api/deactivate_user',
        'api/get_admin_user_detail',
        'api/admin_update_user_detail',
        'api/get_admin_company_detail',
        'api/admin_update_company',
        'api/get_admin_notifications',
        'api/admin_export_jobs',
        'api/get_jobs_by_admin',
        'api/get_mailchimp_lists',
        'api/send_newsletter',
        'api/get_campaigns',
        'api/export_jobs',
        'api/emails_filtering',
        
        
        
    ];
}
