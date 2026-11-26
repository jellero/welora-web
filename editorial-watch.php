<?php
declare(strict_types=1);
require __DIR__.'/lib/editorial-store.php';
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
header('X-Content-Type-Options: nosniff');
function unavailable(): never {http_response_code(404);exit('Non disponibile');}
if(!in_array($_SERVER['REQUEST_METHOD'],['GET','HEAD'],true)){http_response_code(405);exit;}
$id=$_GET['id']??'';$asset=$_GET['asset']??'';
if(!is_string($id)||!is_string($asset)||!in_array($asset,['video.mp4','thumbnail.jpg','captions.vtt'],true))unavailable();
try {
    $db=ed_db();$row=ed_get($db,$id);
    if(!$row||$row['state']!=='scheduled'||(int)$row['publish_at']>time())unavailable();
    $c=ed_config();
    if($asset!=='thumbnail.jpg'&&($c['public_video_enabled']??false)!==true)unavailable();
    $path=ed_asset_dir($row).'/'.($asset==='captions.vtt'?'captions.srt':$asset);
    if(!is_file($path))unavailable();
    if($asset==='captions.vtt'){
        $s=file_get_contents($path);if($s===false||strlen($s)>2097152)unavailable();
        $s=preg_replace('/(\d{2}:\d{2}:\d{2}),(\d{3})/','$1.$2',str_replace("\r\n","\n",$s));
        $s="WEBVTT\n\n".$s;
        header('Content-Type: text/vtt; charset=utf-8');header('Content-Length: '.strlen($s));if($_SERVER['REQUEST_METHOD']==='GET')echo $s;exit;
    }
    $size=filesize($path);if(!$size)unavailable();
    $start=0;$end=$size-1;
    header('Content-Type: '.($asset==='video.mp4'?'video/mp4':'image/jpeg'));
    header('Accept-Ranges: bytes');
    if(isset($_SERVER['HTTP_RANGE'])){
        if(!preg_match('/^bytes=(\d*)-(\d*)$/D',$_SERVER['HTTP_RANGE'],$m)||($m[1]===''&&$m[2]==='')){http_response_code(416);header('Content-Range: bytes */'.$size);exit;}
        if($m[1]===''){$count=(int)$m[2];if($count<=0){http_response_code(416);header('Content-Range: bytes */'.$size);exit;}$start=max(0,$size-$count);}
        else{$start=(int)$m[1];if($m[2]!=='')$end=min($end,(int)$m[2]);}
        if($start>$end||$start>=$size){http_response_code(416);header('Content-Range: bytes */'.$size);exit;}
        http_response_code(206);header("Content-Range: bytes $start-$end/$size");
    }
    $remaining=$end-$start+1;header('Content-Length: '.$remaining);
    if($_SERVER['REQUEST_METHOD']==='HEAD')exit;
    $f=fopen($path,'rb');if(!$f)unavailable();
    fseek($f,$start);
    while($remaining>0&&!feof($f)&&!connection_aborted()){
        $chunk=fread($f,min(1048576,$remaining));if($chunk===false||$chunk==='')break;echo $chunk;$remaining-=strlen($chunk);
    }
    fclose($f);
}catch(Throwable $e){error_log('[Welora editorial watch] '.get_class($e));unavailable();}
