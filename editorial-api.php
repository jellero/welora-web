<?php
declare(strict_types=1);
require __DIR__.'/lib/editorial-store.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
function reply(int $status,array $body): never { http_response_code($status);echo json_encode($body,JSON_UNESCAPED_UNICODE|JSON_THROW_ON_ERROR);exit; }
if(!ed_runner_auth())reply(401,['error'=>'Unauthorized']);
try{
    $db=ed_db();
    if($_SERVER['REQUEST_METHOD']==='GET'){
        $id=$_GET['id']??null;
        if(is_string($id)){ $row=ed_get($db,$id);reply($row?200:404,$row?['episode'=>$row,'assets'=>ed_asset_manifest($row)]:['error'=>'Not found']); }
        reply(200,['episodes'=>ed_list($db)]);
    }
    if($_SERVER['REQUEST_METHOD']!=='POST')reply(405,['error'=>'Method not allowed']);
    if(!str_starts_with(strtolower($_SERVER['CONTENT_TYPE']??''),'application/json'))reply(415,['error'=>'JSON required']);
    $body=file_get_contents('php://input',false,null,0,262145);
    if($body===false||strlen($body)>262144)reply(413,['error'=>'Request too large']);
    $v=json_decode($body,true,32,JSON_THROW_ON_ERROR);if(!is_array($v))reply(400,['error'=>'Invalid JSON']);
    $row=match($v['action']??''){ 'save_draft'=>ed_save($db,$v),'record_schedule'=>ed_schedule($db,$v),default=>throw new InvalidArgumentException('Unknown action') };
    reply(200,['episode'=>$row,'canonical'=>ed_url($row)]);
}catch(InvalidArgumentException|JsonException $e){reply(400,['error'=>$e->getMessage()]);}
catch(LogicException $e){reply(409,['error'=>$e->getMessage()]);}
catch(Throwable $e){error_log('[Welora editorial] '.get_class($e));reply(503,['error'=>'Editorial service unavailable']);}
