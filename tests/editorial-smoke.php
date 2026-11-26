<?php
declare(strict_types=1);
if(PHP_SAPI!=='cli'){http_response_code(404);exit;}
require dirname(__DIR__).'/lib/editorial-store.php';
function check(bool $ok,string $label): void {if(!$ok)throw new RuntimeException($label);echo "OK ".$label.PHP_EOL;}
function rejects(callable $f,string $label): void {try{$f();}catch(InvalidArgumentException|LogicException $e){check(true,$label);return;}throw new RuntimeException('Expected rejection: '.$label);}
check(ed_time('2026-12-03T18:00:00+01:00')===1796317200,'ISO offset conversion');
rejects(fn()=>ed_time('2026-02-31T12:00:00+01:00'),'reject invalid calendar date');
$san=ed_clean_html('<p onclick="alert(1)">Test <strong>Welora</strong><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="/guide/">safe</a><svg onload="alert(1)"></svg></p>');
check(str_contains($san,'<strong>Welora</strong>')&&!str_contains($san,'javascript:')&&!str_contains($san,'onclick')&&!str_contains($san,'<script')&&!str_contains($san,'<svg'),'sanitize active HTML');
check(str_contains($san,'href="/guide/"'),'preserve safe link');
$db=new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
$db->exec("CREATE TABLE episodes(id TEXT PRIMARY KEY,track TEXT,slug TEXT,title TEXT,subtitle TEXT,content_html TEXT,publish_at INTEGER,next_title TEXT,next_at INTEGER,youtube_text TEXT,facebook_text TEXT,state TEXT DEFAULT 'draft',youtube_id TEXT,facebook_id TEXT,facebook_url TEXT,revision INTEGER DEFAULT 1,updated_at INTEGER,UNIQUE(track,slug))");
$future=gmdate('Y-m-d\\TH:i:s\\Z',time()+7200);
$v=['id'=>'TEST001','track'=>'operativa','slug'=>'test-one','title'=>'Test','content_html'=>'<p>Contenuto</p>','publish_at'=>$future];
$row=ed_save($db,$v);
check($row['state']==='draft' && ed_list($db,true)===[],'draft hidden');
rejects(fn()=>ed_save($db,$v),'optimistic revision required');
$v['revision']=1;$v['title']='Revised';$row=ed_save($db,$v);check((int)$row['revision']===2,'draft revision');
rejects(fn()=>ed_schedule($db,['id'=>'TEST001','revision'=>2,'youtube_id'=>'abcdefghijk','facebook_id'=>'123','facebook_url'=>'https://www.facebook.com/123','youtube_publish_at'=>$future,'facebook_publish_at'=>$future]),'approval required');
// Unit fixture only: represent prior editorial approval, without touching filesystem or social APIs.
$db->exec("UPDATE episodes SET state='approved' WHERE id='TEST001'");
$receipt=['id'=>'TEST001','revision'=>2,'youtube_id'=>'abcdefghijk','facebook_id'=>'123','facebook_url'=>'https://www.facebook.com/123','youtube_publish_at'=>$future,'facebook_publish_at'=>$future];
$bad=$receipt;$bad['facebook_publish_at']=gmdate('Y-m-d\\TH:i:s\\Z',time()+9000);
rejects(fn()=>ed_schedule($db,$bad),'reject schedule mismatch');
$row=ed_schedule($db,$receipt);
check($row['state']==='scheduled'&&ed_list($db,true)===[],'future scheduled content hidden');
check(ed_schedule($db,$receipt)['revision']===$row['revision'],'same receipt is idempotent');
$db->exec("UPDATE episodes SET publish_at=1 WHERE id='TEST001'");
check(count(ed_list($db,true))===1,'released content visible without cron');
echo "Smoke test complete; fake receipts are in memory only. No external publication.\n";
