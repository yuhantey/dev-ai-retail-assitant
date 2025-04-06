"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RetrievalService } from "@/agents/retrieval/service";
import { VoiceService } from "@/agents/voice/service";
import { ProductSuggestion } from "@/agents/retrieval/types";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const voiceService = new VoiceService();
  const retrievalService = new RetrievalService();

  useEffect(() => {
    return () => {
      voiceService.stopListening();
    };
  }, []);

  const handleStartListening = () => {
    setError(null);
    voiceService.startListening(
      async (text) => {
        setTranscript(text);
        if (text.trim()) {
          try {
            const result = await retrievalService.processQuery(
              { text, category: "", maxPrice: 0 },
              "sample-customer-1"
            );
            setSuggestions(result.suggestions);
            setFollowUpQuestions(result.followUpQuestions);
            
            // Speak the first suggestion
            if (result.suggestions.length > 0) {
              const suggestion = result.suggestions[0];
              voiceService.speak(
                `I found ${suggestion.name}. ${suggestion.description}. It costs $${suggestion.price}.`
              );
            }
          } catch (err) {
            setError(err.message);
          }
        }
      },
      (err) => {
        setError(err.message);
        setIsListening(false);
      }
    );
    setIsListening(true);
  };

  const handleStopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">AI Retail Assistant</h1>
      
      <div className="mb-8">
        <Button
          onClick={isListening ? handleStopListening : handleStartListening}
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </Button>
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardContent className="pt-6 text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      {transcript && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>You said:</CardTitle>
          </CardHeader>
          <CardContent>
            {transcript}
          </CardContent>
        </Card>
      )}

      {suggestions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Suggestions:</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <CardTitle>{suggestion.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{suggestion.description}</p>
                  <p className="text-primary font-semibold mt-2">${suggestion.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {followUpQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Follow-up Questions:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {followUpQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </main>
  );
} 