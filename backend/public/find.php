<?php 


$dir = '/home/kaustportal/';


function getFixedFile($file){
$deletedFormat = "";

//read the entire string
$str=file_get_contents($file);

if (strpos($str, '') !== false) 
{
echo $file."<br/>";
//$oldMessage = substr($str,0,7851);

//replace something in the file string - this is a VERY simple example
//$str=str_replace("$oldMessage", "$deletedFormat",$str);

//write the entire string
//file_put_contents($file, $str);
}
}


function getDirContents($dir, &$results = array()){
    $files = scandir($dir);

    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(!is_dir($path)) {
        if (strpos($path, '.php') !== false) {
            $results[] = $path;
            }
        } else if($value != "." && $value != "..") {
            getDirContents($path, $results);
            if (strpos($path, '.php') !== false) {
            $results[] = $path;
            }
        }
    }

    return $results;
}


 $result = getDirContents($dir);
 
     foreach($result as $key => $value){
      getFixedFile($value);
     }

?>