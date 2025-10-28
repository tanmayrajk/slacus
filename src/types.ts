import z from "zod";

export const SpotifyImageSchema = z.object({
    url: z.string(),
    height: z.number(),
    width: z.number()
})

export const SpotifyArtistSchema = z.object({
    external_urls: z.object({
        spotify: z.string()
    }).optional(),
    href: z.string(),
    id: z.string(),
    name: z.string(),
    type: z.string(),
    uri: z.string()
})

export const SpotifyAlbumSchema = z.object({
    album_type: z.string(),
    total_tracks: z.number(),
    available_markets: z.array(z.string()),
    external_urls: z.object({
        spotify: z.string()
    }).optional(),
    href: z.string(),
    id: z.string(),
    images: z.array(SpotifyImageSchema),
    name: z.string(),
    release_date: z.string(),
    release_date_precision: z.string(),
    restrictions: z.object({
        reason: z.string()
    }).optional(),
    type: z.string(),
    uri: z.string(),
    artists: z.array(SpotifyArtistSchema)
})

export const SpotifyTrackSchema = z.object({
    album: SpotifyAlbumSchema,
    artists: z.array(SpotifyArtistSchema),
    available_markets: z.array(z.string()),
    disc_number: z.number(),
    duration_ms: z.number(),
    explicit: z.boolean(),
    external_ids: z.object({
        isrc: z.string().optional(),
        ean: z.string().optional(),
        upc: z.string().optional(),
    }).optional(),
    external_urls: z.object({
        spotify: z.string()
    }).optional(),
    href: z.string(),
    id: z.string(),
    is_playable: z.boolean().optional(),
    linked_from: z.object({}).optional(),
    restrictions: z.object({
        reason: z.string()
    }).optional(),
    name: z.string(),
    popularity: z.number(),
    preview_url: z.string().nullable(),
    track_number: z.number(),
    type: z.string(),
    uri: z.string(),
    is_local: z.boolean().optional()
})

export const SpotifyContextSchema = z.object({
    type: z.string(),
    href: z.string(),
    external_urls: z.object({
        spotify: z.string()
    }).optional(),
    uri: z.string()
})

export const SpotifyDeviceSchema = z.object({
    id: z.string().optional(),
    is_active: z.boolean(),
    is_private_session: z.boolean().optional(),
    is_restricted: z.boolean().optional(),
    name: z.string(),
    type: z.string(),
    volume_percent: z.number().optional(),
    supports_volume: z.boolean().optional()
})

export const SpotifyActionsSchema = z.object({
    interrupting_playback: z.boolean().optional(),
    pausing: z.boolean().optional(),
    resuming: z.boolean().optional(),
    seeking: z.boolean().optional(),
    skipping_next: z.boolean().optional(),
    skipping_prev: z.boolean().optional(),
    toggling_repeat_context: z.boolean().optional(),
    toggling_shuffle: z.boolean().optional(),
    toggling_repeat_track: z.boolean().optional(),
    transferring_playback: z.boolean().optional()
})

export const SpotifyCurrentlyPlayingSchema = z.object({
  device: SpotifyDeviceSchema.optional(),
  repeat_state: z.string().optional(),
  shuffle_state: z.boolean().optional(),
  context: SpotifyContextSchema,
  timestamp: z.number(),
  progress_ms: z.number().nullable(),
  is_playing: z.boolean(),
  item: SpotifyTrackSchema,
  currently_playing_type: z.string(),
  actions: SpotifyActionsSchema,
});

export type SpotifyCurrentlyPlaying = z.infer<typeof SpotifyCurrentlyPlayingSchema>;