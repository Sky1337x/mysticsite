module.exports = async (req, res) => {
    const channelId = req.query.channelId;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'Server is missing YOUTUBE_API_KEY.' });
        return;
    }

    if (!channelId || typeof channelId !== 'string') {
        res.status(400).json({ error: 'Missing or invalid channelId.' });
        return;
    }

    try {
        const endpoint = new URL('https://www.googleapis.com/youtube/v3/channels');
        endpoint.searchParams.set('part', 'statistics');
        endpoint.searchParams.set('id', channelId);
        endpoint.searchParams.set('key', apiKey);

        const response = await fetch(endpoint.toString());
        const data = await response.json();

        if (!response.ok || data.error) {
            res.status(502).json({
                error: (data.error && data.error.message) || 'Failed to fetch channel metrics from YouTube.'
            });
            return;
        }

        const item = Array.isArray(data.items) ? data.items[0] : null;
        if (!item || !item.statistics) {
            res.status(404).json({ error: 'No channel statistics were returned.' });
            return;
        }

        res.status(200).json({ statistics: item.statistics });
    } catch (error) {
        res.status(500).json({ error: 'Unexpected server error while loading metrics.' });
    }
};
