export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.isSupported = true;

      // Add event listeners
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        this.isListening = true;
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.isListening = false;
      };
    }
  }

  isBrowserSupported(): boolean {
    return this.isSupported;
  }

  startListening(onResult: (transcript: string) => void, onError?: (error: string) => void) {
    if (!this.isSupported) {
      const error = 'Speech recognition is not supported in your browser. Please try Chrome or Edge.';
      onError?.(error);
      throw new Error(error);
    }

    if (!this.recognition) {
      const error = 'Failed to initialize speech recognition';
      onError?.(error);
      throw new Error(error);
    }

    try {
      // Clear previous event listeners
      this.recognition.onresult = null;
      this.recognition.onerror = null;

      // Set up new event listeners
      this.recognition.onresult = (event) => {
        console.log('Speech recognition result:', event);
        const results = event.results;
        console.log('Results length:', results.length);
        
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < results.length; i++) {
          const result = results[i];
          console.log('Result item:', result);
          console.log('Is final:', result.isFinal);
          
          const transcript = result[0].transcript;
          console.log('Transcript:', transcript);
          
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        console.log('Final transcript:', finalTranscript);
        console.log('Interim transcript:', interimTranscript);
        
        // Only update with final results
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        const error = `Speech recognition error: ${event.error}`;
        onError?.(error);
        this.isListening = false;
      };

      // Start recognition
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      const errorMessage = `Failed to start listening: ${error}`;
      onError?.(errorMessage);
      this.isListening = false;
      throw new Error(errorMessage);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Error stopping recognition:', error);
        this.isListening = false;
      }
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
} 