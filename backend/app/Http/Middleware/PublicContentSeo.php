<?php

namespace App\Http\Middleware;

use App\Support\ContentSeo;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class PublicContentSeo
{
    public function handle(Request $request, Closure $next): Response
    {
        $types = ['services' => 'services', 'cities' => 'cities', 'knowledge-articles' => 'articles', 'projects' => 'projects', 'materials' => 'materials'];
        $type = $types[$request->segment(2)] ?? null;
        $record = null;
        if ($request->isMethod('GET') && $type && $request->route('slug')) {
            $record = ContentSeo::resolve($type, (string) $request->query('locale', 'nl'), $request->route('slug'));
        }
        $response = $next($request);
        if ($record && $response instanceof JsonResponse && $response->isSuccessful()) {
            $data = $response->getData(true);
            if (isset($data['data'])) {
                $data['data'] = array_merge($data['data'], ContentSeo::metadata($record));
            } else {
                $data = array_merge($data, ContentSeo::metadata($record));
                if ($type === 'projects') {
                    $data['all_slugs'] = ContentSeo::slugs($record);
                }
            }
            $response->setData($data);
        }
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        return $response;
    }
}
