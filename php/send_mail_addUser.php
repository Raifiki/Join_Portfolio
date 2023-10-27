<?php

########### CONFIG ###############

$recipient = $_POST['Email'];
$redirect = '../index.html';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################



###############################
#
#        DON'T CHANGE ANYTHING FROM HERE!
#
#        Ab hier nichts mehr ändern!
#
###############################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $subject = "Welcom to Join - You Signed Up Successfully";
        $subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
        $headers = array(
            "MIME-Version" => "1.0",
            "Content-type" => "text/plain; charset=UTF-8",
            "From" => "noreply@developerakademie.com",
        );
        $text = $_POST['message']  ."\n\n" . "eMail Adresse: " . $_POST['email'];
        $text = "Dear ".$_POST['Name'].", \n\n 
        Welcome to Join! We are delighted to have you as a new member of our community.\n\n 
        Your account has been successfully created and is now ready to use. You can log in and start using our Kanban tool right away.\n\n 
        Thank you once again for placing your trust in Join. We are confident that you will find our tool to be a valuable asset to your productivity.\n\n 
        Best regards,\n
        Your Join Team";

        mail($recipient, $subject, $text, $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
