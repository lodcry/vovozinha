# Vovozinha 🌸

App de acessibilidade por voz para Android.

## Configuração rápida

1. Abra `src/config/contacts.ts` e coloque os números reais
2. Build com Codemagic (React Native Android)
3. Instale o APK no tablet
4. Vá em **Configurações > Acessibilidade > Vovozinha** e ative o serviço
5. Conceda permissão de microfone quando pedir

## Comandos de voz

| Fala | O que faz |
|---|---|
| Nome do Dorama | Busca no YouTube |
| "esse" / "quero ver" | Abre o vídeo destacado |
| "próximo" | Próximo vídeo na lista |
| "pula" | Pula anúncio |
| "fecha" | Fecha / volta |
| "pausa" | Play / Pause |
| "desce" / "sobe" | Rola a tela |
| "volta dez" | Volta 10 segundos |
| "avança dez" | Avança 10 segundos |
| "início" | Vai pra tela inicial |
| **"socorro"** | **Liga no WhatsApp pra filha** |

## Notas

- O serviço de acessibilidade precisa ficar ativo em background
- O microfone fica ouvindo sempre — bateria pode cair mais rápido
- Teste o comando "socorro" antes de deixar com ela
