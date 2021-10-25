<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|e
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('message', function () {
    $message = "Maroun";
    $success = event(new App\Events\NewMessage($message));
    return $success;
});
Route::view('/t', 't');
Route::view('/s', 's');

Route::view('/tt', 'tt');

Route::view('/email', 'email_template.email_template');
Route::view('/', 'email_template.email_template');


Route::get('e', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('tes', $parameters = array($request));
 
});


Route::get('test_word', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\INDUSTRY\Functions');
	return $controller->callAction('test_word', $parameters = array($request));
 
});

Route::get('/document/convert-word-to-pdf', 'DocumentController@convertWordToPDF')->name('document.wordtopdf');



Route::get('test_email', function (Illuminate\Http\Request $request) {

	$app = app();
	$controller = $app->make('App\Http\Controllers\MAIN\MainController');
	return $controller->callAction('test_email', $parameters = array($request));
 
});
