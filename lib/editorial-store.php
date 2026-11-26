<?php
declare(strict_types=1);

/** Editorial storage. Configuration and data must live outside the document root. */
function ed_config(): array {
    $file = dirname(__DIR__, 2) . '/welora-editorial-config.php';
    if (!is_file($file)) return [];
    $config = require $file;
    return is_array($config) ? $config : [];
}
function ed_db(): PDO {
    $c = ed_config();
    $dir = realpath((string)($c['storage_dir'] ?? ''));
    $root = realpath(dirname(__DIR__));
    if (!$dir || !$root || $dir === $root || str_starts_with($dir, $root . DIRECTORY_SEPARATOR) || !is_dir($dir) || !is_writable($dir)) {
        throw new RuntimeException('Editorial storage not configured');
    }
    $db = new PDO('sqlite:' . $dir . '/editorial.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $db->exec('PRAGMA busy_timeout=5000');
    $db->exec("CREATE TABLE IF NOT EXISTS episodes (
        id TEXT PRIMARY KEY, track TEXT NOT NULL, slug TEXT NOT NULL, title TEXT NOT NULL,
        subtitle TEXT NOT NULL, content_html TEXT NOT NULL, publish_at INTEGER NOT NULL,
        next_title TEXT NOT NULL DEFAULT '', next_at INTEGER, youtube_text TEXT NOT NULL DEFAULT '',
        facebook_text TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT 'draft',
        youtube_id TEXT, facebook_id TEXT, facebook_url TEXT,
        revision INTEGER NOT NULL DEFAULT 1, updated_at INTEGER NOT NULL,
        UNIQUE(track,slug), CHECK(state IN ('draft','approved','scheduled'))
    )");
    return $db;
}
function ed_escape(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function ed_text(mixed $v, int $max, bool $required=false): string {
    if (!is_string($v) || strlen($v) > $max || !preg_match('//u', $v)) throw new InvalidArgumentException('Invalid text');
    $v = trim($v);
    if ($required && $v === '') throw new InvalidArgumentException('Missing required field');
    return $v;
}
function ed_time(mixed $v): int {
    if (!is_string($v) || !preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/D', $v)) throw new InvalidArgumentException('Use ISO 8601 with timezone');
    $d = new DateTimeImmutable($v);
    if (DateTimeImmutable::getLastErrors() !== false) throw new InvalidArgumentException('Invalid date');
    return $d->getTimestamp();
}
function ed_local(int $timestamp): string { return (new DateTimeImmutable('@'.$timestamp))->setTimezone(new DateTimeZone('Europe/Rome'))->format('d/m/Y H:i'); }
function ed_url(array $row): string { return 'https://www.welora.it/'.($row['track']==='informativa'?'guide':'academy').'/'.$row['slug']; }
function ed_clean_html(string $html): string {
    if (!class_exists(DOMDocument::class)) throw new RuntimeException('PHP DOM extension required');
    $doc = new DOMDocument('1.0','UTF-8');
    $old = libxml_use_internal_errors(true);
    try { $doc->loadHTML('<?xml encoding="UTF-8"><html><body>'.$html.'</body></html>', LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING); }
    finally { libxml_clear_errors(); libxml_use_internal_errors($old); }
    $allowed = ['p','h2','h3','h4','ul','ol','li','strong','em','blockquote','code','pre','table','thead','tbody','tr','th','td','a','br','hr','figure','figcaption'];
    $render = function(DOMNode $n) use (&$render,$allowed): string {
        if ($n instanceof DOMText) return ed_escape($n->nodeValue ?? '');
        if (!($n instanceof DOMElement)) return '';
        $tag = strtolower($n->tagName);
        if (in_array($tag,['script','style','iframe','object','embed','svg','math','template','form'],true)) return '';
        $inside = ''; foreach($n->childNodes as $child) $inside .= $render($child);
        if (!in_array($tag,$allowed,true)) return $inside;
        if ($tag === 'br' || $tag === 'hr') return '<'.$tag.'>';
        $attrs = '';
        if ($tag === 'a') {
            $href = trim($n->getAttribute('href'));
            if (preg_match('~^(https://[^\s]+|/(?!/)[a-zA-Z0-9_./#?=&%+-]*|#[a-zA-Z0-9_-]+)$~D',$href) && !str_contains($href,'\\')) $attrs = ' href="'.ed_escape($href).'" rel="noopener noreferrer"';
        }
        return '<'.$tag.$attrs.'>'.$inside.'</'.$tag.'>';
    };
    $body = $doc->getElementsByTagName('body')->item(0);
    $out=''; if($body) foreach($body->childNodes as $node) $out .= $render($node);
    return $out;
}
function ed_get(PDO $db,string $id): ?array {
    $s=$db->prepare('SELECT * FROM episodes WHERE id=?');$s->execute([$id]);return $s->fetch() ?: null;
}
function ed_list(PDO $db,bool $public=false): array {
    $s=$db->prepare('SELECT * FROM episodes'.($public?" WHERE state='scheduled' AND publish_at<=?":"").' ORDER BY publish_at,id');
    $s->execute($public?[time()]:[]);return $s->fetchAll();
}
function ed_save(PDO $db,array $v): array {
    $id=ed_text($v['id']??null,40,true); $slug=ed_text($v['slug']??null,100,true);
    $track=ed_text($v['track']??null,20,true);
    if(!preg_match('/^[A-Za-z0-9_-]+$/D',$id)||!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D',$slug)||!in_array($track,['operativa','informativa'],true)) throw new InvalidArgumentException('Invalid identity');
    if($track==='informativa' && $slug==='pms-channel-manager-booking-engine') throw new InvalidArgumentException('Reserved existing article slug');
    $html=ed_clean_html(ed_text($v['content_html']??null,200000,true));
    if(trim(strip_tags($html))==='') throw new InvalidArgumentException('Missing article content');
    $data=['id'=>$id,'track'=>$track,'slug'=>$slug,'title'=>ed_text($v['title']??null,220,true),'subtitle'=>ed_text($v['subtitle']??'',500),'content_html'=>$html,'publish_at'=>ed_time($v['publish_at']??null),'next_title'=>ed_text($v['next_title']??'',220),'next_at'=>empty($v['next_at'])?null:ed_time($v['next_at']),'youtube_text'=>ed_text($v['youtube_text']??'',5000),'facebook_text'=>ed_text($v['facebook_text']??'',12000),'updated_at'=>time()];
    if(($data['next_title']==='')!==($data['next_at']===null) || ($data['next_at']!==null && $data['next_at']<=$data['publish_at'])) throw new InvalidArgumentException('Invalid next episode');
    $old=ed_get($db,$id);
    if($old){
        if($old['state']!=='draft') throw new LogicException('Only drafts can be edited');
        if(!isset($v['revision']) || (int)$v['revision']!==(int)$old['revision']) throw new LogicException('Revision conflict');
        if($old['track']!==$track||$old['slug']!==$slug) throw new LogicException('Episode URL is immutable');
        $data['expected']=(int)$old['revision'];
        $s=$db->prepare("UPDATE episodes SET track=:track,slug=:slug,title=:title,subtitle=:subtitle,content_html=:content_html,publish_at=:publish_at,next_title=:next_title,next_at=:next_at,youtube_text=:youtube_text,facebook_text=:facebook_text,updated_at=:updated_at,revision=revision+1 WHERE id=:id AND state='draft' AND revision=:expected");
    }else{
        $s=$db->prepare('INSERT INTO episodes ('.implode(',',array_keys($data)).') VALUES (:'.implode(',:',array_keys($data)).')');
    }
    $s->execute($data); if($s->rowCount()!==1)throw new LogicException('Revision conflict');
    return ed_get($db,$id);
}
function ed_approve(PDO $db,string $id,int $revision): array {
    $s=$db->prepare("UPDATE episodes SET state='approved',revision=revision+1,updated_at=? WHERE id=? AND revision=? AND state='draft' AND publish_at>?");
    $now=time();$s->execute([$now,$id,$revision,$now]);
    if($s->rowCount()!==1)throw new LogicException('Draft changed, missing or date not future');
    return ed_get($db,$id);
}
/** Runner records provider-confirmed schedules only after successful read-back. */
function ed_schedule(PDO $db,array $v): array {
    $id=ed_text($v['id']??null,40,true);$old=ed_get($db,$id);
    if(!$old||$old['state']!=='approved'||(int)($v['revision']??0)!==(int)$old['revision'])throw new LogicException('Approval or revision missing');
    $yt=ed_text($v['youtube_id']??null,50,true);$fb=ed_text($v['facebook_id']??null,100,true);$url=ed_text($v['facebook_url']??null,1000,true);
    $parts=parse_url($url);
    if(!preg_match('/^[A-Za-z0-9_-]{11}$/D',$yt)||!preg_match('/^[0-9_]+$/D',$fb)||!is_array($parts)||($parts['scheme']??'')!=='https'||!in_array(strtolower($parts['host']??''),['facebook.com','www.facebook.com','fb.watch'],true)||isset($parts['user'])||isset($parts['pass']))throw new InvalidArgumentException('Invalid social receipt');
    if(ed_time($v['youtube_publish_at']??null)!==(int)$old['publish_at']||ed_time($v['facebook_publish_at']??null)!==(int)$old['publish_at']||(int)$old['publish_at']<=time())throw new LogicException('Schedule mismatch or date elapsed');
    $s=$db->prepare("UPDATE episodes SET state='scheduled',youtube_id=?,facebook_id=?,facebook_url=?,revision=revision+1,updated_at=? WHERE id=? AND revision=? AND state='approved'");
    $s->execute([$yt,$fb,$url,time(),$id,$old['revision']]);if($s->rowCount()!==1)throw new LogicException('Revision conflict');
    return ed_get($db,$id);
}
