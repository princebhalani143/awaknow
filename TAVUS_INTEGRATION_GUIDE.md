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

**Important**: Replace `your_actual_tavus_api_key_here` with your real Tavus API key.

## Step 2: Tavus API Integration Status

### Current Implementation
The integration now includes:

✅ **Real API Integration**: Ready to use with proper API key
✅ **Mock Fallback**: Automatically falls back to mock if API key is missing
✅ **Error Handling**: Comprehensive error handling and fallback mechanisms
✅ **Usage Tracking**: Tracks minutes used and updates subscription limits
✅ **Database Integration**: Stores session data and usage statistics

### API Endpoints Used
- `POST /v2/conversations` - Create new conversation
- `GET /v2/conversations/{id}` - Get conversation status
- `POST /v2/conversations/{id}/end` - End conversation

## Step 3: How It Works

### 1. Session Creation Flow
```
User starts session → Create session in DB → Call Tavus API → Return video URL → User joins conversation
```

### 2. API Request Structure
```typescript
{
  conversation_name: "reflect_alone_session_123",
  persona_id: "persona_reflection_coach",
  callback_url: "https://yourapp.com/api/tavus/callback",
  properties: {
    max_call_duration: 30,
    participant_left_timeout: 60,
    participant_absent_timeout: 120,
    enable_recording: true,
    enable_transcription: true,
    language: "en"
  }
}
```

### 3. Response Handling
- Success: Returns conversation URL for user to join
- Error: Falls back to mock implementation
- Usage: Tracks minutes and updates user limits

## Step 4: Configuration Steps

### 1. Get Your Tavus API Key
1. Sign up at [https://tavus.io](https://tavus.io)
2. Go to your dashboard
3. Navigate to API settings
4. Copy your API key

### 2. Update Environment Variables
```bash
# In your .env file
VITE_TAVUS_API_KEY=your_real_api_key_here
```

### 3. Configure Persona IDs
Update the persona IDs in `TavusService.getPersonaId()`:

```typescript
private static getPersonaId(sessionType: string): string {
  switch (sessionType) {
    case 'reflect_alone':
      return 'your_reflection_persona_id'; // Replace with actual ID
    case 'resolve_together':
      return 'your_mediator_persona_id'; // Replace with actual ID
    default:
      return 'your_default_persona_id'; // Replace with actual ID
  }
}
```

## Step 5: Testing

### Development Mode (Mock)
- If no API key is set, automatically uses mock responses
- Simulates video URLs and tracks usage
- Perfect for development and testing

### Production Mode (Real API)
- Set your real Tavus API key
- Makes actual API calls to Tavus
- Returns real conversation URLs

### Testing Steps
1. **Without API Key**: Test mock functionality
2. **With API Key**: Test real Tavus integration
3. **Error Scenarios**: Test fallback mechanisms
4. **Usage Limits**: Test subscription limit enforcement

## Step 6: Monitoring & Analytics

### Usage Tracking
- Minutes used per session
- Total usage per user
- Monthly usage limits
- Session success/failure rates

### Database Tables
- `tavus_usage`: Tracks individual session usage
- `user_subscriptions`: Tracks monthly limits
- `sessions`: Stores Tavus session IDs and URLs

## Step 7: Troubleshooting

### Common Issues

1. **"API Key Not Configured"**
   - Check your `.env` file
   - Ensure `VITE_TAVUS_API_KEY` is set
   - Restart your development server

2. **"Tavus API Error: 401"**
   - Invalid API key
   - Check key in Tavus dashboard
   - Ensure no extra spaces in `.env`

3. **"Insufficient Tavus Minutes"**
   - User has reached monthly limit
   - Check subscription plan
   - Upgrade user's plan

4. **Mock Mode Always Active**
   - API key not properly set
   - Check environment variable loading
   - Verify `.env` file location

### Debug Mode
Enable debug logging by checking browser console:
- API requests and responses
- Error messages and fallbacks
- Usage tracking updates

## Step 8: Production Deployment

### Before Going Live
1. ✅ Set real Tavus API key
2. ✅ Configure proper persona IDs
3. ✅ Test with real API calls
4. ✅ Set up callback URLs (if needed)
5. ✅ Monitor usage and costs

### Environment Variables for Production
```env
VITE_TAVUS_API_KEY=prod_api_key_here
```

## Step 9: Advanced Features

### Callback Integration (Optional)
Set up webhook endpoints to receive:
- Conversation start/end events
- Usage statistics
- Recording URLs
- Transcription data

### Custom Personas
Create custom AI personas in Tavus dashboard:
- Reflection coach for solo sessions
- Mediator for conflict resolution
- Specialized coaches for different needs

## Support & Resources

### Tavus Resources
- [Tavus Documentation](https://docs.tavus.io)
- [API Reference](https://docs.tavus.io/api-reference)
- [Tavus Dashboard](https://app.tavus.io)

### AwakNow Integration
- Check `TavusService` implementation
- Review error handling in browser console
- Test with different subscription plans
- Monitor database usage tracking

## Next Steps

1. **Get API Key**: Sign up for Tavus and get your API key
2. **Test Integration**: Start with mock mode, then switch to real API
3. **Configure Personas**: Set up custom AI personas for your use cases
4. **Monitor Usage**: Track API costs and user engagement
5. **Optimize**: Fine-tune based on user feedback and usage patterns

The integration is now ready to use! Simply add your Tavus API key to start using real AI conversations.