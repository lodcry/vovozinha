export type CommandAction =
  | "PULAR_ANUNCIO"
  | "FECHAR"
  | "PROXIMO"
  | "VOLTAR"
  | "PAUSAR"
  | "ROLAR_BAIXO"
  | "ROLAR_CIMA"
  | "HOME"
  | "SOCORRO"
  | "SELECIONAR"
  | "BUSCAR_DORAMA"
  | "CONFIRMAR_VIDEO"
  | "REJEITAR_VIDEO"
  | "VOLTAR_SEGUNDOS"
  | "AVANCAR_SEGUNDOS";

export interface Command {
  keywords: string[];
  action: CommandAction;
  payload?: string;
}

export const COMMANDS: Command[] = [
  { keywords: ["pula", "pular", "pula anúncio", "pular anúncio", "skip"], action: "PULAR_ANUNCIO" },
  { keywords: ["fecha", "fechar", "sai", "sair", "fecha isso", "fechar isso"], action: "FECHAR" },
  { keywords: ["próximo", "próxima", "avança", "avançar", "outro", "outra"], action: "PROXIMO" },
  { keywords: ["volta", "voltar", "anterior", "de volta"], action: "VOLTAR" },
  { keywords: ["pausa", "pausar", "para", "parar", "continua", "continuar", "play"], action: "PAUSAR" },
  { keywords: ["desce", "descer", "rola baixo", "rolar baixo", "mais", "mais embaixo"], action: "ROLAR_BAIXO" },
  { keywords: ["sobe", "subir", "rola cima", "rolar cima", "cima"], action: "ROLAR_CIMA" },
  { keywords: ["início", "inicio", "home", "tela inicial", "começo"], action: "HOME" },
  { keywords: ["socorro", "ajuda", "emergência", "emergencia", "chama", "chama alguém"], action: "SOCORRO" },
  { keywords: ["esse", "esse aqui", "quero ver", "quero esse", "roda esse", "abre esse", "sim"], action: "CONFIRMAR_VIDEO" },
  { keywords: ["não", "nao", "esse não", "próximo", "outro"], action: "REJEITAR_VIDEO" },
  { keywords: ["volta dez", "volta dez segundos", "voltar dez"], action: "VOLTAR_SEGUNDOS" },
  { keywords: ["avança dez", "avança dez segundos", "avançar dez"], action: "AVANCAR_SEGUNDOS" },
];

export function matchCommand(spoken: string): Command | null {
  const normalized = spoken
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  for (const cmd of COMMANDS) {
    for (const keyword of cmd.keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes(normalizedKeyword)) {
        return cmd;
      }
    }
  }

  // Se não bateu nenhum comando, trata como busca de dorama
  if (normalized.length > 2) {
    return { keywords: [], action: "BUSCAR_DORAMA", payload: spoken };
  }

  return null;
}
