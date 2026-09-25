<x-filament-widgets::widget>
    <x-filament::section heading="SEO & indexering">
        <dl class="grid gap-4 sm:grid-cols-3">
            @foreach (['cities' => 'Indexeerbare steden', 'services' => 'Indexeerbare diensten', 'articles' => 'Indexeerbare artikelen', 'projects' => 'Indexeerbare realisaties', 'materials' => 'Indexeerbare materialen'] as $type => $label)
                <div><dt>{{ $label }}</dt><dd>{{ $counts[$type] ?? 0 }}</dd></div>
            @endforeach
            <div><dt>Indexeerbare CMS-taal-URLs</dt><dd>{{ $urls }}</dd></div>
        </dl>
        <p class="mt-4">Laatste succesvolle refresh: {{ $status?->succeeded_at ?? 'Nog niet uitgevoerd' }}</p>
        @if ($status?->last_error)<p role="alert">{{ $status->last_error }}</p>@endif
        <div class="mt-4 flex flex-wrap gap-4">
            <x-filament::button wire:click="refreshSeo" wire:loading.attr="disabled">SEO-cache & sitemap vernieuwen</x-filament::button>
            <a href="{{ $origin }}/sitemap.xml" target="_blank" rel="noopener">Sitemap openen</a>
            <a href="{{ $origin }}/robots.txt" target="_blank" rel="noopener">robots.txt openen</a>
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
