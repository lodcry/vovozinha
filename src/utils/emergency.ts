import { Linking } from "react-native";
import { EMERGENCY_CONTACTS } from "../config/contacts";
import { speak } from "./tts";

export async function triggerEmergency() {
  const contact = EMERGENCY_CONTACTS[0]; // filha primeiro

  speak(`Ligando para ${contact.name}. Aguarde.`);

  await new Promise((r) => setTimeout(r, 2000));

  // Abre WhatsApp com chamada de vídeo
  const whatsappUrl = `whatsapp://send?phone=${contact.phone}&text=Preciso+de+ajuda!`;

  const canOpen = await Linking.canOpenURL(whatsappUrl);
  if (canOpen) {
    await Linking.openURL(whatsappUrl);
  } else {
    // fallback: ligação normal
    Linking.openURL(`tel:${contact.phone}`);
  }
}

export async function triggerEmergencySecondContact() {
  const contact = EMERGENCY_CONTACTS[1];
  speak(`Ligando para ${contact.name}. Aguarde.`);
  await new Promise((r) => setTimeout(r, 2000));
  const whatsappUrl = `whatsapp://send?phone=${contact.phone}&text=Preciso+de+ajuda!`;
  const canOpen = await Linking.canOpenURL(whatsappUrl);
  if (canOpen) {
    await Linking.openURL(whatsappUrl);
  } else {
    Linking.openURL(`tel:${contact.phone}`);
  }
}
