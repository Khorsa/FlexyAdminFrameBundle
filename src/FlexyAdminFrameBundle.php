<?php
namespace flexycms\FlexyAdminFrameBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class FlexyAdminFrameBundle extends Bundle
{
	public function build(ContainerBuilder $container)
	{
        parent::build($container);

        $htaccess = "DirectoryIndex /public/index.php
RewriteEngine On

RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^(.+) $1 [L]

RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
RewriteRule ^(.+) /public/$1 [L]

Options +SymLinksIfOwnerMatch
#Options +FollowSymlinks
RewriteRule ^(.+)$ /public/ [QSA,L]";

        $rootDir = $container->getParameter('kernel.project_dir');

        dump($rootDir);

        if (!is_file($rootDir . "/.htaccess")) {
            file_put_contents($rootDir . "/.htaccess", $htaccess);
        }

        if (!is_dir($rootDir . "/public")) mkdir($rootDir . "/public");
        if (!is_dir($rootDir . "/public/uploads")) mkdir($rootDir . "/public/uploads");

	}
	
	
	
    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}