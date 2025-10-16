'use client';
import { useState, useTransition, useContext, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LanguageContext } from '@/context/language-context';
import { getAssistantResponse } from '@/app/actions';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface WeatherAssistantProps {
    currentCountry: string;
    onCountryChange: (country: string) => void;
}

export function WeatherAssistant({ currentCountry, onCountryChange }: WeatherAssistantProps) {
  const { lang, translations } = useContext(LanguageContext);
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A bit of a hack to scroll to the bottom.
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await getAssistantResponse({ query: input, lang, currentCountry }, [...messages, userMessage]);
      
      if (result.success && result.data) {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.data.answer }]);
        if (result.data.targetCountry) {
            onCountryChange(result.data.targetCountry);
        }
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.error || translations.error }]);
      }
    });
  };

  return (
    <Card className="max-w-3xl mx-auto bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            <CardTitle className="font-headline">{translations.assistantTitle}</CardTitle>
        </div>
        <CardDescription>{translations.assistantDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <ScrollArea className="h-64 w-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        {translations.assistantWelcome}
                    </div>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && <Sparkles className="size-5 text-accent flex-shrink-0 mt-1" />}
                    <div
                        className={`rounded-lg px-3 py-2 max-w-[85%] ${
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                    >
                        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</ReactMarkdown>
                    </div>
                    </div>
                ))}
                {isPending && messages[messages.length-1].role === 'user' && (
                    <div className="flex gap-2">
                        <Sparkles className="size-5 text-accent flex-shrink-0 mt-1" />
                        <div className="rounded-lg px-3 py-2 bg-muted">
                            <Loader className="size-5 animate-spin" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={translations.assistantPlaceholder}
                    disabled={isPending}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader className="animate-spin" /> : translations.send}
                </Button>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
