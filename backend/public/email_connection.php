<?php
/* connect to gmail 
$hostname = '{imap.gmail.com:993/imap/ssl}INBOX';
$username = 'kaust.test.sa@gmail.com';
$password = 'sauce-9_7%w-(T8.';


$inbox = imap_open($hostname,$username ,$password) or die('Cannot connect to Gmail: ' . imap_last_error());


$emails = imap_search($inbox,'ALL');


if($emails) {


    $output = '';

   

echo"<h1>My Gmail Emails:</h1>";

    
    foreach($emails as $email_number) {


        $overview = imap_fetch_overview($inbox,$email_number,0);
        $body = imap_fetchbody($inbox, $email_number,0,0);
        print_r($body);
        echo"<br><br><br><br><br><br>";
        $output.= 'Name:  '.$overview[0]->from.'</br>';
        $output.= 'Number:  '.$email_number.'</br>';
        $output.= 'Email:  '.$overview[0]->message_id.'</br>';
        $output.= 'Subject:  '.$overview[0]->subject.'</br>';
        $output.= 'Message Body:'.$body."<br><br><br><br>";
    }

    echo $output;
} 


imap_close($inbox);
?>



 <?php
         //Establishing connection
         $url = "{imap.gmail.com:993/imap/ssl}INBOX";
         $id = "kaust.test.sa@gmail.com";
         $pwd = "sauce-9_7%w-(T8.";
         $imap = imap_open($url, $id, $pwd);
        
		
         
    
         //Closing the connection
         imap_close($imap);   */
      ?>
      
      
      
      <?php

//The location of the mailbox.
$mailbox = '{imap.gmail.com:993/imap/ssl}INBOX';
//The username / email address that we want to login to.
$username = 'kaust.test.sa@gmail.com';
//The password for this email address.
$password = 'sauce-9_7%w-(T8.';

//Attempt to connect using the imap_open function.
$imapResource = imap_open($mailbox, $username, $password);

//If the imap_open function returns a boolean FALSE value,
//then we failed to connect.
if($imapResource === false){
    //If it failed, throw an exception that contains
    //the last imap error.
    throw new Exception(imap_last_error());
}

//If we get to this point, it means that we have successfully
//connected to our mailbox via IMAP.

//Lets get all emails that were received since a given date.
$search = 'SINCE "' . date("j F Y", strtotime("-100 days")) . '"';
$emails = imap_search($imapResource, $search);

//If the $emails variable is not a boolean FALSE value or
//an empty array.
if(!empty($emails)){
    //Loop through the emails.
    foreach($emails as $email){
        //Fetch an overview of the email.
        $overview = imap_fetch_overview($imapResource, $email);
        $overview = $overview[0];
        //Print out the subject of the email.
        echo '<b>' . htmlentities($overview->subject) . '</b><br>';
        //Print out the sender's email address / from email address.
        echo 'From: ' . $overview->from . '<br><br>';
        //Get the body of the email.
        $message = imap_fetchbody($imapResource, $email, 1, FT_PEEK);
        print($message);echo '<br><br><br><br><br><br><br><br><br><br><br><br>';
    }
}






?>







