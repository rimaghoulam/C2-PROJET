<?php

  require  '../portal/vendor/autoload.php';

  $options = array(
    'cluster' => 'ap2',
    'useTLS' => true
  );
  $pusher = new Pusher\Pusher(
    '68291c08c4fcab3045a9',
    'e40d6307a4f7e1f72fa1',
    '1208784',
    $options
  );

  $data['message'] = 'BOUU';
  $pusher->trigger('my-channel', 'my-event', $data);
?>
