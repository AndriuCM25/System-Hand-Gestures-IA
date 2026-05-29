import { useEffect, useRef, useState } from 'react';

export const useVoiceAssistant = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setIsSupported(true);
    }
  }, []);

  const speak = (text, options = {}) => {
    if (!isSupported || !synthRef.current) {
      console.warn('Speech synthesis no está soportado en este navegador');
      return;
    }

    // Cancelar cualquier speech en progreso
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configuración de voz
    utterance.lang = options.lang || 'es-ES';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Eventos
    utterance.onstart = () => {
      setIsSpeaking(true);
      options.onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Error en speech synthesis:', event);
      setIsSpeaking(false);
      options.onError?.(event);
    };

    // Intentar usar una voz en español si está disponible
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') || voice.lang.includes('ES')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const welcome = (userName) => {
    const messages = [
      `Bienvenido al sistema HandControl AI, ${userName}`,
      `Hola ${userName}, sistema de navegación por gestos activado`,
      `${userName}, bienvenido. Todos los sistemas operativos`,
      `Acceso concedido. Bienvenido ${userName}`,
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage, {
      rate: 0.95,
      pitch: 1.1,
    });
  };

  const announce = (message, type = 'info') => {
    const rates = {
      success: 1.0,
      error: 0.9,
      warning: 0.95,
      info: 1.0,
    };

    speak(message, {
      rate: rates[type] || 1.0,
      pitch: type === 'error' ? 0.9 : 1.0,
    });
  };

  const gestureDetected = (gestureName) => {
    const messages = {
      'Mano Abierta': 'Sistema activado',
      'Puño Cerrado': 'Sistema en pausa',
      'Pulgar Arriba': 'Confirmado',
      'Dos Dedos': 'Menú abierto',
      'Mano Derecha': 'Siguiente',
      'Mano Izquierda': 'Anterior',
    };

    const message = messages[gestureName];
    if (message) {
      speak(message, { rate: 1.2, volume: 0.7 });
    }
  };

  return {
    isSupported,
    isSpeaking,
    speak,
    stop,
    welcome,
    announce,
    gestureDetected,
  };
};
