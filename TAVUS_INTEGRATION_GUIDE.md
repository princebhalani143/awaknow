# Tavus Integration Guide for AwakNow

## Overview
This guide provides step-by-step instructions for integrating Tavus conversational video AI into AwakNow using environment variables for configuration.

## Your Tavus Configuration
- **Persona ID**: Configured via `VITE_TAVUS_PERSONA_ID` (default: `p7e13c73f41f`)
- **Replica ID**: Configured via `VITE_TAVUS_REPLICA_ID` (default: `r4317e64d25a`)
- **API Endpoint**: `https://tavusapi.com/v2/personas`

## Prerequisites
1. **Tavus API Account**: Sign up at [https://tavus.io](https://tavus.io)
2. **API Key**: Obtain your API key from the Tavus dashboard
3. **Environment Setup**: Add your API key and persona details to the `.env` file

## Step 1: Environment Configuration

Add your Tavus configuration to your `.env` file:

```env
VITE_TAVUS_API_KEY=your_actual_tavus_api_key_here
VITE_TAVUS_PERSONA_ID=p7e13c73f41f
VITE_TAVUS_REPLICA_ID=r4317e64d25a
```

**Important**: 
- Replace `your_actual_tavus_api_key_here` with your real Tavus API key
- You can update the persona and replica IDs as needed without changing code

## Step 2: Tavus API Integration Status

### Current Implementation
The integration now includes:

✅ **Environment-based Configuration**: Uses environment variables with fallbacks
✅ **Specific Persona/Replica**: Uses your exact IDs from environment or defaults
✅ **Persona Verification**: Validates persona exists using `GET /v2/personas/{personaId}`
✅ **Real API Integration**: Ready to use with proper API key
✅ **Mock Fallback**: Automatically falls back to mock if API key is missing
✅ **Error Handling**: Comprehensive error handling and fallback mechanisms
✅ **Usage Tracking**: Tracks minutes used and updates subscription limits
✅ **Database Integration**: Stores session data and usage statistics
✅ **Session Management**: Prevents parallel sessions and ensures proper cleanup

### API Endpoints Used
- `GET /v2/personas/{personaId}` - Verify your persona exists
- `POST /v2/conversations` - Create new conversation with your persona/replica
- `GET /v2/conversations/{id}` - Get conversation status
- `POST /v2/conversations/{id}/end` - End conversation

## Step 3: How It Works

### 1. Persona Verification Flow
```
App starts → Verify persona exists → Create conversation with verified persona
```

### 2. API Request Structure
```typescript
{
  conversation_name: "awaknow_reflect_alone_session_123",
  persona_id: "p7e13c73f41f", // From environment or fallback
  replica_id: "r4317e64d25a", // From environment or fallback
  callback_url: "https://yourapp.com/api/tavus/callback",
  properties: {
    max_call_duration: 300,
    participant_left_timeout: 60,
    participant_absent_timeout: 120,
    enable_recording: true,
    enable_transcription: true,
    language: "English"
  }
}
```

### 3. Response Handling
- Success: Returns conversation URL for user to join
- Error: Falls back to mock implementation with your persona ID
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
VITE_TAVUS_PERSONA_ID=p7e13c73f41f
VITE_TAVUS_REPLICA_ID=r4317e64d25a
```

### 3. Verify Your Persona
The app will automatically verify your persona exists by calling:
```
GET https://tavusapi.com/v2/personas/{personaId}
```

## Step 5: Testing

### Development Mode (Mock)
- If no API key is set, automatically uses mock responses
- Shows your actual persona/replica IDs in the interface
- Simulates video URLs and tracks usage
- Perfect for development and testing

### Production Mode (Real API)
- Set your real Tavus API key
- Verifies persona exists
- Makes actual API calls to Tavus
- Returns real conversation URLs

### Testing Steps
1. **Without API Key**: Test mock functionality with your persona IDs
2. **With API Key**: Test real Tavus integration
3. **Persona Verification**: Check browser console for persona validation
4. **Error Scenarios**: Test fallback mechanisms
5. **Usage Limits**: Test subscription limit enforcement

## Step 6: Monitoring & Analytics

### Usage Tracking
- Minutes used per session
- Total usage per user
- Monthly usage limits
- Session success/failure rates
- Persona-specific analytics

### Database Tables
- `tavus_usage`: Tracks individual session usage with persona ID
- `user_subscriptions`: Tracks monthly limits
- `sessions`: Stores Tavus session IDs and URLs

## Step 7: Troubleshooting

### Common Issues

1. **"API Key Not Configured"**
   - Check your `.env` file
   - Ensure `VITE_TAVUS_API_KEY` is set
   - Restart your development server

2. **"Persona verification failed"**
   - Check if persona exists in your Tavus account
   - Verify API key has access to this persona
   - Check browser console for detailed error messages

3. **"Tavus API Error: 401"**
   - Invalid API key
   - Check key in Tavus dashboard
   - Ensure no extra spaces in `.env`

4. **"Tavus API Error: 404"**
   - Persona not found
   - Verify persona exists in your Tavus account
   - Check persona ID spelling in environment variables

5. **"Mock Mode Always Active"**
   - API key not properly set
   - Persona verification failed
   - Check environment variable loading

### Debug Mode
Enable debug logging by checking browser console:
- Persona verification requests/responses
- API requests and responses with your persona ID
- Error messages and fallbacks
- Usage tracking updates

## Step 8: Production Deployment

### Before Going Live
1. ✅ Set real Tavus API key
2. ✅ Verify persona is active
3. ✅ Test with real API calls
4. ✅ Set up callback URLs (if needed)
5. ✅ Monitor usage and costs

### Environment Variables for Production
```env
VITE_TAVUS_API_KEY=prod_api_key_here
VITE_TAVUS_PERSONA_ID=p7e13c73f41f
VITE_TAVUS_REPLICA_ID=r4317e64d25a
```

## Step 9: Advanced Features

### Persona Information
The app displays your persona information:
- Persona ID: From environment or fallback
- Replica ID: From environment or fallback
- Status: Live/Mock mode indicator

### Callback Integration (Optional)
Set up webhook endpoints to receive:
- Conversation start/end events
- Usage statistics for your persona
- Recording URLs
- Transcription data

### Custom Conversation Names
Conversations are named with pattern:
```
awaknow_{session_type}_{session_id}
```

## Step 10: API Reference

### Get Persona Information
```bash
curl -X GET "https://tavusapi.com/v2/personas/{personaId}" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Create Conversation
```bash
curl -X POST "https://tavusapi.com/v2/conversations" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_name": "awaknow_test_session",
    "persona_id": "p7e13c73f41f",
    "replica_id": "r4317e64d25a"
  }'
```

## Support & Resources

### Tavus Resources
- [Tavus Documentation](https://docs.tavus.io)
- [API Reference](https://docs.tavus.io/api-reference)
- [Tavus Dashboard](https://app.tavus.io)

### AwakNow Integration
- Check `TavusService` implementation
- Review persona verification in browser console
- Test with different subscription plans
- Monitor database usage tracking

## Next Steps

1. **Get API Key**: Sign up for Tavus and get your API key
2. **Configure Environment**: Set your API key and persona/replica IDs in `.env`
3. **Test Integration**: Start with mock mode, then switch to real API
4. **Verify Persona**: Ensure your persona is accessible
5. **Monitor Usage**: Track API costs and user engagement
6. **Optimize**: Fine-tune based on user feedback and usage patterns

The integration is now ready to use with environment-based configuration! Simply add your Tavus API key and persona/replica IDs to start using real AI conversations.

## Current Status Summary

✅ **Environment Configuration**: Uses `.env` variables with fallbacks
✅ **Persona ID**: From environment or fallback to `p7e13c73f41f`
✅ **Replica ID**: From environment or fallback to `r4317e64d25a`
✅ **API Integration**: Ready for your API key
✅ **Verification**: Automatic persona validation
✅ **Fallback**: Mock mode with your persona IDs
✅ **UI**: Shows your specific persona information
✅ **Database**: Tracks usage with persona context

Just add your Tavus API key and persona/replica IDs to `.env` and you're ready to go!