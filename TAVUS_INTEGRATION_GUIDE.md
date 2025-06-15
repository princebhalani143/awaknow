# Tavus Integration Guide for AwakNow

## Overview
This guide provides step-by-step instructions for integrating Tavus conversational video AI into AwakNow.

## Prerequisites
1. **Tavus API Account**: Sign up at [https://tavus.io](https://tavus.io)
2. **API Key**: Obtain your API key from the Tavus dashboard
3. **Environment Setup**: Add your API key to the `.env` file

## Step 1: Environment Configuration

Add your Tavus API key to your `.env` file:

```env
VITE_TAVUS_API_KEY=your_actual_tavus_api_key_here
```

## Step 2: Tavus API Integration

The current implementation in `src/services/tavusService.ts` includes:

### Mock Implementation (Currently Active)
- Simulates Tavus API calls for development
- Returns mock video URLs and session IDs
- Tracks usage in the database

### Real API Integration (Ready to Activate)

To enable real Tavus integration, uncomment and modify the `callTavusAPI` method in `TavusService`:

```typescript
private static async callTavusAPI(request: TavusVideoRequest): Promise<TavusVideoResponse> {
  try {
    const response = await fetch(`${this.baseUrl}/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        context: request.participantContext,
        session_type: request.sessionType,
        // Add other Tavus-specific parameters based on their API docs
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavus API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      videoUrl: data.video_url,
      tavusSessionId: data.session_id,
      minutesUsed: data.duration_minutes,
    };
  } catch (error) {
    console.error('Tavus API error:', error);
    return {
      success: false,
      error: 'Failed to create video with Tavus API',
    };
  }
}
```

## Step 3: API Endpoint Configuration

Update the `baseUrl` in `TavusService` based on Tavus documentation:

```typescript
private static baseUrl = 'https://api.tavus.io/v1'; // Verify this URL with Tavus docs
```

## Step 4: Request Parameters

Customize the API request parameters based on Tavus API specifications:

### For Reflect Alone Sessions:
```typescript
{
  prompt: "User's reflection input",
  context: "Personal emotional wellness session",
  session_type: "reflect_alone",
  // Add Tavus-specific parameters:
  // persona_id: "your_ai_persona_id",
  // voice_settings: { ... },
  // video_settings: { ... }
}
```

### For Resolve Together Sessions:
```typescript
{
  prompt: "Conflict resolution context",
  context: "Group mediation session",
  session_type: "resolve_together",
  participants: ["user1_id", "user2_id"],
  // Add Tavus-specific parameters for group sessions
}
```

## Step 5: Error Handling

The service includes comprehensive error handling:

1. **Usage Limits**: Checks user's remaining Tavus minutes
2. **API Errors**: Handles network and API response errors
3. **Database Updates**: Tracks usage and updates user limits
4. **User Feedback**: Provides clear error messages

## Step 6: Testing

### Development Testing (Mock Mode)
1. Create a session in the app
2. Verify mock video URLs are generated
3. Check database for usage tracking
4. Confirm subscription limits are enforced

### Production Testing (Real API)
1. Replace mock implementation with real API calls
2. Test with small usage limits first
3. Verify video generation and playback
4. Monitor API response times and errors

## Step 7: Usage Tracking

The system automatically tracks:
- Minutes used per session
- Total usage per user
- Monthly usage limits
- Session-to-video mapping

## Step 8: Subscription Integration

Usage limits are enforced based on subscription plans:

- **Free**: 25 minutes/month
- **Reflect+**: 100 minutes/month  
- **Resolve Together**: 500 minutes/month

## Step 9: Video Playback

Videos are displayed in the session interface:
- Embedded video player
- Progress tracking
- Transcript display (if provided by Tavus)
- Session notes integration

## Troubleshooting

### Common Issues:

1. **API Key Invalid**
   - Verify key in Tavus dashboard
   - Check environment variable loading

2. **Rate Limiting**
   - Implement retry logic with exponential backoff
   - Monitor API usage in Tavus dashboard

3. **Video Generation Timeout**
   - Increase timeout values
   - Implement progress indicators
   - Add fallback messaging

4. **Usage Tracking Mismatch**
   - Verify database triggers
   - Check subscription limit calculations
   - Monitor for concurrent session issues

## Next Steps

1. **Get Tavus API Key**: Contact Tavus for API access
2. **Review API Documentation**: Study Tavus-specific parameters
3. **Test Integration**: Start with mock mode, then switch to real API
4. **Monitor Usage**: Track API costs and user engagement
5. **Optimize Performance**: Implement caching and error recovery

## Support

For Tavus-specific questions:
- Tavus Documentation: [https://docs.tavus.io](https://docs.tavus.io)
- Tavus Support: Contact through their dashboard

For AwakNow integration questions:
- Check the `TavusService` implementation
- Review database schema for usage tracking
- Test with subscription limits