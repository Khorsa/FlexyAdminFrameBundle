<?php
namespace flexycms\FlexyAdminFrameBundle\Services;

use App\Kernel;
use Symfony\Component\Config\Loader\Loader;
use \Symfony\Component\Routing\RouteCollection;

class ModulesRouteLoader extends Loader
{
    private $kernel;
    public function __construct(Kernel $kernel)
    {
        $this->kernel = $kernel;
    }


    private $loaded = false;

    public function load($resource, string $type = null): RouteCollection
    {
        if ($this->loaded) throw new \Exception('Do not add the "extra" loader twice');
        $routes = new RouteCollection();


        // Находим установленные модули админки
        $bundles = $this->kernel->getContainer()->getParameter('kernel.bundles');
        $routeFiles = [];
        foreach($bundles as $name => $path) {

            if (strpos($path, 'flexycms\\') === false) continue;

            // Находим yaml-файлы модулей
            if ($name === 'FlexyAdminFrameBundle') continue;    // Пропускаем

            $routeFile = "@{$name}/config/routes.yaml";
            $routeFilePath = null;
            try {
                $routeFilePath = $this->kernel->locateResource($routeFile);
            } catch(\Exception $e) {

            }
            if ($routeFilePath === null) continue;

            $routeFiles[] = $routeFile;
        }

        // Импортируем
        foreach($routeFiles as $file) {
            $importedRoutes = $this->import($file, 'yaml');
            $routes->addCollection($importedRoutes);
        }

        $this->loaded = true;
        return $routes;
    }


    public function supports($resource, string $type = null)
    {
        return $type === 'flexy_modules_route_loader';
    }
}