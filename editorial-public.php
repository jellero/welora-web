<?php
declare(strict_types=1);
require __DIR__.'/lib/editorial-store.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$view=$_GET['view']??'';$slug=$_GET['slug']??'';
$tracks=['academy'=>'operativa','guide'=>'informativa'];
$root=__DIR__;
if(!is_string($view)||(!isset($tracks[$view])&&!in_array($view,['risorse','sitemap'],true))){http_response_code(404);exit('Non trovato');}
try{$db=ed_db();$rows=ed_list($db,true);}catch(Throwable $e){$rows=[];}
if($view==='sitemap'){
    header('Content-Type: application/xml; charset=utf-8');
    $xml=file_get_contents($root.'/sitemap.xml');
    $extra='';foreach($rows as $row)$extra.='<url><loc>'.htmlspecialchars(ed_url($row),ENT_XML1,'UTF-8').'</loc></url>'."\n";
    echo str_replace('</urlset>',$extra.'</urlset>',$xml);exit;
}
if($slug===''){
    $file=$view==='risorse'?$root.'/risorse.html':$root.'/'.$view.'/index.html';
    $html=file_get_contents($file);
    $cards='';
    foreach(array_reverse($rows) as $row){
        if($view==='guide'&&$row['track']!=='informativa')continue;
        $cards.='<article class="card editorial-card"><span class="kicker">'.ed_escape($row['track']==='operativa'?'Academy operativa':'Academy informativa').'</span><h3>'.ed_escape($row['title']).'</h3><p>'.ed_escape($row['subtitle']).'</p><a class="editorial-link" href="'.ed_escape(ed_url($row)).'">Apri la guida →</a></article>';
    }
    if($cards!=='')$html=str_replace('</main>','<section class="page-section editorial-section"><div class="container"><div class="section-intro"><h2>Ultime uscite</h2></div><div class="card-grid">'.$cards.'</div></div></section></main>',$html);
    echo $html;exit;
}
if(!isset($tracks[$view])||!is_string($slug)||!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D',$slug)){http_response_code(404);exit('Non trovato');}
$row=null;foreach($rows as $r)if($r['track']===$tracks[$view]&&$r['slug']===$slug){$row=$r;break;}
if(!$row){http_response_code(404);header('X-Robots-Tag: noindex');exit('Guida non disponibile');}
$e='ed_escape';$base=file_get_contents($root.'/risorse.html');
$header=explode('<main id="main">',$base,2)[0];$footer=explode('</main>',$base,2)[1];
$title=$e($row['title']);$desc=$e($row['subtitle']);$url=$e(ed_url($row));
$header=preg_replace_callback('~<title>.*?</title>~s',fn()=>'<title>'.$title.' — Welora</title>',$header);
foreach(['name="description"'=>'description','property="og:description"'=>'description','property="og:title"'=>'title','property="og:url"'=>'url'] as $attr=>$key){
    $val=match($key){'description'=>$desc,'title'=>$title,default=>$url};
    $header=preg_replace_callback('~<meta '.preg_quote($attr,'~').' content="[^"]*">~',fn()=>'<meta '.$attr.' content="'.$val.'">',$header);
}
$header=preg_replace_callback('~<link rel="canonical" href="[^"]*">~',fn()=>'<link rel="canonical" href="'.$url.'">',$header);
$header=str_replace('property="og:type" content="website"','property="og:type" content="article"',$header);
$header=preg_replace('~<script type="application/ld\+json">.*?</script>~s','',$header);
$schema=['@context'=>'https://schema.org','@type'=>'Article','headline'=>$row['title'],'description'=>$row['subtitle'],'url'=>ed_url($row),'datePublished'=>gmdate('c',(int)$row['publish_at']),'author'=>['@type'=>'Organization','name'=>'Welora']];
$header=str_replace('</head>','<script type="application/ld+json">'.json_encode($schema,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_UNESCAPED_UNICODE).'</script></head>',$header);
echo $header;
?>
<main id="main"><nav class="container editorial-breadcrumb" aria-label="Percorso"><a href="/">Home</a> / <a href="/academy/">Welora Academy</a> / <span aria-current="page"><?= $title ?></span></nav>
<section class="page-hero editorial-hero"><div class="container"><div class="eyebrow"><?= $e($row['track']==='operativa'?'Academy operativa':'Academy informativa') ?></div><h1><?= $title ?></h1><p><?= $desc ?></p></div></section>
<section class="page-section editorial-section"><div class="container editorial-article-layout"><article class="editorial-article"><p class="editorial-meta">A cura di Welora · <?= $e(ed_local((int)$row['publish_at'])) ?></p><?php if((ed_config()['public_video_enabled']??false)===true):?><video controls preload="none" style="width:100%;height:auto;border-radius:12px" poster="/editorial-watch.php?id=<?= $e(rawurlencode($row['id'])) ?>&amp;asset=thumbnail.jpg"><source src="/editorial-watch.php?id=<?= $e(rawurlencode($row['id'])) ?>&amp;asset=video.mp4" type="video/mp4"><track kind="captions" srclang="it" label="Italiano" src="/editorial-watch.php?id=<?= $e(rawurlencode($row['id'])) ?>&amp;asset=captions.vtt" default></video><?php endif;?><?= ed_clean_html($row['content_html']) ?></article><aside class="card editorial-aside"><h2>Guarda e condividi</h2><a href="https://www.youtube.com/watch?v=<?= $e($row['youtube_id']) ?>" rel="noopener noreferrer" target="_blank">Guarda su YouTube</a><a href="<?= $e($row['facebook_url']) ?>" rel="noopener noreferrer" target="_blank">Guarda su Facebook</a><a href="/academy/">Tutte le uscite</a>
<?php if($row['next_title']&&$row['next_at']):?><hr><h3>Prossima uscita</h3><p><?= $e($row['next_title']) ?> · <?= $e(ed_local((int)$row['next_at'])) ?></p><?php endif;?></aside></div></section></main>
<?= $footer ?>
