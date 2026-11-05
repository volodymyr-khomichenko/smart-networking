import { permanentRedirect } from "next/navigation";

const PRIVACY_POLICY_URL = "https://khomichenko.com/privacy-policy/";

export default function PrivacyPage() {
  permanentRedirect(PRIVACY_POLICY_URL);
}
