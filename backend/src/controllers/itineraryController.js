'use strict';

const { generateItinerary } = require('../services/itineraryService');
const asyncHandler = require('../utils/asyncHandler');

const itineraryController = {
  /**
   * POST /api/itinerary/generate
   * Streams the OpenAI response directly to the client as SSE.
   */
  generate: asyncHandler(async (req, res) => {
    const { destination } = req.body;

    if (!destination) {
      return res.error('Destination is required', null, 400);
    }

    let aiResponse;
    try {
      aiResponse = await generateItinerary(req.body);
    } catch (err) {
      const status = err.statusCode || 500;
      return res.status(status).json({ error: err.message || 'Unknown error' });
    }

    // Set SSE headers and pipe the stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Node 18+ fetch returns a Web ReadableStream — pipe it to Express response
    const reader = aiResponse.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
      }
    };

    // If the client disconnects, cancel the reader
    req.on('close', () => {
      reader.cancel().catch(() => {});
    });

    await pump();
  }),
};

module.exports = itineraryController;
