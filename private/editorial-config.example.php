<?php
// Copy to the parent directory of httpdocs as welora-editorial-config.php.
// Create the storage directory outside httpdocs, writable only by PHP service user.
// Generate independent credentials; store secret values only on server/runner.
return [
    'storage_dir' => '/var/www/vhosts/welora.it/editorial-data',
    'admin_user' => '',
    'admin_password_hash' => '', // password_hash() output
    'github_dispatch_token' => '', // Fine-grained token: Actions write on private welora-social only.
    'runner_token_hash' => '', // hash('sha256', random 32+ byte secret)
];
