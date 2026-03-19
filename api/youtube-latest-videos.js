function getUploadsPlaylistId(channelId) {
    if (!channelId || !channelId.startsWith('UC') || channelId.length < 3) {
        return null;
    }
    return `UU${channelId.slice(2)}`;
}

function formatPublishedDate(isoDate) {
    const parsed = isoDate ? new Date(isoDate) : null;
    if (!parsed || Number.isNaN(parsed.valueOf())) {
        return 'Recently uploaded';
    }
    return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

module.exports = async (req, res) => {
    const channelId = req.query.channelId;
    const maxResults = Number(req.query.maxResults || 6);
    const safeMax = Number.isFinite(maxResults)
        ? Math.min(Math.max(maxResults, 1), 12)
        : 6;

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'Server is missing YOUTUBE_API_KEY.' });
        return;
    }

    if (!channelId || typeof channelId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid channelId.' });
        return;
    }

    const playlistId = getUploadsPlaylistId(channelId);
    if (!playlistId) {
        res.status(400).json({ error: 'Invalid YouTube channel id.' });
        return;
    }

    try {
        const endpoint = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
        endpoint.searchParams.set('part', 'snippet,contentDetails');
        endpoint.searchParams.set('playlistId', playlistId);
        endpoint.searchParams.set('maxResults', String(safeMax));
        endpoint.searchParams.set('key', apiKey);

        const response = await fetch(endpoint.toString());
        const data = await response.json();

        if (!response.ok || data.error) {
            res.status(502).json({
                error: (data.error && data.error.message) || 'Failed to fetch latest videos from YouTube.'
            });
            return;
        }

        const items = Array.isArray(data.items) ? data.items : [];
        const videos = items
            .map((item) => {
                const snippet = item.snippet || {};
                const videoId = (item.contentDetails && item.contentDetails.videoId) || '';
                const thumbnail = (snippet.thumbnails && (
                    (snippet.thumbnails.high && snippet.thumbnails.high.url) ||
                    (snippet.thumbnails.medium && snippet.thumbnails.medium.url) ||
                    (snippet.thumbnails.default && snippet.thumbnails.default.url)
                )) || '';

                return {
                    videoId,
                    thumbnail,
                    title: snippet.title || 'Untitled video',
                    meta: `Published ${formatPublishedDate(snippet.publishedAt)}`
                };
            })
            .filter((video) => video.videoId && video.thumbnail);

        res.status(200).json({ videos });
    } catch (error) {
        res.status(500).json({ error: 'Unexpected server error while loading videos.' });
    }
};
