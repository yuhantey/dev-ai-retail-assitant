import React, { useState, useEffect } from 'react'
import { Button } from "./components/ui/button"
import { VoiceService } from './services/voice'
import { RetrievalService } from './services/retrieval'

const voiceService = new VoiceService()
const retrievalService = new RetrievalService()

function App() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const supported = voiceService.isBrowserSupported()
    console.log('Browser support for speech recognition:', supported)
    setIsSupported(supported)
    return () => {
      // Cleanup when component unmounts
      if (voiceService.isCurrentlyListening()) {
        voiceService.stopListening()
      }
    }
  }, [])

  const handleStartListening = () => {
    console.log('Starting voice recognition...')
    setError(null)
    setTranscript('') // Clear previous transcript
    setProducts([]) // Clear previous products
    try {
      voiceService.startListening(
        async (text) => {
          console.log('Received transcript:', text)
          setTranscript(text)
          setIsLoading(true)
          
          try {
            // Search with RAG
            const { products: foundProducts } = await retrievalService.getSuggestions(text)
            setProducts(foundProducts)
          } catch (error) {
            console.error('RAG search error:', error)
            setError('Failed to search products')
          } finally {
            setIsLoading(false)
          }
        },
        (error) => {
          console.error('Voice recognition error:', error)
          setError(error)
          setIsListening(false)
        }
      )
      setIsListening(true)
    } catch (error) {
      console.error('Error starting voice recognition:', error)
      setError(error instanceof Error ? error.message : 'Failed to start listening')
      setIsListening(false)
    }
  }

  const handleStopListening = () => {
    console.log('Stopping voice recognition...')
    try {
      voiceService.stopListening()
      setIsListening(false)
    } catch (error) {
      console.error('Error stopping voice recognition:', error)
      setError('Failed to stop listening')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">AI Retail Assistant</h1>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <div className="bg-card p-6 rounded-lg shadow space-y-4">
          <p>Welcome to AI Retail Assistant</p>
          <div className="space-y-4">
            {!isSupported && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <p>Speech recognition is not supported in your browser. Please try Chrome or Edge.</p>
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
                <p>{error}</p>
              </div>
            )}
            <div className="space-x-2">
              <Button 
                onClick={handleStartListening}
                disabled={isListening || !isSupported}
              >
                {isListening ? 'Listening...' : 'Start Listening'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleStopListening}
                disabled={!isListening}
              >
                Stop Listening
              </Button>
            </div>
            {transcript && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">You said:</p>
                <p>{transcript}</p>
              </div>
            )}
            {isLoading && (
              <div className="p-4 bg-muted rounded-lg">
                <p>Searching for products...</p>
              </div>
            )}
            {products.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Found Products:</h2>
                {products.map((product) => (
                  <div key={product.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">${product.price}</p>
                    <p className="mt-2">{product.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 