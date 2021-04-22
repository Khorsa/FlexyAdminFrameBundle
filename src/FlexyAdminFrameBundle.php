<?php
namespace flexycms\FlexyAdminFrameBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class FlexyAdminFrameBundle extends Bundle
{
    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}