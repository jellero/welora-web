<?php
declare(strict_types=1);
require __DIR__.'/lib/editorial-store.php';
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');
function media_reply(int $status,array $payload): never {http_response_code($status);header('Content-Type: application/json; charset=utf-8');echo json_encode($payload,JSON_UNESCAPED_UNICODE);exit;}
if(!ed_runner_auth())media_reply(401,['error'=>'Unauthorized']);
$names=['video.mp4'=>['video/mp4',1073741824],'thumbnail.jpg'=>['image/jpeg',2097152],'captions.srt'=>['text/plain',2097152]];
try{
    $db=ed_db();$id=$_REQUEST['id']??'';$name=$_REQUEST['name']??'';
    if(!is_string($id)||!is_string($name)||!isset($names[$name]))media_reply(400,['error'=>'Invalid asset']);
    $row=ed_get($db,$id);if(!$row)media_reply(404,['error'=>'Not found']);
    $dir=ed_asset_dir($row);$path=$dir.'/'.$name;
    if($_SERVER['REQUEST_METHOD']==='GET'){
        if(!is_file($path))media_reply(404,['error'=>'Not found']);
        header('Content-Type: '.$names[$name][0]);header('Content-Length: '.filesize($path));header('Content-Disposition: attachment; filename="'.$name.'"');readfile($path);exit;
    }
    if($_SERVER['REQUEST_METHOD']!=='POST')media_reply(405,['error'=>'Method not allowed']);
    $upload=$_FILES['file']??null;
    if(!is_array($upload)||($upload['error']??null)!==UPLOAD_ERR_OK||!is_uploaded_file($upload['tmp_name'])||$upload['size']<=0||$upload['size']>$names[$name][1])media_reply(400,['error'=>'Invalid file or PHP upload limit']);
    $tmp=$upload['tmp_name'];$mime=(new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    if($mime!==$names[$name][0])media_reply(400,['error'=>'Unexpected media type']);
    if($name==='captions.srt'&&!preg_match('//u',file_get_contents($tmp)))media_reply(400,['error'=>'Captions must be UTF-8']);
    $hash=hash_file('sha256',$tmp);
    if(!is_string($_POST['sha256']??null)||!hash_equals($hash,$_POST['sha256']))media_reply(400,['error'=>'Checksum mismatch']);
    $db->exec('BEGIN IMMEDIATE');
    try{
        $row=ed_get($db,$id);
        if($row['state']!=='draft'||(int)($_POST['revision']??0)!==(int)$row['revision'])throw new LogicException('Draft revision conflict');
        if(!is_dir($dir)&&!mkdir($dir,0700,true)&&!is_dir($dir))throw new RuntimeException('Media directory unavailable');
        $staged=$dir.'/.'.bin2hex(random_bytes(16));
        if(!move_uploaded_file($tmp,$staged))throw new RuntimeException('Upload failed');
        chmod($staged,0600);
        if(!rename($staged,$path)){unlink($staged);throw new RuntimeException('Upload failed');}
        $s=$db->prepare("UPDATE episodes SET revision=revision+1,updated_at=? WHERE id=? AND state='draft'");$s->execute([time(),$id]);
        $db->exec('COMMIT');
    }catch(Throwable $e){$db->exec('ROLLBACK');throw $e;}
    media_reply(200,['episode'=>ed_get($db,$id),'asset'=>['name'=>$name,'sha256'=>$hash,'bytes'=>filesize($path)]]);
}catch(LogicException $e){media_reply(409,['error'=>$e->getMessage()]);}
catch(Throwable $e){error_log('[Welora editorial media] '.get_class($e));media_reply(503,['error'=>'Media service unavailable']);}
