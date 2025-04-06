import { VoiceService } from './service.ts';

async function testVoiceService() {
  console.log('Testing Voice Service...\n');
  
  const voiceService = new VoiceService();
  
  // Test 1: Speech Synthesis
  console.log('Test 1: Speech Synthesis');
  try {
    voiceService.speak('Hello! I am your AI retail assistant. How can I help you today?');
    console.log('Speech synthesis test completed');
  } catch (error) {
    console.error('Error in speech synthesis:', error);
  }
  
  // Test 2: Speech Recognition
  console.log('\nTest 2: Speech Recognition');
  console.log('Please speak something...');
  
  try {
    voiceService.startListening(
      (text) => {
        console.log('Recognized text:', text);
        if (text.toLowerCase().includes('stop')) {
          voiceService.stopListening();
        }
      },
      (error) => {
        console.error('Recognition error:', error);
      }
    );
  } catch (error) {
    console.error('Error in speech recognition:', error);
  }
}

// Run the tests
testVoiceService().catch(console.error); 