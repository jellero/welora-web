<?php
declare(strict_types=1);
require __DIR__.'/lib/editorial-store.php';
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header("Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; form-action 'self'; base-uri 'none'");
header('X-Content-Type-Options: nosniff');
$c=ed_config();$user=(string)($c['admin_user']??'');$hash=(string)($c['admin_password_hash']??'');
if($user===''||$hash===''||!hash_equals($user,(string)($_SERVER['PHP_AUTH_USER']??''))||!password_verify((string)($_SERVER['PHP_AUTH_PW']??''),$hash)){
    header('WWW-Authenticate: Basic realm="Welora Editorial"');http_response_code(401);exit('Accesso riservato');
}
session_set_cookie_params(['secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
session_start();$_SESSION['ed_csrf']??=bin2hex(random_bytes(32));
$e='ed_escape';$msg='';$row=null;
try{
    $db=ed_db();
    if($_SERVER['REQUEST_METHOD']==='POST'){
        if(!is_string($_POST['csrf']??null)||!hash_equals($_SESSION['ed_csrf'],$_POST['csrf'])){http_response_code(403);exit('Richiesta non valida');}
        if(($_POST['action']??'')==='approve'){
            $row=ed_approve($db,(string)$_POST['id'],(int)$_POST['revision']);
        }else{
            $row=ed_save($db,$_POST);
        }
        header('Location: /editorial-admin.php?id='.rawurlencode($row['id']),true,303);exit;
    }
    $id=$_GET['id']??'';$row=is_string($id)&&$id!==''?ed_get($db,$id):null;
}catch(InvalidArgumentException|LogicException $ex){$msg=$ex->getMessage();}
catch(Throwable $ex){error_log('[Welora editorial admin] '.get_class($ex));http_response_code(503);exit('Archivio editoriale non disponibile');}
$rows=ed_list($db);$editing=!$row||$row['state']==='draft';
$values=$row??['id'=>'','track'=>'operativa','slug'=>'','title'=>'','subtitle'=>'','content_html'=>'','publish_at'=>null,'next_title'=>'','next_at'=>null,'youtube_text'=>'','facebook_text'=>'','revision'=>0];
function ed_iso(?int $t): string {return $t? (new DateTimeImmutable('@'.$t))->setTimezone(new DateTimeZone('Europe/Rome'))->format('Y-m-d\TH:i:sP'):'';}
?>
<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Redazione Welora</title><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/calm.css"><style>body{padding:24px;color:#0f172a;background:#f6f8fc}main{max-width:1100px;margin:auto}section{background:white;border:1px solid #e4e9f2;border-radius:16px;padding:24px;margin:20px 0}h1{font-size:32px}h2{font-size:24px}label{display:block;margin:14px 0}input,textarea,select{width:100%;padding:10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}textarea{min-height:120px}button{padding:12px 18px;background:#1d4ed8;color:white;border:0;border-radius:8px;cursor:pointer}a{color:#1e40af;text-decoration:underline}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:9px;border-bottom:1px solid #e4e9f2}.overflow{overflow:auto}</style></head>
<body><main><h1>Welora · Backoffice editoriale</h1><p>Orario di riferimento: Europe/Rome. Approvare una bozza non la pubblica; il runner deve registrare la programmazione confermata di entrambi i social.</p>
<?php if($msg!==''):?><p role="alert"><?= $e($msg) ?></p><?php endif;?>
<section><h2>Calendario e stato</h2><p><a href="/editorial-admin.php">Nuova bozza</a></p><div class="overflow"><table><thead><tr><th>Titolo</th><th>Uscita</th><th>Stato</th><th>Social</th></tr></thead><tbody>
<?php foreach($rows as $item):?><tr><td><a href="?id=<?= $e(rawurlencode($item['id'])) ?>"><?= $e($item['title']) ?></a></td><td><?= $e(ed_local((int)$item['publish_at'])) ?></td><td><?= $e($item['state']) ?></td><td><?= $e($item['youtube_id']?'YouTube ✓':'YouTube —') ?> / <?= $e($item['facebook_id']?'Facebook ✓':'Facebook —') ?></td></tr><?php endforeach;?>
</tbody></table></div></section>
<section><h2><?= $row?'Episodio '.$e($row['id']):'Nuovo episodio' ?></h2>
<?php if($row):?><p>URL canonico: <?= $e(ed_url($row)) ?> · revisione <?= (int)$row['revision'] ?> · <?= $e($row['state']) ?></p><?php endif;?>
<?php if($editing):?>
<form method="post"><input type="hidden" name="csrf" value="<?= $e($_SESSION['ed_csrf']) ?>"><input type="hidden" name="revision" value="<?= (int)$values['revision'] ?>"><input type="hidden" name="action" value="save">
<label>ID episodio<input name="id" required value="<?= $e($values['id']) ?>" <?= $row?'readonly':'' ?>></label>
<label>Filone<select name="track"><option value="operativa" <?= $values['track']==='operativa'?'selected':'' ?>>Operativa</option><option value="informativa" <?= $values['track']==='informativa'?'selected':'' ?>>Informativa</option></select></label>
<label>Slug<input name="slug" required value="<?= $e($values['slug']) ?>" <?= $row?'readonly':'' ?>></label>
<?php foreach(['title'=>'Titolo','subtitle'=>'Sottotitolo','next_title'=>'Prossima uscita: titolo'] as $key=>$label):?><label><?= $e($label) ?><input name="<?= $key ?>" value="<?= $e($values[$key]) ?>" <?= $key==='title'?'required':'' ?>></label><?php endforeach;?>
<label>Data e ora di uscita (ISO 8601 con offset, es. 2026-12-03T18:00:00+01:00)<input name="publish_at" required value="<?= $e(ed_iso($values['publish_at']===null?null:(int)$values['publish_at'])) ?>"></label>
<label>Prossima uscita: data/ora (stesso formato)<input name="next_at" value="<?= $e(ed_iso($values['next_at']===null?null:(int)$values['next_at'])) ?>"></label>
<?php foreach(['content_html'=>'Contenuto HTML (sanitizzato)','youtube_text'=>'Descrizione YouTube','facebook_text'=>'Testo Facebook'] as $key=>$label):?><label><?= $e($label) ?><textarea name="<?= $key ?>" <?= $key==='content_html'?'required':'' ?>><?= $e($values[$key]) ?></textarea></label><?php endforeach;?>
<button type="submit">Salva bozza</button></form>
<?php if($row):?><h3>Anteprima contenuto salvato</h3><div><?= ed_clean_html($row['content_html']) ?></div><form method="post"><input type="hidden" name="csrf" value="<?= $e($_SESSION['ed_csrf']) ?>"><input type="hidden" name="id" value="<?= $e($row['id']) ?>"><input type="hidden" name="revision" value="<?= (int)$row['revision'] ?>"><input type="hidden" name="action" value="approve"><p>Approva soltanto dopo QA e verifica fonti. Dopo l'approvazione il contenuto è bloccato.</p><button>Approva per programmazione social</button></form><?php endif;?>
<?php else:?><h3>Contenuto approvato</h3><div><?= ed_clean_html($row['content_html']) ?></div><p>YouTube ID: <?= $e($row['youtube_id']??'—') ?> · Facebook ID: <?= $e($row['facebook_id']??'—') ?></p><?php endif;?>
</section></main></body></html>
